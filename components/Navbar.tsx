"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ComboInput from "@/components/ComboInput";
import { NAV_LINKS } from "@/constants";
import Image from "next/image";

const Navbar = () => {
  return (
    <NavigationMenu className="flex max-w-full w-full justify-between p-2 border-b-[1px]">
      <Image src="/icons/toolbox.png" alt="toolbox logo" width={36} height={36} />
      <NavigationMenuList className="flex w-full gap-2">
        {NAV_LINKS.map((_link) => {
          return (
            <Link href={_link.route} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {_link.title}
              </NavigationMenuLink>
            </Link>
          )
        })}
      </NavigationMenuList>
      <div>
        <ComboInput options={[{ label: "Aaxia", value: "1" }, { label: "Woodlands", value: "2" }, { label: "World Of Smiles", value: "3" }]} placeholder="site" />
      </div>
    </NavigationMenu>
  )
}

export default Navbar;