"use client";

import Link from "next/link";
import React from "react";
import { NavigationMenuLink, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavlinkProps {
  link: {
    route: string;
    title: string;
    icon: string;
  }
}

const Navlink = ({ link }: NavlinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link href={link.route} key={link.route} legacyBehavior passHref>
      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "gap-sm transition-all hover:bg-accent-foreground hover:text-muted", { "bg-secondary": isActive })} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Image src={link.icon} alt={link.title} width={20} height={20} className={cn({ "dark:invert": !isHovered, "invert dark:invert-0": isHovered })} />
        {link.title}
      </NavigationMenuLink>
    </Link>
  )
}

export default Navlink;