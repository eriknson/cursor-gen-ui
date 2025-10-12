import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cursor Agent GenUI",
  description: "Generative UI powered by Cursor Agent CLI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
