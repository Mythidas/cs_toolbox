import Navbar from "@/components/Navbar";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <main className="flex flex-col overflow-y-clip">
      <Navbar />
      <div className="flex size-full p-sm">
        {children}
      </div>
    </main>
  )
}

export default RootLayout;