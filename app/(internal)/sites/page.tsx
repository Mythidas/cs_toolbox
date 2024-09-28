import SitesHeader from "@/components/SitesHeader";
import { getAutoTaskSites } from "@/lib/actions/company.action";
import React from 'react'

const Sites = async () => {
  const sites = await getAutoTaskSites();

  return (
    <div className="flex flex-col w-full h-full p-sm">
      <SitesHeader sites={sites} />
    </div>
  )
}

export default Sites;