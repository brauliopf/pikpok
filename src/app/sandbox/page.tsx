import { getVideos } from "@/db/query";
import { generateVideoMetadataSandbox as generateVideoMetadata } from "../actions";

export default async function Sandbox() {
  const videos = await getVideos({ limit: 10, offset: 0 });

  return (
    <div>
      <h1>Sandbox</h1>
      <div className="align-center p-10 w-1/2">
        <h2>Video Processing</h2>
        <form
          className=" flex flex-col gap-4 border-gray-300"
          action={generateVideoMetadata}
        >
          <select
            name="video"
            className="p-2.5 border border-gray-300 rounded-md w-full"
          >
            {videos.data.map((video) => (
              <option
                value={JSON.stringify(video)}
                key={video.title}
                style={{ padding: "10px" }}
              >
                {video.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-500 text-white cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
