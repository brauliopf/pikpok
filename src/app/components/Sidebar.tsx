"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#202123] text-gray-200 p-2 overflow-y-auto flex flex-col shadow-lg">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="flex justify-between">
          <UserButton />
          <SignOutButton />
        </div>
      </SignedIn>
      <button className="w-full mb-4 p-3 rounded hover:bg-gray-700 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
