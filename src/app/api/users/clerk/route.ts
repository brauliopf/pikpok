import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/db/mutations";

export async function POST(request: NextRequest) {
  const { secret } = await request.json();

  console.log("FORMDATA:", secret, request);

  createUser({ email: "XXX", firstName: "ZZZ" });

  return NextResponse.json({ success: true });
}
