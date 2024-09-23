import DeviceHeader from "@/components/Devices/DeviceHeader";
import DeviceView from "@/components/Devices/DeviceView";
import { getVSASite, getVSASites } from "@/lib/actions/company.action";
import React from "react";

const Devices = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const sites = await getVSASites();
  const selectedSite = searchParams?.siteId ? await getVSASite(searchParams?.siteId as string) : null;

  return (
    <div className="flex flex-col size-full">
      <DeviceHeader sites={sites} selectedSite={selectedSite} />
      {selectedSite && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <DeviceView site={selectedSite} />
        </React.Suspense>
      )}
    </div>
  )
}

export default Devices;