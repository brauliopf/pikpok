import Feed from "@/components/feed";
import { getCustomVideos } from "@/db/queries/videos";
import { mapVideoIdToUrl } from "@/lib/s3";

const NUMBER_OF_VIDEOS_TO_FETCH = 2;

export default async function landing() {
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
          <Feed />
        </div>
      </main>
    </div>
  );
}
