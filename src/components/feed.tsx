"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./videoCard";
import { mapVideoIdToUrl } from "@/lib/s3";
import { getCustomVideos } from "@/db/queries/videos";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/nextjs";
import { VideoIdToS3Key, VideoIdToUrl } from "@/types/video";

const NUMBER_OF_VIDEOS_TO_FETCH = 3;

const Feed: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [videos, setVideos] = useState<VideoIdToUrl[]>([]);
  const { ref, inView } = useInView();
  const { user } = useUser();

  const loadCustomVideos = async () => {
    const { data }: { data: VideoIdToS3Key[] } = await getCustomVideos({
      clerk_id: (user && user.id) || "",
      offset,
      limit: NUMBER_OF_VIDEOS_TO_FETCH,
    });

    // use videos s3Key to get url
    const s3Videos = await mapVideoIdToUrl(data);
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
        videos.map((videoIDToUrl, index) => {
          return (
            <VideoCard
              url={videoIDToUrl.url}
              creator_img={videoIDToUrl.creator_img}
              video_id={videoIDToUrl.id}
              key={videoIDToUrl.id}
            />
          );
        })}
      <div ref={ref}>Loading...</div>
    </div>
  );
};

export default Feed;
