import Feed from "@/components/feed";
import { getVideosS3Key } from "@/db/query";
import { getFilesFromS3 } from "@/lib/s3";

export default async function landing() {
  const { data: localVideos } = await getVideosS3Key({
    limit: 3,
    offset: 0,
  });
  const s3Videos = await getFilesFromS3(localVideos.map((v) => v.s3Key));

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
          <Feed initialVideos={s3Videos.map((v) => v.url)} />
        </div>
      </main>
    </div>
  );
}
