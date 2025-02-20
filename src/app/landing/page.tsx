import Feed from "@/components/feed";

export default async function landing() {
  return (
    <div className="flex h-screen  overflow-y-auto">
      <main className="flex flex-1 flex-col md:flex-row gap-4 md:gap-10 items-center mx-[10%]">
        <div className="block mx-8 mt-8 w-full text-center md:w-1/3">
          <h1>TikTok-style welcome page.</h1>
          <span>Find stuff you like</span>
          <ul></ul>
        </div>
        <div className="h-screen grow">
          <Feed />
        </div>
      </main>
    </div>
  );
}
