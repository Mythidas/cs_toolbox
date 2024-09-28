"use client";

import React from "react";
import ComboInput from "./ComboInput";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SitesHeaderParams {
  sites: AutoTaskCompany[];
  currentSite?: AutoTaskCompany;
  path?: string;
}

const SitesHeader = ({ sites, currentSite, path }: SitesHeaderParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname.includes("/tickets") ? "tickets" : pathname.includes("/devices") ? "devices" : "dashboard";

  function handleSelectSite(option: Option) {
    router.replace(`/sites/${option.value}${path ? `/${path}` : ""}`);
  }

  return (
    <div className="flex w-full p-sm justify-between bg-card">
      <div className="w-fit">
        <ComboInput
          options={sites.map(site => ({ label: site.companyName, value: site.id.toString() }))}
          placeholder="Search Sites..."
          onChange={handleSelectSite}
          defaultValue={sites.find((site) => site.id === currentSite?.id)?.id.toString()}
          disableToggle
        />
      </div>
      {pathname.split("/").pop() !== "sites" && (
        <div className="flex space-x-2">
          <Button variant="ghost" asChild className={cn({ "bg-secondary": currentPath === "dashboard" })}>
            <Link href={`/sites/${currentSite?.id}`}>
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild className={cn({ "bg-secondary": currentPath === "tickets" })}>
            <Link href={`/sites/${currentSite?.id}/tickets`}>
              Tickets
            </Link>
          </Button>
          <Button variant="ghost" asChild className={cn({ "bg-secondary": currentPath === "devices" })}>
            <Link href={`/sites/${currentSite?.id}/devices`}>
              Devices
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default SitesHeader;