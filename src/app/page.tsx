import Feed from "@/components/feed";
import { getVideosS3Key } from "@/db/query";
import { getFilesFromS3 } from "@/lib/s3";

export default async function feedPage() {
  const { data: localVideos } = await getVideosS3Key({
    limit: 3,
    offset: 0,
  });
  const s3Videos = await getFilesFromS3(localVideos.map((v) => v.s3Key));

  return (
    <div className="flex flex-1 fixed left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <Feed initialVideos={s3Videos.map((v) => v.url)} />
    </div>
  );
}
