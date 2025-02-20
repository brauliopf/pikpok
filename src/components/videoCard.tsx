"use client";

import CardActions from "./cardActions";

export default function videoCard({
  url,
  creatorImg,
  videoId,
  userLike,
}: {
  url: string;
  creatorImg: string;
  videoId: string;
  userLike: boolean;
}) {
  return (
    <div className="flex flex-row h-screen max-w-screen py-8">
      <video
        className="flex rounded-xl grow bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        controls
      >
        {url && <source src={url} type="video/mp4" />}
      </video>
      <div className="flex flex-col justify-end px-2 py-3 mb-10 gap-4 ml-[-60] sm:ml-0">
        <img
          src={creatorImg}
          className="w-10 h-10 rounded-full bg-gray-300 p-0.5"
        />
        <CardActions videoId={videoId} userLike={userLike} />
      </div>
    </div>
  );
}
