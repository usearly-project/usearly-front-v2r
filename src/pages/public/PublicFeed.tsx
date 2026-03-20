import MixedFeed from "@src/components/feed/MixedFeed";
import "./PublicFeed.scss";
import HeroBanner from "./HeroBanner";
import LeftSidebar from "./sidebars/LeftSidebar";
import RightSidebar from "./sidebars/RightSidebar";

function PublicFeed() {
  return (
    <div className="public-feed-page">
      {/* HEADER */}
      <HeroBanner />

      {/* GRID */}
      <div className="public-feed-layout">
        <aside className="public-feed-left">
          <LeftSidebar />
        </aside>

        <main className="public-feed-center">
          <MixedFeed isPublic />
        </main>

        <aside className="public-feed-right">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}

export default PublicFeed;
