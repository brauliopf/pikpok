"use client";

import { useState, useEffect } from "react";
import VideoCard from "./video-card";
import { downloadMultipleFiles } from "@/lib/s3";
import { getVideos } from "@/db/query";

export default function Feed() {
  const [videos, setVideos] = useState<{ fileKey: string; url: string }[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const { status, data } = await getVideos();
      const response = await downloadMultipleFiles(data.map((v) => v.s3Key));
      setVideos(response);
    };

    loadVideos();
  }, []);

  return (
    <div className="flex flex-col gap-4 flex-1 my-4 items-center">
      {videos.map((video, index) => {
        return <VideoCard video={video.url} key={index} />;
      })}
    </div>
  );
}
