"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toggleLike } from "@/db/mutations/likes";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CardAction({
  videoId,
  userLike,
}: {
  videoId: string;
  userLike: boolean;
}) {
  const { user } = useUser();
  const [like, setLike] = useState<boolean>(userLike);

  useEffect(() => {
    setLike(userLike);
  }, [userLike]);

  return (
    <div className="flex flex-col gap-4">
      <SignedOut>
        <SignInButton>
          <button className="rounded-full  lucide lucide-heart bg-gray-200 w-10 h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="-12 -10 40 40"
              stroke={like ? "#bf0a30" : ""}
              fill={like ? "#bf0a30" : ""}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <button
          onClick={() => {
            setLike(!like);
            toggleLike({ clerkId: user!.id, videoId });
          }}
          className="rounded-full  lucide lucide-heart bg-gray-200 w-10 h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="-12 -10 40 40"
            stroke={like ? "#bf0a30" : ""}
            fill={like ? "#bf0a30" : ""}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </SignedIn>

      <a
        href="#"
        className="rounded-full bg-gray-200 lucide lucide-message-square-text w-10 h-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="-12 -12 40 40"
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
