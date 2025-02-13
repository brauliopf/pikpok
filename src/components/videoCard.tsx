import CardActions from "./cardActions";

export default function videoCard({ video }: { video: string }) {
  return (
    <div className="flex flex-row">
      <video
        width="320"
        className="rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        controls
      >
        {video && <source src={video} type="video/mp4" />}
      </video>
      <div className="flex flex-col justify-end px-2 py-3 ml-4 mb-8">
        <p>video.title</p>
        <CardActions />
      </div>
    </div>
  );
}
