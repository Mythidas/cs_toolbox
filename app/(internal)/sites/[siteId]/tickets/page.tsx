import SitesHeader from "@/components/SitesHeader";
import CompanyTicketView from "@/components/Tickets/CompanyTicketView";
import TicketView from "@/components/Tickets/TicketView";
import TicketViewSkeleton from "@/components/Tickets/TicketViewSkeleton";
import { convertFiltersToURLParams, convertSearchParamsToFilters } from "@/constants";
import { getAutoTaskSites } from "@/lib/actions/company.action";
import { redirect } from "next/navigation";
import React from "react";

const SiteTickets = async ({ params, searchParams }: URLParams) => {
  const sites = await getAutoTaskSites();
  const currentSite = sites.find((site) => site.id === Number(params["siteId"] as string));

  if (!currentSite) {
    redirect("/sites");
  }

  if (searchParams["companyID"] && Number(searchParams["companyID"]) !== currentSite.id) {
    searchParams["companyID"] = currentSite.id.toString();
    const filters = convertSearchParamsToFilters(searchParams);
    const url = convertFiltersToURLParams(filters);
    redirect(`/sites/${currentSite.id}/tickets${url}`);
  }

  searchParams["companyID"] = currentSite.id.toString();

  return (
    <div className="flex flex-col w-full h-full p-sm space-y-2">
      <SitesHeader sites={sites} currentSite={currentSite} path="/tickets" />

      <React.Suspense fallback={<TicketViewSkeleton />}>
        <CompanyTicketView searchParams={searchParams} company={currentSite} params={{}} />
      </React.Suspense>
    </div>
  )
}

export default SiteTickets;