"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./videoCard";
import { mapVideoIdToUrl } from "@/lib/s3";
import { getCustomVideos } from "@/db/queries/videos";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/nextjs";
import { VideoIdToUrl } from "@/types/video";

const NUMBER_OF_VIDEOS_TO_FETCH = 3;

interface feedProps {
  initialVideos: VideoIdToUrl[];
  timestamp: number;
}

const Feed: React.FC<feedProps> = ({ initialVideos, timestamp }) => {
  const [offset, setOffset] = useState(initialVideos.length);
  const [videos, setVideos] = useState<VideoIdToUrl[]>(initialVideos);
  const { ref, inView } = useInView();
  const { user } = useUser();

  const loadCustomVideos = async () => {
    // get videos id and s3Key
    const localVideos = await getCustomVideos({
      clerk_id: (user && user.id) || "",
      offset,
      limit: NUMBER_OF_VIDEOS_TO_FETCH,
    });

    // use videos s3Key to get url
    console.log("Feed", localVideos);
    const s3Videos = await mapVideoIdToUrl(localVideos.data);
    setVideos((videos) => [...videos, ...s3Videos]);
    setOffset((offset) => offset + NUMBER_OF_VIDEOS_TO_FETCH);
  };

  useEffect(() => {
    if (inView) {
      loadCustomVideos();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-4 flex-1 my-4 items-center">
      {Array.isArray(videos) &&
        videos.map((video, index) => (
          <VideoCard video={video.url} key={index} />
        ))}
      <div ref={ref}>Loading...</div>
    </div>
  );
};

export default Feed;
