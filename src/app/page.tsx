import Feed from "@/components/feed";

export default async function feedPage() {
  return (
    <div className="flex flex-1 fixed left-0 right-0 top-0 bottom-0 h-screen overflow-y-auto">
      <Feed />
    </div>
  );
}
