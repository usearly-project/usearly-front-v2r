import { useEffect, useRef, useState } from "react";
import "./videoContainerLanding.scss";
import { useIsMobile } from "@src/hooks/use-mobile";
import VideoTextContainer from "./videoTextContainer/videoTextContainer";
import PlayerIcon from "/assets/icons/player-icon.svg";
import EnterFullScreenIcon from "/assets/icons/enterFullScreenIcon.svg";
import ExitFullScreenIcon from "/assets/icons/exitFullScreenIcon.svg";
import MuteIcon from "/assets/icons/muteIcon.svg";
import VolumeIcon from "/assets/icons/volumeIcon.svg";

const VIDEO_URL =
  "https://www.youtube.com/embed/FkAnIL1l4wo?autoplay=1&mute=1&loop=1&playlist=FkAnIL1l4wo&controls=0&modestbranding=1";

type WebkitDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitHTMLElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type OrientationApi = {
  lock?: (orientation: "landscape" | "portrait") => Promise<void>;
  unlock?: () => void;
};

type YoutubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  mute: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
};

type YoutubePlayerReadyEvent = {
  target: YoutubePlayer;
};

type YoutubePlayerStateChangeEvent = {
  data: number;
  target: YoutubePlayer;
};

type YoutubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      events?: {
        onReady?: (event: YoutubePlayerReadyEvent) => void;
        onStateChange?: (event: YoutubePlayerStateChangeEvent) => void;
      };
      height?: number | string;
      playerVars?: Record<string, number | string>;
      videoId: string;
      width?: number | string;
    },
  ) => YoutubePlayer;
  PlayerState: {
    BUFFERING: number;
    CUED: number;
    ENDED: number;
    PAUSED: number;
    PLAYING: number;
    UNSTARTED: number;
  };
};

declare global {
  interface Window {
    YT?: YoutubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_VIDEO_ID = VIDEO_URL.match(/\/embed\/([^?&]+)/)?.[1] ?? "";
const VIDEO_URL_PARAMS = new URLSearchParams(VIDEO_URL.split("?")[1] ?? "");

let youtubeApiPromise: Promise<YoutubeNamespace> | null = null;

const loadYoutubeApi = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API unavailable on the server"));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YoutubeNamespace>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT) {
        resolve(window.YT);
      }
    };

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error("Failed to load the YouTube IFrame API"));
    };

    document.body.appendChild(script);
  });

  return youtubeApiPromise;
};

const lockLandscapeOrientation = async () => {
  if (typeof window === "undefined") return;
  const orientation = window.screen.orientation as OrientationApi | undefined;
  try {
    await orientation?.lock?.("landscape");
  } catch {
    // Some mobile browsers do not allow orientation lock.
  }
};

const unlockScreenOrientation = () => {
  if (typeof window === "undefined") return;
  const orientation = window.screen.orientation as OrientationApi | undefined;
  try {
    orientation?.unlock?.();
  } catch {
    // No-op for unsupported browsers.
  }
};

const VideoContainerLanding = () => {
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YoutubePlayer | null>(null);
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  const [isPaused, setIsPaused] = useState(true);
  const [cinema, setCinema] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUsingVolume, setIsUsingVolume] = useState(false);

  const [volume, setVolume] = useState(0.6);
  const [forceMuted, setForceMuted] = useState(true);

  const isMuted = forceMuted || volume === 0;

  // Progress bar
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isScrubbingRef = useRef(false);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const controlTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFullscreen = cinema || isNativeFullscreen;

  /* ------------------------------------------------------
   * Play / Pause
   * ------------------------------------------------------ */
  const togglePlay = () => {
    const player = playerRef.current;
    const yt = window.YT;
    if (!player || !yt) return;

    if (player.getPlayerState() === yt.PlayerState.PLAYING) {
      player.pauseVideo();
      setIsPaused(true);
    } else {
      player.playVideo();
      setIsPaused(false);
    }
  };

  /* ------------------------------------------------------
   * Volume
   * ------------------------------------------------------ */
  const toggleMute = () => {
    if (isMuted) {
      setForceMuted(false);
      setVolume((v) => (v === 0 ? 0.6 : v));
    } else {
      setVolume(0);
      setForceMuted(true);
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setForceMuted(false);

    setIsUsingVolume(true);
    if (controlTimeout.current) clearTimeout(controlTimeout.current);
    controlTimeout.current = setTimeout(() => setIsUsingVolume(false), 1000);
  };

  // Apply volume to the current player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    player.setVolume(Math.round(volume * 100));

    if (isMuted) {
      player.mute();
    } else {
      player.unMute();
    }
  }, [volume, isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
  }, [volume, isMuted]);

  /* ------------------------------------------------------
   * Progress bar (seek)
   * ------------------------------------------------------ */
  const onScrubStart = () => {
    isScrubbingRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const onScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const onScrubEnd = () => {
    const player = playerRef.current;
    if (player) player.seekTo(currentTime, true);

    isScrubbingRef.current = false;
    if (!isPaused) startProgressLoop();
  };

  /* ------------------------------------------------------
   * Progress loop (requestAnimationFrame)
   * ------------------------------------------------------ */
  const startProgressLoop = () => {
    stopProgressLoop();

    const tick = () => {
      const player = playerRef.current;
      if (player && !isScrubbingRef.current) {
        setCurrentTime(player.getCurrentTime());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopProgressLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const enterNativeFullscreen = async () => {
    const element = (playerFrameRef.current ??
      wrapperRef.current) as WebkitHTMLElement | null;
    if (!element) return false;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        setIsNativeFullscreen(true);
        await lockLandscapeOrientation();
        return true;
      }
    } catch {
      // Continue with the webkit fallback.
    }

    if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
      setIsNativeFullscreen(true);
      await lockLandscapeOrientation();
      return true;
    }

    return false;
  };

  const exitNativeFullscreen = async () => {
    const doc = document as WebkitDocument;

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      }
    } finally {
      setIsNativeFullscreen(false);
      unlockScreenOrientation();
    }
  };

  const toggleFullscreen = async () => {
    if (!isMobile) {
      setCinema((v) => !v);
      return;
    }

    if (isNativeFullscreen) {
      await exitNativeFullscreen();
      return;
    }

    if (cinema) {
      setCinema(false);
      return;
    }

    const enteredNativeFullscreen = await enterNativeFullscreen();
    if (!enteredNativeFullscreen) {
      setCinema(true);
    }
  };

  /* ------------------------------------------------------
   * Attach video events
   * ------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    let mountedPlayer: YoutubePlayer | null = null;

    const stopLoop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const startLoop = () => {
      stopLoop();

      const tick = () => {
        const player = playerRef.current;
        if (player && !isScrubbingRef.current) {
          setCurrentTime(player.getCurrentTime());
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const initPlayer = async () => {
      if (!playerHostRef.current || !YOUTUBE_VIDEO_ID) return;

      const yt = await loadYoutubeApi();
      if (cancelled || !playerHostRef.current) return;

      mountedPlayer = new yt.Player(playerHostRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: Number(VIDEO_URL_PARAMS.get("autoplay") ?? "0"),
          controls: Number(VIDEO_URL_PARAMS.get("controls") ?? "0"),
          loop: Number(VIDEO_URL_PARAMS.get("loop") ?? "0"),
          modestbranding: Number(VIDEO_URL_PARAMS.get("modestbranding") ?? "1"),
          playlist: VIDEO_URL_PARAMS.get("playlist") ?? YOUTUBE_VIDEO_ID,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;

            playerRef.current = target;
            setDuration(target.getDuration());
            setCurrentTime(target.getCurrentTime());
            target.setVolume(Math.round(volumeRef.current * 100));

            if (isMutedRef.current) {
              target.mute();
            } else {
              target.unMute();
            }

            if (VIDEO_URL_PARAMS.get("autoplay") === "1") {
              target.playVideo();
            }
          },
          onStateChange: ({ data, target }) => {
            if (cancelled) return;

            const nextDuration = target.getDuration();
            if (nextDuration > 0) {
              setDuration(nextDuration);
            }

            if (data === yt.PlayerState.PLAYING) {
              setIsPaused(false);
              startLoop();
              return;
            }

            if (
              data === yt.PlayerState.PAUSED ||
              data === yt.PlayerState.ENDED ||
              data === yt.PlayerState.CUED
            ) {
              setIsPaused(true);
              stopLoop();
            }
          },
        },
      });
    };

    void initPlayer();

    return () => {
      cancelled = true;
      stopLoop();
      mountedPlayer?.destroy();

      if (playerRef.current === mountedPlayer) {
        playerRef.current = null;
      }
    };
  }, []);

  /* ------------------------------------------------------
   * Cinema mode
   * ------------------------------------------------------ */
  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;

    if (cinema) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = previousOverflow || "auto";
    };
  }, [cinema]);

  useEffect(() => {
    const doc = document as WebkitDocument;

    const onFullscreenChange = () => {
      const fullscreenActive = Boolean(
        document.fullscreenElement || doc.webkitFullscreenElement,
      );
      setIsNativeFullscreen(fullscreenActive);

      if (!fullscreenActive) {
        unlockScreenOrientation();
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      onFullscreenChange as EventListener,
    );

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange as EventListener,
      );
      unlockScreenOrientation();
    };
  }, []);

  const hideControls = !isPaused && !isHovered && !isUsingVolume;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  /* ------------------------------------------------------
   * RENDER
   * ------------------------------------------------------ */
  return (
    <div
      className={`new-home-video-container ${cinema ? "cinema" : ""}`}
      onClick={(e) => {
        if (!cinema) return;
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        )
          setCinema(false);
      }}
    >
      <div
        ref={wrapperRef}
        className="new-home-video-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsUsingVolume(false);
        }}
      >
        {/* Play button */}
        <button
          type="button"
          className={`playIcon ${isPaused ? "is-visible" : "is-hidden"}`}
          onClick={togglePlay}
        >
          <img src={PlayerIcon} alt="" aria-hidden="true" />
        </button>

        <div className="new-home-video">
          <div
            ref={playerFrameRef}
            className="new-home-video-player"
            aria-label="Usearly video"
          >
            <div ref={playerHostRef} className="new-home-video-player-host" />
          </div>

          {/* Overlay for clicking + double-click cinema */}
          <div
            className="new-home-video-overlay"
            onClick={togglePlay}
            onDoubleClick={(e) => {
              e.preventDefault();
              void toggleFullscreen();
            }}
          />
        </div>

        {/* Progress Bar */}
        <div className={`progress ${hideControls ? "is-hidden" : ""}`}>
          <input
            className="progress-slider"
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onMouseDown={onScrubStart}
            onChange={onScrubChange}
            onMouseUp={onScrubEnd}
          />
          <div className="progress-time">
            {fmt(currentTime)} / {fmt(duration)}
          </div>
        </div>

        {/* Custom controls */}
        <div className={`custom-controls ${hideControls ? "is-hidden" : ""}`}>
          <div
            className="volume-control"
            onMouseEnter={() => setIsUsingVolume(true)}
            onMouseLeave={() => setIsUsingVolume(false)}
          >
            <button type="button" className="volume-btn" onClick={toggleMute}>
              <span>
                <img src={isMuted ? MuteIcon : VolumeIcon} alt="" />
              </span>
            </button>

            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeSlider}
            />
          </div>

          <button
            type="button"
            className="cinema-btn"
            onClick={() => {
              void toggleFullscreen();
            }}
          >
            <img
              src={isFullscreen ? ExitFullScreenIcon : EnterFullScreenIcon}
              alt=""
            />
          </button>
        </div>
      </div>

      <VideoTextContainer />
    </div>
  );
};

export default VideoContainerLanding;
