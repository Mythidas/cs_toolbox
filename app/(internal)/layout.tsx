import Navbar from "@/components/Navbar";
import React from "react";

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <main className="flex flex-col size-full">
      <Navbar />
      <div className="flex size-full p-sm overflow-clip">
        {children}
      </div>
    </main>
  )
}

export default RootLayout;