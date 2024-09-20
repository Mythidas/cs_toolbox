"use client";

import React from "react";
import ComboInput from "@/components/ComboInput";
import { useRouter } from "next/navigation";

interface DeviceHeaderProps {
  sites: VSAXSite[];
  selectedSite: VSAXSite | null;
}

const DeviceHeader = ({ sites, selectedSite }: DeviceHeaderProps) => {
  const { replace } = useRouter();

  function handleChange(option: Option) {
    replace(`?siteId=${option.value}`);
  }

  return (
    <div className="w-full h-fit p-sm card">
      <ComboInput
        defaultValue={selectedSite?.Id.toString() || ""}
        placeholder="Site"
        options={sites.map((site) => ({ label: site.Name, value: site.Id.toString() }))}
        onChange={handleChange}
      />
    </div>
  )
}

export default DeviceHeader;