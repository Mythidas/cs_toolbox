import { getSophosDevices, getVSAXDevices } from "@/lib/actions/device.action";
import React from "react";

interface DeviceViewProps {
  site: VSAXSite;
}

const DeviceView = async ({ site }: DeviceViewProps) => {
  const vsaxDevices = await getVSAXDevices(site.Id.toString());
  const sophosDevices = await getSophosDevices(site.sophosTenantId || "");

  return (
    <div>

    </div>
  )
}

export default DeviceView;