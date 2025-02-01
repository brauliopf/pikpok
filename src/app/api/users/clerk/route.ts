import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { secret } = await request.json();
  const client = await clerkClient();

  console.log("FORMDATA:", secret, request);
  // await client.users.updateUserMetadata(userId, {
  //   publicMetadata: {
  //     secret: formDatasecret,
  //   },
  // });

  return NextResponse.json({ success: true });
}
