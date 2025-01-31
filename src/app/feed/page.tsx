"use client";

import { useState, useEffect } from "react";
import VideoCard from "@/app/ui/VideoCard";
import { downloadMultipleFiles } from "../actions/download";

export default function Home() {
  const [VObjs, setVObjs] = useState<{ fileKey: string; url: string }[]>([]);
  const [Cus, SetCus] = useState<any[]>([]);

  useEffect(() => {
    const loadVObjs = async () => {
      const fileKeys: string[] = [
        "videos/de80c429-06c7-4457-998c-3b55b6dd0182.mp4",
        "videos/bb3a8541-7cef-4bc7-ba62-550a9b49e8cb.mp4",
        "videos/a648e50e-43b7-4061-a115-9d7d6a82d4fe.mp4",
      ];
      const loader = await downloadMultipleFiles(fileKeys);
      setVObjs(loader);
    };

    loadVObjs();
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center fixed left-0 right-0 overflow-auto">
      <main className="flex flex-col gap-10 items-center mb-10 max-h-screen">
        {VObjs.map((video, index) => {
          return <VideoCard src={video.url} key={index} />;
        })}
      </main>
    </div>
  );
}
