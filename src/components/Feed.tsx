"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./Video-Card";
import { downloadMultipleFiles } from "@/lib/s3";
import { getVideos } from "@/db/query";
import { useInView } from "react-intersection-observer";

const NUMBER_OF_VIDEOS_TO_FETCH = 2;

interface FeedProps {
  initialVideos: string[];
}

const Feed: React.FC<FeedProps> = ({ initialVideos }) => {
  const [offset, setOffset] = useState(NUMBER_OF_VIDEOS_TO_FETCH);
  const [videos, setVideos] = useState<string[]>(initialVideos);
  const { ref, inView } = useInView();

  const loadMoreVideos = async () => {
    const localVideos = await getVideos({
      offset,
      limit: NUMBER_OF_VIDEOS_TO_FETCH,
    });
    const s3Videos = await downloadMultipleFiles(
      localVideos.data.map((v) => v.s3Key)
    );
    setVideos((videos) => [...videos, ...s3Videos.map((v) => v.url)]);
    setOffset((offset) => offset + NUMBER_OF_VIDEOS_TO_FETCH);
  };

  useEffect(() => {
    if (inView) {
      loadMoreVideos();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-4 flex-1 my-4 items-center">
      {Array.isArray(videos) &&
        videos.map((video, index) => {
          return <VideoCard video={video} key={index} />;
        })}
      <div ref={ref}>Loading...</div>
      {/* <button onClick={loadMoreVideos}>Load more</button> */}
    </div>
  );
};

export default Feed;
