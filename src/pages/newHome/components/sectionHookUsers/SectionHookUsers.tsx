import PlanetCanvas from "@src/components/canvas/PlanetCanvas";
import type { PopFeedVariant } from "@src/components/canvas/planetCanvas/types";
import { useIsMobile } from "@src/hooks/use-mobile";
import "./SectionHookUsers.scss";
import SquareRoundButton from "@src/components/buttons/SquareRoundButton";
import MobileSectionHookUsers from "./MobileSectionhookUsers";
import chromeLogo from "/assets/logo/chrome.svg";

const SECTION_HOOK_USERS_TITLE = (
  <>
    Améliorer l'experience utilisateur sur tous les sites{"\u00A0"}
    et apps !
  </>
);

const SECTION_HOOK_USERS_SUBTITLE = (
  <>
    Installez dès maintenant l’extension et commencer à signaler les irritants,
    suggérer des idées et exprimez vos coups de coeur. <br />
    Ensemble, on fait bouger les marques !
  </>
);

const EXTENSION_BUTTON_LABEL = "Installer l'extension";
const COMMUNITY_BUTTON_LABEL = "Rejoindre la communauté";

type SectionHookUsersProps = {
  popFeedVariant?: PopFeedVariant;
};

const SectionHookUsers = ({
  popFeedVariant = "default",
}: SectionHookUsersProps) => {
  const isMobile = useIsMobile("(max-width: 1250px)");

  if (isMobile) {
    return (
      <MobileSectionHookUsers
        title={SECTION_HOOK_USERS_TITLE}
        subtitle={SECTION_HOOK_USERS_SUBTITLE}
        extensionLabel={EXTENSION_BUTTON_LABEL}
        communityLabel={COMMUNITY_BUTTON_LABEL}
        extensionIconSrc={chromeLogo}
        extensionIconAlt="Chrome"
        popFeedVariant={popFeedVariant}
      />
    );
  }

  return (
    <section className="section-hook-users">
      <div className="hook-users-content">
        <div className="hook-users-content-text">
          <h2 className="hook-users-title">{SECTION_HOOK_USERS_TITLE}</h2>
          <p className="hook-users-subtitle">{SECTION_HOOK_USERS_SUBTITLE}</p>
        </div>
        <div className="hook-users-content-buttons">
          <button className="hook-users-extension-button">
            <img src={chromeLogo} width={46} height={46} alt="Chrome" />
            {EXTENSION_BUTTON_LABEL}
          </button>
          <SquareRoundButton
            text={COMMUNITY_BUTTON_LABEL}
            classNames={"button-rejoindre"}
          />
        </div>
      </div>
      <PlanetCanvas
        width={1500}
        height="100vh"
        popFeed
        popFeedVariant={popFeedVariant}
      />
    </section>
  );
};

export default SectionHookUsers;
