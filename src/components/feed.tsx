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
  initialVideos:
    | (VideoIdToUrl & { creator_id: string; creator_img: string })[]
    | null;
  timestamp: number;
}

const Feed: React.FC<feedProps> = ({ initialVideos, timestamp }) => {
  const [offset, setOffset] = useState(
    initialVideos ? initialVideos.length : 0
  );
  const [videos, setVideos] = useState<
    (VideoIdToUrl & { creator_id: string; creator_img: string })[]
  >(initialVideos || []);
  const { ref, inView } = useInView();
  const { user } = useUser();

  const loadCustomVideos = async () => {
    // get videos id, s3Key and creatorId
    const localVideos = await getCustomVideos({
      clerk_id: (user && user.id) || "",
      offset,
      limit: NUMBER_OF_VIDEOS_TO_FETCH,
    });

    // use videos s3Key to get url
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
        videos.map((video, index) => {
          return <VideoCard video={video} key={index} />;
        })}
      <div ref={ref}>Loading...</div>
    </div>
  );
};

export default Feed;
