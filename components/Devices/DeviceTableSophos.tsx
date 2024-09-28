"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";

interface DeviceTableSophosProps {
  devices: SophosDevice[];
}

const DeviceTableSophos = ({ devices }: DeviceTableSophosProps) => {
  const columns: ColumnDef<SophosDevice>[] = [
    {
      accessorKey: "hostname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "os",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="OS" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.os.name}
          </div>
        )
      }
    },
    {
      accessorKey: "lastSeenAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Online" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.lastSeenAt && getTimeSinceDate(row.original.lastSeenAt)}
          </div>
        )
      }
    }
  ]

  function getTimeSinceDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 5) {
      return "Now";
    }

    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    let timeString = "";
    if (days > 0) {
      timeString += `${days}d `;
    }
    if (remainingHours > 0) {
      timeString += `${remainingHours}h `;
    }
    timeString += `${remainingMinutes}m`;
    return timeString.trim();
  }

  return (
    <div className="w-full">
      <DataTable data={devices} columns={columns} height="h-[92%]" paginateTag="Device" refreshInterval={60 * 1000 * 10} hidePageInfo />
    </div>
  )
}

export default DeviceTableSophos;