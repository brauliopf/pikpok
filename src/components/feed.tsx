"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./videoCard";
import { mapVideoIdToUrl } from "@/lib/s3";
import { getCustomVideos } from "@/db/queries/videos";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/nextjs";
import { VideoIdToS3Key, VideoIdToUrl, SelectLikes } from "@/types";
import { getUserLikes } from "@/db/queries/likes";

const NUMBER_OF_VIDEOS_TO_FETCH = 2;

const Feed: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [videos, setVideos] = useState<VideoIdToUrl[]>([]);
  const [userLikes, setUserLikes] = useState<SelectLikes[]>([]);
  const { ref, inView } = useInView();
  const { isLoaded, user } = useUser();

  const loadCustomVideos = async () => {
    const { data }: { data: VideoIdToS3Key[] } = await getCustomVideos({
      clerk_id: (user && user.id) || "",
      offset,
      limit: NUMBER_OF_VIDEOS_TO_FETCH,
    });

    // use videos s3Key to get url
    const s3Videos = await mapVideoIdToUrl(data);
    console.log("LOGANDO", videos, s3Videos);
    setVideos((videos) => [...videos, ...s3Videos]);
    setOffset((offset) => offset + NUMBER_OF_VIDEOS_TO_FETCH);
  };

  useEffect(() => {
    if (isLoaded) {
      if (inView) {
        loadCustomVideos();
      }
    }
  }, [isLoaded, inView]);

  const loadUserLikes = async () => {
    if (!user) {
      return null;
    }

    const response = await getUserLikes({ clerkId: user!.id });
    setUserLikes(response);
  };

  useEffect(() => {
    loadUserLikes();
  }, [user]);

  return (
    <div className="flex flex-col gap-4 flex-1 my-4 items-center">
      {Array.isArray(videos) &&
        videos.map((videoIDToUrl, index) => {
          return (
            <VideoCard
              url={videoIDToUrl.url}
              creatorImg={videoIDToUrl.creator_img}
              videoId={videoIDToUrl.id}
              userLike={userLikes
                .map((item) => item.videoId)
                .includes(videoIDToUrl.id)}
              key={videoIDToUrl.id + "_" + index}
            />
          );
        })}
      <div ref={ref}>Loading...</div>
    </div>
  );
};

export default Feed;
