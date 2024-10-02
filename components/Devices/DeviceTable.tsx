"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";

interface DeviceTableVSAProps {
  devices: { sophos?: SophosDevice, vsax?: VSAXDevice }[];
}

const DeviceTable = ({ devices }: DeviceTableVSAProps) => {
  const columns: ColumnDef<{ sophos?: SophosDevice, vsax?: VSAXDevice }>[] = [
    {
      accessorKey: "Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.vsax?.Name || row.original.sophos?.hostname}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const nameA = rowA.original.vsax?.Name || rowA.original.sophos?.hostname || "";
        const nameB = rowB.original.vsax?.Name || rowB.original.sophos?.hostname || "";
        return nameA.localeCompare(nameB);
      }
    },
    {
      accessorKey: "OS",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="OS" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.vsax?.Description || row.original.sophos?.os.name}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const osA = rowA.original.vsax?.Description || rowA.original.sophos?.os.name || "";
        const osB = rowB.original.vsax?.Description || rowB.original.sophos?.os.name || "";
        return osA.localeCompare(osB);
      }
    },
    {
      accessorKey: "LastSeenOnlineVSA",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Online VSA" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.vsax?.LastSeenOnline ? getTimeSinceDate(row.original.vsax.LastSeenOnline) : <span className="text-destructive">Not Found</span>}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const lastSeenA = rowA.original.vsax?.LastSeenOnline ? new Date(rowA.original.vsax?.LastSeenOnline).getTime() : Number.MAX_SAFE_INTEGER;
        const lastSeenB = rowB.original.vsax?.LastSeenOnline ? new Date(rowB.original.vsax?.LastSeenOnline).getTime() : Number.MAX_SAFE_INTEGER;
        return lastSeenA - lastSeenB;
      }
    },
    {
      accessorKey: "LastSeenOnlineSophos",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Online Sophos" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.sophos?.lastSeenAt ? getTimeSinceDate(row.original.sophos.lastSeenAt) : <span className="text-destructive">Not Found</span>}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const lastSeenA = rowA.original.sophos?.lastSeenAt ? new Date(rowA.original.sophos.lastSeenAt).getTime() : Number.MAX_SAFE_INTEGER;
        const lastSeenB = rowB.original.sophos?.lastSeenAt ? new Date(rowB.original.sophos.lastSeenAt).getTime() : Number.MAX_SAFE_INTEGER;
        return lastSeenA - lastSeenB;
      }
    },
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

export default DeviceTable;