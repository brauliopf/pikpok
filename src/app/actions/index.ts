"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    console.log(
      "ENTER COMPLETE ONBOARDING",
      formData.getAll("topicsOfInterest")
    );

    await client.users.updateUser(userId, {
      publicMetadata: {
        onboarded: true,
        topicsOfInterest: formData.getAll("topicsOfInterest"),
        videoDuration: formData.get("videoDuration"),
      },
    });
    return { message: "User metadata Updated" };
  } catch (e) {
    console.log("error", e);
    return { message: "Error Updating User Metadata" };
  }
};
