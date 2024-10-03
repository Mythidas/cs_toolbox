import SitesHeader from "@/components/SitesHeader";
import { getAutoTaskSites } from "@/lib/actions/company.action";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SiteDashboard = async ({ params }: URLParams) => {
  const sites = await getAutoTaskSites();
  const currentSite = sites.find((site) => site.id === Number(params["siteId"] as string));

  if (!currentSite) {
    redirect("/sites");
  }

  return (
    <div className="flex flex-col w-full h-full p-sm space-y-2">
      <SitesHeader sites={sites} currentSite={currentSite} />
      <div className="flex flex-col size-full space-y-2">
        <div className="flex p-sm card">
          <span>
            Please visit <Link href={`/sites/${currentSite.id}/tickets`} className="text-primary">Tickets</Link> and <Link href={`/sites/${currentSite.id}/devices`} className="text-primary">Devices</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SiteDashboard;