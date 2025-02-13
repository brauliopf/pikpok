import Feed from "@/components/feed";
import { getCustomVideos } from "@/db/queries/videos";
import { mapVideoIdToUrl } from "@/lib/s3";

const NUMBER_OF_VIDEOS_TO_FETCH = 2;

export default async function landing() {
  // return video id, s3key, similarity and creator_id
  // here, similarity is 0 because we do not have the user
  const { data, timestamp } = await getCustomVideos({
    clerk_id: "",
    offset: 0,
    limit: NUMBER_OF_VIDEOS_TO_FETCH,
  });

  // replace s3key for url. keep all other keys and values
  const s3Videos = await mapVideoIdToUrl(data);

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
          <Feed initialVideos={null} timestamp={timestamp} />
        </div>
      </main>
    </div>
  );
}
