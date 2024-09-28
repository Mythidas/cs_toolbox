import SitesHeader from "@/components/SitesHeader";
import { getAutoTaskSites } from "@/lib/actions/company.action";
import { redirect } from "next/navigation";
import React from "react";

const SiteDevices = async ({ params }: URLParams) => {
  const sites = await getAutoTaskSites();
  const currentSite = sites.find((site) => site.id === Number(params["siteId"] as string));

  if (!currentSite) {
    redirect("/sites");
  }

  return (
    <div className="flex flex-col w-full h-full p-sm space-y-2">
      <SitesHeader sites={sites} currentSite={currentSite} path="/devices" />
      <div className="size-full bg-card p-sm">

      </div>
    </div>
  )
}

export default SiteDevices;