import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TwitchChat from "./components/TwitchChat";
import { currentUser } from "@clerk/nextjs/server";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const user = await currentUser();
  const username = user?.username || "";
  console.log(username, "here");

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased relative z-10">
          <SignedOut>
            <div className="flex flex-row min-h-screen justify-center items-center relative z-20 ">
              <div className="relative z-20 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome to CP9Neji's 20 Questions!
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Please sign in to continue.
                </p>

                <a
                  href="#"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <SignInButton mode="modal">
                    <span className="font-bold">Sign In</span>
                  </SignInButton>
                  <svg
                    className="w-4 h-4 ml-2 -mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 7h15M8 1l6 6-6 6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <header className="relative grid grid-flow-col auto-cols-auto z-10">
              <div className="max-w-sm mt-10">
                <UserButton></UserButton>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-[5rem] h-[5rem] mr-20">
                  <Image
                    className="inline-block rounded-full ring-2 ring-white"
                    src="/profile_pic.png"
                    alt=""
                    layout="fill"
                    objectFit="contain"
                  ></Image>
                </div>
                <h1 className="className text-4xl font-bold mr-16">
                  20 Questions
                </h1>
              </div>
              <div className="font-bold text-end content-center">CP9Neji</div>
            </header>
            <div className="fixed top-23 right-24 w-[25vw] h-[100vh] p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 z-10 opacity-20"></div>
            <div className="z-20 fixed top-23 right-0 w-[25vw] h-[100vh] p-6">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Chat Log
                </h5>
              </a>
              <div className="chat-messages relative h-full overflow-y-auto right-24">
                <TwitchChat channel="cp9Neji"></TwitchChat>
              </div>
            </div>
            {children}
          </SignedIn>
          <video
            muted
            autoPlay
            loop
            id="myVideo"
            className="fixed top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/background_video.mp4" type="video/mp4" />
          </video>
        </body>
      </html>
    </ClerkProvider>
  );
}
