import Feed from "@/components/feed";

export default async function landing() {
  return (
    <div className="flex flex-1 left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <main className="flex flex-1 flex-row gap-20 items-center mx-[10%]">
        <div className="fixed">
          <span>TikTok-style welcome page.</span>
          <ul></ul>
        </div>
        <div className="flex-grow"></div>
        <div className="h-screen">
          <Feed />
        </div>
      </main>
    </div>
  );
}
