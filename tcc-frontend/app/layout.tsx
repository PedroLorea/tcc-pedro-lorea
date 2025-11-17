import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NotificationProvider } from "@/utils/NotificacaoContext";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roglio Transportadora",
  description: "Transportadora de líquidos inflamáveis",
  icons: {
    icon: "/roglio_logo.ico",
    shortcut: "/roglio_logo.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const token = (await cookies()).get("jwt")?.value;
  const isAuthenticated = !!token;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header initialAuth={isAuthenticated}/>
        <main className="min-h-[calc(100vh-80px)]">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </main>
      </body>
    </html>
  );
}
