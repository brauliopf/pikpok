"use client";
// ref: https://clerk.com/blog/add-onboarding-flow-for-your-application-with-clerk

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "../actions";

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await completeOnboarding(formData);
    await user?.reload();
    router.push("/feed");
  };

  return (
    <div className="px-8 md:px-20 flex">
      <div className="mx-auto overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900">Welcome!</h3>
          <span>Let&rsquo;s spend some quality time together.</span>
        </div>
        <form action={handleSubmit}>
          <div className="pb-8 px-8 flex flex-row space-x-4">
            <div className="">
              <label className="block text-sm font-semibold text-gray-700">
                What content topics would interest you today? (Select all that
                apply)
              </label>
              <div className="mt-1 w-full">
                <div className="flex flex-col">
                  {[
                    "Art and creative content",
                    "Automotive and vehicles",
                    "Beauty and makeup",
                    "Business and entrepreneurship",
                    "Comedy and humor",
                    "Educational and academic",
                    "Fashion and style",
                    "Fitness and wellness",
                    "Food and cooking",
                    "Gaming",
                    "Movies and TV content",
                    "Music and dance",
                    "News and current events",
                    "Personal vlogs and lifestyle",
                    "Pets and animals",
                    "Science and nature",
                    "Sports and athletics",
                    "Tech and gadgets",
                    "Travel and adventure",
                  ].map((option, index) => (
                    <label
                      key={index}
                      className="inline-flex items-center cursor-pointer py-0.5"
                    >
                      <input
                        id={option.replace(/\s+/g, "-").toLowerCase()}
                        type="checkbox"
                        name="topicsOfInterest"
                        value={option}
                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 block text-gray-500 sm:text-sm">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                How long do you prefer your TikTok videos to be? (Select one)
              </label>
              <div className="mt-1 w-full">
                <div className="flex flex-col">
                  {[
                    "Under 15 seconds",
                    "15-30 seconds",
                    "30-60 seconds",
                    "1-3 minutes",
                    "Over 3 minutes",
                    "Length doesn't matter if the content is engaging",
                  ].map((option, index) => (
                    <label
                      key={index}
                      className="inline-flex items-center cursor-pointer py-0.5"
                    >
                      <input
                        id={option.replace(/\s+/g, "-").toLowerCase()}
                        type="radio"
                        name="videoDuration"
                        value={option}
                        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 block text-gray-500 sm:text-sm">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-4 mt-16 float-center">
                <button
                  type="submit"
                  className="w-1/3 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
