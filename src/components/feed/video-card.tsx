export default function VideoCard({ video }: { video: string }) {
  return (
    <video
      width="320"
      className="rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      controls
    >
      {video && <source src={video} type="video/mp4" />}
    </video>
  );
}
