import CardActions from "./cardActions";
import { VideoIdToUrl } from "@/types/video";

export default function videoCard({
  video,
}: {
  video: VideoIdToUrl & { creator_id: string; creator_img: string };
}) {
  console.log("VIDEO CARD", video);
  return (
    <div className="flex flex-row">
      <video
        width="320"
        className="rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        controls
      >
        {video && <source src={video.url} type="video/mp4" />}
      </video>
      <div className="flex flex-col justify-end px-2 py-3 ml-4 mb-8 gap-4">
        <img
          src={video.creator_img}
          className="w-12 h-12 rounded-full bg-gray-300 p-0.5"
        />
        <CardActions />
      </div>
    </div>
  );
}
