import { ClerkProvider } from "@clerk/nextjs"; // https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app
import "./globals.css";
import AppSidebar from "./_components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import Footer from "@/app/_components/Footer";

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
        </head>
        <body>
          <div className="flex flex-col min-h-screen">
            <header className="w-full bg-white">
              <div className="h-8 px-4 flex items-center"></div>
            </header>
            <div className="flex">
              <SidebarProvider>
                <AppSidebar />
              </SidebarProvider>
              <main className="">{children}</main>
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
