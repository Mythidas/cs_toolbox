import { getDevices } from "@/lib/actions/device.action";
import React from "react";
import DeviceTable from "./DeviceTable";

interface DeviceViewProps {
  site: AutoTaskCompany;
}

const DeviceView = async ({ site }: DeviceViewProps) => {
  const devices = await getDevices(site.id);

  return (
    <div className="flex w-full h-full space-x-2">
      <DeviceTable devices={devices} />
    </div>
  )
}

export default DeviceView;