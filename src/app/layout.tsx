import { ClerkProvider } from "@clerk/nextjs"; // https://clerk.com/docs/quickstarts/nextjs#add-clerk-provider-and-clerk-components-to-your-app
import "./globals.css";
import Sidebar from "./components/Sidebar";

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
          <div className="flex">
            <header>
              <Sidebar />
            </header>
            <main>{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
