"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { AUTOTASK_COMPANY_URL, AUTOTASK_TICKET_URL, TIMEZONES } from "@/constants";
import { Link } from "lucide-react";

export interface TicketViewProps {
  tickets: AutoTaskTicket[];
  companies: AutoTaskCompany[];
  queues: AutoTaskFieldValue[];
  statuses: AutoTaskFieldValue[];
  priorities: AutoTaskFieldValue[];
  resources: AutoTaskResource[];
  locations: AutoTaskCompanyLocation[];
}

const TicketViewTable = ({ view }: { view: TicketViewProps }) => {
  const columns: ColumnDef<AutoTaskTicket>[] = [
    {
      accessorKey: "ticketNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ticket Number" />
      ),
      cell: ({ row }) => {
        return (
          <a href={`${AUTOTASK_TICKET_URL}${row.original.id}`} target="_blank" rel="noreferrer" className="flex space-x-1 text-primary hover:text-secondary-foreground dark:hover:text-primary-foreground">
            <p>{row.original.ticketNumber}</p>
            <Link size="0.8em" className="my-auto" />
          </a>
        )
      }
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="min-w-96 line-clamp-2">
            {row.original.title}
          </div>
        )
      }
    },
    {
      accessorKey: "companyID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => {
        return (
          <a href={`${AUTOTASK_COMPANY_URL}${row.original.companyID}`} target="_blank" rel="noreferrer" className="min-w-32 line-clamp-2 text-primary hover:text-secondary-foreground dark:hover:text-primary-foreground">
            <p>{view.companies.find((company) => company.id === row.original.companyID)?.companyName}</p>
          </a>
        )
      },
      sortingFn: (a, b) => {
        const companyA = view.companies.find((company) => company.id === a.original.companyID);
        const companyB = view.companies.find((company) => company.id === b.original.companyID);
        if (companyA && companyB) {
          return companyA.companyName.localeCompare(companyB.companyName);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.companyID === value;
      }
    },
    {
      accessorKey: "queueID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Queue" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {view.queues.find((queue) => Number(queue.value) === row.original.queueID)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const queueA = view.queues.find((queue) => Number(queue.value) === a.original.queueID);
        const queueB = view.queues.find((queue) => Number(queue.value) === b.original.queueID);
        if (queueA && queueB) {
          return queueA.label.localeCompare(queueB.label);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.queueID === value;
      }
    },
    {
      accessorKey: "assignedResourceID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Resource" />
      ),
      cell: ({ row }) => {
        const resource = view.resources.find((resource) => resource.id === row.original.assignedResourceID);

        return (
          <div className="text-nowrap">
            {resource ? `${resource?.firstName} ${resource?.lastName}` : ""}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const resourceA = view.resources.find((resource) => resource.id === a.original.assignedResourceID);
        const resourceB = view.resources.find((resource) => resource.id === b.original.assignedResourceID);
        if (resourceA && resourceB) {
          return `${resourceA.firstName} ${resourceA.lastName}`.localeCompare(`${resourceB.firstName} ${resourceB.lastName}`);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.assignedResourceID === value;
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return (
          <div className="min-w-28">
            {view.statuses.find((status) => Number(status.value) === row.original.status)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const statusA = view.statuses.find((status) => Number(status.value) === a.original.status);
        const statusB = view.statuses.find((status) => Number(status.value) === b.original.status);
        if (statusA && statusB) {
          return statusA.label.localeCompare(statusB.label);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.status === value;
      }
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {view.priorities.find((priority) => Number(priority.value) === row.original.priority)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const priorityA = view.priorities.find((priority) => Number(priority.value) === a.original.priority);
        const priorityB = view.priorities.find((priority) => Number(priority.value) === b.original.priority);
        if (priorityA && priorityB) {
          return priorityA.label.localeCompare(priorityB.label);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.priority === value;
      }
    },
    {
      accessorKey: "lastActivityDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Activity" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-24">
            {new Date(row.original.lastActivityDate).toLocaleString()}
          </div>
        )
      },
    },
    {
      accessorKey: "companyLocationID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TZ" renderTooltip={() => {
          return (
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 my-auto rounded-full bg-green-500"></div>
                <span>Timezone is within 8 hours of 5pm</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 my-auto rounded-full bg-yellow-500"></div>
                <span>Timezone is within 4 hours of 5pm</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 my-auto rounded-full bg-red-500"></div>
                <span>Timezone is within 1 hour of 5pm</span>
              </div>
            </div>
          )
        }} />
      ),
      cell: ({ row }) => {
        const location = view.locations.find((location) => location.id === row.original.companyLocationID);
        return (
          <div className="flex space-x-2">
            <div className={`w-3 h-3 my-auto rounded-full ${location?.state ? getTimezoneInidicatorColor(location?.state) : "hidden"}`}></div>
            <span>{location?.state ? (getTimezoneFromState(location?.state)?.label || "N/A") : "N/A"}</span>
          </div>
        )
      },
      sortingFn: (a, b) => {
        const offsetA = getTimezoneFromState(view.locations.find((location) => location.id === a.original.companyLocationID)?.state || "")?.offset || 0;
        const offsetB = getTimezoneFromState(view.locations.find((location) => location.id === b.original.companyLocationID)?.state || "")?.offset || 0;
        return offsetA - offsetB;
      }
    }
  ];

  function isDstObserved() {
    const jan = new Date(0, 1);
    const jul = new Date(6, 1);
    const offset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    return new Date().getTimezoneOffset() < offset;
  }

  function getTimeUntil5PMInTimezone(timezone: { state: string; shorthand: string; label: string; offset: number; }) {
    if (!timezone) {
      return 0;
    }

    const now = new Date();
    const targetTime = new Date(); targetTime.setUTCHours(17);
    const offset = isDstObserved() ? (timezone.offset + 1) * -1 : timezone.offset * -1;
    const adjustedDate = new Date(now.getTime() - (1000 * 60 * 60 * offset));

    return 17 - adjustedDate.getUTCHours();
  }

  function getTimezoneFromState(state: string) {
    return TIMEZONES.find((timezone) => timezone.state.toLowerCase() === state.toLowerCase() || timezone.shorthand.toLowerCase() === state.toLowerCase());
  }

  function getTimezoneInidicatorColor(timezone: string) {
    const timezoneObj = getTimezoneFromState(timezone);
    if (!timezoneObj) {
      return "hidden";
    }

    const timeUntil5PM = getTimeUntil5PMInTimezone(timezoneObj);
    if (timeUntil5PM <= 1) {
      return "bg-red-500";
    }
    if (timeUntil5PM <= 4) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  }

  return (
    <DataTable data={view.tickets} columns={columns} paginateTag="Ticket" refreshInterval={60 * 1000 * 10} />
  )
}

export default TicketViewTable;