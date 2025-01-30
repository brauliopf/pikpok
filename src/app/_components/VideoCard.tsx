"use client";

import { Suspense, useEffect, useState } from "react";
import { download } from "@/app/actions/download";

export default function VideoCard({ src }: { src: string }) {
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    console.log("VideoCard", src);
    // const setVideoURL = async () => {
    //   const url = await download(src);
    //   console.log("useEffect: url", url);
    setVideo(src);
    // };
    // setVideoURL();
  }, []);

  return (
    <video width="320" className="border-yellow-500 border-2" controls>
      {video && <source src={video} type="video/mp4" />}
    </video>
  );
}
