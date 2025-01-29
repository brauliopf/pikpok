"use client";

import { useState, useEffect, Suspense } from "react";
import { download } from "./actions/download";
import Footer from "@/app/_components/Footer";
import VideoCard from "@/app/_components/VideoCard";

export default function Home() {
  const [video, setVideo] = useState<string | null>(null);

  const loadVideo = async () => {
    const url = await download(
      "videos/0f37ae3f-48df-4ac5-a465-a6880e7f0da2.mp4"
    );
    console.log("DOWNLOAD", url);
    setVideo(url);
  };

  useEffect(() => {
    loadVideo();
  }, []);

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <div className="flex">
      <div className="grid justify-items-center min-h-screen w-full border-green-500">
        <main className="flex flex-col gap-8 items-center mb-10 border-cyan-600 border-2">
          <VideoCard src={video!} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
