import { ClerkProvider } from "@clerk/nextjs"; // https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app
import "./globals.css";
import AppSidebar from "../components/sidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

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
            <header className="w-full py-2 bg-white"></header>
            <div className="flex flex-row">
              <SidebarProvider>
                <AppSidebar />
              </SidebarProvider>
              <main className="w-full">{children}</main>
              <Toaster />
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
