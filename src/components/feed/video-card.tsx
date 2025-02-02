"use client";

import { Suspense, useEffect, useState } from "react";
import { download } from "@/actions/video_loader";

export default function VideoCard({ src }: { src: string }) {
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    setVideo(src);
  }, []);

  return (
    <video
      width="320"
      className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      controls
    >
      {video && <source src={video} type="video/mp4" />}
    </video>
  );
}
