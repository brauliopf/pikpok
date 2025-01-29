"use client";

interface VideoCardInterface {
  src: string;
}

export default function VideoCard({ src }: VideoCardInterface) {
  return (
    <video width="320" height="320" className="" controls preload="none">
      <source src={src} type="video/mp4" />
    </video>
  );
}
