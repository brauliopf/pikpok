"use client";

import Feed from "../ui/feed";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const users = await res.json();
      setData(users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center fixed left-0 right-0 overflow-auto">
      <Feed />
    </div>
  );
}
