import { ClerkProvider } from "@clerk/nextjs"; // https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app
import "./globals.css";
import AppSidebar from "./_components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

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
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
