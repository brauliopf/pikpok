"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./videoCard";
import { mapVideoIdToUrl } from "@/lib/s3";
import { getRecommendedVideos, getVideosGuest } from "@/db/queries/videos";
import { useInView } from "react-intersection-observer";
import { useUser } from "@clerk/nextjs";
import { VideoIdToUrl, SelectLikes } from "@/types";
import { getUserLikes } from "@/db/queries/likes";

const Feed: React.FC = () => {
  const [videos, setVideos] = useState<VideoIdToUrl[]>([]);
  const [userLikes, setUserLikes] = useState<SelectLikes[]>([]);
  const { ref, inView } = useInView();
  const { isLoaded, user } = useUser();

  const loadCustomVideos = async () => {
    let recs = await getRecommendedVideos((user && user.id) || "");
    if (!recs) {
      recs = await getVideosGuest();
    }

    // swap s3Key for url
    const s3Videos = await mapVideoIdToUrl(recs);

    setVideos((videos) => [...videos, ...s3Videos]);
  };

  useEffect(() => {
    console.log("isLoaded", isLoaded);
    if (isLoaded) {
      loadCustomVideos();
    }
  }, [isLoaded, user]);

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
