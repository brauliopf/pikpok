import Feed from "@/components/feed";
import { mapVideoIdToS3Key } from "@/db/queries/videos";
import { mapVideoIdToUrl } from "@/lib/s3";

export default async function landing() {
  const { data: selectedVideoIds, timestamp } = await mapVideoIdToS3Key({
    limit: 3,
    offset: 0,
  });
  const videosIdToUrl = await mapVideoIdToUrl(selectedVideoIds);

  return (
    <div className="flex flex-1 left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <main className="flex flex-1 flex-row gap-20 items-center mx-[10%]">
        <div className="fixed">
          <span>TikTok-style welcome page.</span>
          <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ul>
        </div>
        <div className="flex-grow"></div>
        <div className="h-screen">
          <Feed initialVideos={videosIdToUrl} timestamp={timestamp} />
        </div>
      </main>
    </div>
  );
}
