import DownloadApp from "../_components/AppDownload";
import TimeLineContents from "./_components/TimeLineContents";
import TimelineHero from "./_components/TimeLineHero";

export default function TimelinePage() {
  return (
    <div>
      <TimelineHero />
      <TimeLineContents />
      <DownloadApp />
    </div>
  );
}
