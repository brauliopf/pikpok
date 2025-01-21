import { ClerkProvider } from "@clerk/nextjs";
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
            <Sidebar />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
