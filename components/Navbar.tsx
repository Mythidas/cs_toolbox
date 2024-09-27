"use server";

import React from "react";
import {
  NavigationMenu,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Navmenu from "./Navmenu";
import Link from "next/link";
import { getLoggedInUser } from "@/lib/actions/user.action";

const Navbar = async () => {
  const loggedInUser = await getLoggedInUser();

  return (
    <NavigationMenu className="flex w-full h-[5%] max-w-full justify-between p-sm shadow-md dark:shadow-none z-10">
      <div className="flex px-sm gap-sm">
        <Link href="/" className="px-sm">
          <Image src="/icons/toolbox.png" alt="toolbox logo" width={36} height={36} />
        </Link>
        <Navmenu />
      </div>
      <div className="px-sm">
        <h1 className="font-semibold text-primary">
          {loggedInUser?.user?.name}
        </h1>
      </div>
    </NavigationMenu>
  )
}

export default Navbar;