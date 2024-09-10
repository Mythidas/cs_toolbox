import Sidebar from "@/components/Sidebar";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <main className="flex w-screen h-screen overflow-y-clip">
      <Sidebar />
      <div>
        {children}
      </div>
    </main>
  )
}

export default RootLayout;