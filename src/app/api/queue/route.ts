import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    return NextResponse.json({ message: "Video queued", request });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to queue video" },
      { status: 500 }
    );
  }
}
