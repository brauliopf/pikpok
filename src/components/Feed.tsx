"use client";

import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "./Video-Card";
import { downloadMultipleFiles } from "@/lib/s3";
import { getVideos } from "@/db/query";

const NUMBER_OF_USERS_TO_FETCH = 10;

interface FeedProps {
  initialVideos: string[];
}

const Feed: React.FC<FeedProps> = ({ initialVideos }) => {
  const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
  const [videos, setVideos] = useState<string[]>(initialVideos);

  // const loadMoreVideos = async () => {
  //   const apiVideos = await getVideos(offset, NUMBER_OF_USERS_TO_FETCH);
  //   setVideos((videos => [...videos, ...apiVideos]);
  //   setOffset((offset) => offset + NUMBER_OF_USERS_TO_FETCH);
  // };

  // useEffect(() => {
  //   const loadVideos = async () => {
  //     const { status, data } = await getVideos(1, 2);
  //     const response = await downloadMultipleFiles(data.map((v) => v.s3Key));
  //     setVideos(response.map((v) => v.url));
  //   };

  //   loadVideos();
  // }, []);

  return (
    <div className="flex flex-col gap-4 flex-1 my-4 items-center">
      {Array.isArray(videos) &&
        videos.map((video, index) => {
          return <VideoCard video={video} key={index} />;
        })}
    </div>
  );
};

export default Feed;
