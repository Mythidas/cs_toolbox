"use server";

import React from "react";
import {
  NavigationMenu,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Navmenu from "./Navmenu";
import Link from "next/link";

interface NavbarProps {
  loggedInUser: any;
}

const Navbar = async ({ loggedInUser }: NavbarProps) => {
  //const sites = await getSites();

  return (
    <NavigationMenu className="flex max-w-full w-full justify-between p-2 border-b-[1px]">
      <div className="flex gap-sm">
        <Link href="/" className="px-sm">
          <Image src="/icons/toolbox.png" alt="toolbox logo" width={36} height={36} />
        </Link>
        <Navmenu />
      </div>
      <div>
        <h1 className="font-semibold text-primary">
          {loggedInUser.name}
        </h1>
      </div>
    </NavigationMenu>
  )
}

export default Navbar;