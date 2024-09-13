"use server";

import React from "react";
import {
  NavigationMenu,
} from "@/components/ui/navigation-menu";
import ComboInput from "@/components/ComboInput";
import Image from "next/image";
import Navmenu from "./Navmenu";
import Link from "next/link";
import { getSites } from "@/lib/actions/site.action";

const Navbar = async () => {
  //const sites = await getSites();

  return (
    <NavigationMenu className="flex max-w-full w-full justify-between p-2 border-b-[1px]">
      <div className="flex gap-sm">
        <Link href="/" className="px-sm">
          <Image src="/icons/toolbox.png" alt="toolbox logo" width={36} height={36} />
        </Link>
        <Navmenu />
      </div>
      {/* <div>
        <ComboInput options={sites.map((_site: Site) => { return { label: _site.name, value: _site.vsaId.toString() } })} placeholder="site" />
      </div> */}
    </NavigationMenu>
  )
}

export default Navbar;