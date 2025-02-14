"use client";

import { useUser } from "@clerk/nextjs";
import { toggleLike } from "@/db/mutations/likes";

export default function CardAction({ video_id }: { video_id: string }) {
  const { user } = useUser();

  console.log(video_id);
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => toggleLike()}
        className="rounded-full bg-gray-200 lucide lucide-heart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="-6 -6 36 36"
          fill="gray"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      <a
        href={`/video/${video_id}`}
        className="rounded-full bg-gray-200 lucide lucide-message-square-text"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="-6 -6 36 36"
          fill="gray"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M13 8H7" />
          <path d="M17 12H7" />
        </svg>
      </a>
    </div>
  );
}
