import Feed from "@/components/feed";
import { getCustomVideos } from "@/db/queries/videos";
import { mapVideoIdToUrl } from "@/lib/s3";

const NUMBER_OF_VIDEOS_TO_FETCH = 1;

export default async function feedPage() {
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
    <div className="flex flex-1 fixed left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <Feed initialVideos={null} timestamp={timestamp} />
    </div>
  );
}
