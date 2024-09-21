import Navbar from "@/components/Navbar";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<RootLayoutProps>) => {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("/sign-in");

  return (
    <main className="flex flex-col size-full">
      <Navbar loggedInUser={loggedInUser} />
      <div className="flex size-full p-sm overflow-clip">
        {children}
      </div>
    </main>
  )
}

export default RootLayout;