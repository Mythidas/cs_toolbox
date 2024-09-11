import React from "react";
import { NavigationMenuList } from "./ui/navigation-menu";
import { NAV_LINKS } from "@/constants";
import Navlink from "./Navlink";

const Navmenu = () => {
  return (
    <NavigationMenuList className="flex w-full gap-sm">
      {NAV_LINKS.map((_link) => {
        return <Navlink key={_link.route} link={_link} />
      })}
    </NavigationMenuList>
  )
}

export default Navmenu;