"use client";

import { useState, useEffect } from "react";
import Footer from "@/app/_components/Footer";
import VideoCard from "@/app/_components/VideoCard";
import { getAllVideos, downloadMultipleFiles } from "./actions/download";

export default function Home() {
  const [videos, setVideos] = useState<string[]>([
    "videos/0f37ae3f-48df-4ac5-a465-a6880e7f0da2.mp4",
  ]);

  // useEffect(() => {
  //   const loadVideos = async () => {
  //     const loader = await getAllVideos();
  //     setVideos(loader);
  //   };

  //   loadVideos();
  // }, []);

  const [VObjs, setVObjs] = useState<{ fileKey: string; url: string }[]>([]);

  useEffect(() => {
    const loadVObjs = async () => {
      const fileKeys: string[] = [
        "videos/de80c429-06c7-4457-998c-3b55b6dd0182.mp4",
        "videos/bb3a8541-7cef-4bc7-ba62-550a9b49e8cb.mp4",
        "videos/a648e50e-43b7-4061-a115-9d7d6a82d4fe.mp4",
      ];
      console.log("PAGE > DOWNLOAD MANY");
      const loader = await downloadMultipleFiles(fileKeys);
      setVObjs(loader);
    };

    loadVObjs();
  }, []);

  return (
    <div className="flex">
      <div className="min-h-screen flex justify-center items-center border-green-500 border-2 fixed top-0 left-0 right-0 bottom-0">
        <main className="flex flex-col gap-10 items-center mb-10 border-red-600 border-2">
          {VObjs.map((video, index) => {
            return <VideoCard src={video.url} key={index} />;
          })}
        </main>
        <Footer />
      </div>
    </div>
  );
}
