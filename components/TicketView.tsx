"use client";

import React from "react";
import { ColumnDef, Table } from "@tanstack/react-table"
import { DataTable } from "./DataTable";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import TicketViewFilters from "./TicketViewFilters";
import { AUTOTASK_COMPANY_URL, AUTOTASK_TICKET_URL } from "@/constants";
import { Link } from "lucide-react";

export interface TicketViewProps {
  tickets: AutoTaskTicket[];
  companies: AutoTaskCompany[];
  queues: AutoTaskFieldValue[];
  statuses: AutoTaskFieldValue[];
  priorities: AutoTaskFieldValue[];
  resources: AutoTaskResource[];
}

const TicketView = ({ view }: { view: TicketViewProps }) => {
  const columns: ColumnDef<AutoTaskTicket>[] = [
    {
      accessorKey: "ticketNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ticket Number" />
      ),
      cell: ({ row }) => {
        return (
          <a href={`${AUTOTASK_TICKET_URL}${row.original.id}`} target="_blank" rel="noreferrer" className="flex space-x-1 text-primary hover:text-primary-foreground">
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
          <a href={`${AUTOTASK_COMPANY_URL}${row.original.companyID}`} target="_blank" rel="noreferrer" className="flex min-w-32 line-clamp-2 space-x-1 text-primary hover:text-primary-foreground">
            <p>{view.companies.find((company) => company.id === row.original.companyID)?.companyName}</p>
            <Link size="0.8em" className="my-auto" />
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
    }
  ];

  return (
    <div className="size-full">
      <DataTable data={view.tickets} columns={columns} paginateTag="Ticket" renderFilter={(_table: Table<AutoTaskTicket>) => (<TicketViewFilters view={view} table={_table} />)} />
    </div>
  )
}

export default TicketView;