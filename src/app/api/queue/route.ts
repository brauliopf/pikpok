import { NextResponse } from "next/server";
// import { videoQueue } from '@/lib/queue';

export async function POST(request: Request) {
  const body = await request.json();
  const { videoId, s3Key, title, clerkId } = body;

  try {
    // await videoQueue.add('process-video', {
    //   id: videoId,
    //   s3Key,
    //   title,
    //   clerkId,
    //   status: 'pending'
    // });

    return NextResponse.json({ message: "Video queued" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to queue video" },
      { status: 500 }
    );
  }
}
