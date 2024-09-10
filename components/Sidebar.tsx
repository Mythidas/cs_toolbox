"use client";

import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div>
      <nav className="flex flex-col">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);

          return (
            <Link key={link.route} href={link.route} className={cn("p-4 rounded-md")}>
              {link.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar;