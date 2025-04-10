import { ClerkProvider } from "@clerk/nextjs"; // https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app
import "./globals.css";
import AppSidebar from "../components/sidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Home, LogIn, CloudUpload } from "lucide-react"; // https://lucide.dev/icons/
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoUploadForm from "../components/videoUploadForm";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="..." />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          <div className="flex flex-col min-h-screen">
            <header className="w-full bg-white" />
            <div className="flex w-full">
              <SidebarProvider>
                <AppSidebar />
              </SidebarProvider>
              <main className="w-full">{children}</main>
              <div className="md:hidden w-full flex flex-row rounded-lg border-2 py-2 fixed bottom-0 bg-gray-50 gap-8">
                <h2 className="bold px-4 mr-4 border-r-2 fixed border-gray-300">
                  PicPoc
                </h2>
                <SignedOut>
                  <div className="flex flex-row w-full justify-end items-center pr-4 flex-grow gap-4 text-gray-500">
                    <SignInButton>
                      <a
                        href="#"
                        className="flex justify-center hover:bg-zinc-200 p-1"
                      >
                        <LogIn />
                      </a>
                    </SignInButton>
                    <a
                      href="/feed"
                      className="flex justify-center hover:bg-zinc-200 p-1"
                    >
                      <Home />
                    </a>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-row flex-grow w-full justify-end items-center gap-4 text-gray-500">
                    <a
                      href="/feed"
                      className="flex justify-center hover:bg-zinc-200 p-1"
                    >
                      <Home />
                    </a>
                    <Dialog>
                      <DialogTrigger>
                        <a
                          href="#"
                          className="flex justify-center hover:bg-zinc-200 p-1"
                        >
                          <CloudUpload />
                        </a>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>File Upload</DialogTitle>
                          <DialogDescription>
                            Select Video to Upload (.mp4)
                          </DialogDescription>
                        </DialogHeader>
                        <VideoUploadForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <ul className="flex justify-center hover:none pr-4">
                    <UserButton />
                  </ul>
                </SignedIn>
              </div>
              <Toaster />
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
