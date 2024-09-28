import { getVSASite } from "@/lib/actions/company.action";
import { getSophosDevices, getVSAXDevices } from "@/lib/actions/device.action";
import React from "react";
import DeviceTableVSA from "./DeviceTableVSA";
import DeviceTableSophos from "./DeviceTableSophos";

interface DeviceViewProps {
  site: AutoTaskCompany;
}

const DeviceView = async ({ site }: DeviceViewProps) => {
  const vsaSite = await getVSASite(site.id);

  const vsaxDevices = await getVSAXDevices(vsaSite?.Id.toString() || "");
  const sophosDevices = vsaSite?.sophosTenantId ? await getSophosDevices(vsaSite?.sophosTenantId) : [];

  return (
    <div className="flex w-full h-full space-x-2">
      <DeviceTableVSA devices={vsaxDevices} />
      <DeviceTableSophos devices={sophosDevices} />
    </div>
  )
}

export default DeviceView;