import Feed from "@/components/feed";
import { mapVideoIdToS3Key } from "@/db/queries/videos";
import { mapVideoIdToUrl } from "@/lib/s3";

export default async function feedPage() {
  const { data: selectedVideoIds, timestamp } = await mapVideoIdToS3Key({
    limit: 3,
    offset: 0,
  });
  const videosIdToUrl = await mapVideoIdToUrl(selectedVideoIds);

  return (
    <div className="flex flex-1 fixed left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <Feed initialVideos={videosIdToUrl} timestamp={timestamp} />
    </div>
  );
}
