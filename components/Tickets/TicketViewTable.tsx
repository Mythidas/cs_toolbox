"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { AUTOTASK_COMPANY_URL, AUTOTASK_TICKET_URL, convertFiltersToURLParams, TIMEZONES } from "@/constants";
import { Link, Loader } from "lucide-react";
import ComboInput from "../ComboInput";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DateInput } from "../DateInput";
import TicketActions from "./TicketActions";

export interface TicketViewProps {
  tickets: AutoTaskTicket[];
  companies: AutoTaskCompany[];
  queues: AutoTaskFieldValue[];
  statuses: AutoTaskFieldValue[];
  priorities: AutoTaskFieldValue[];
  resources: AutoTaskResource[];
  locations: AutoTaskCompanyLocation[];
  params: TicketParams;
  views: Option[];
}

const URL_TIMEOUT = 10000;

const TicketViewTable = ({ info }: { info: TicketViewProps }) => {
  const columns: ColumnDef<AutoTaskTicket>[] = [
    {
      accessorKey: "ticketNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ticket Number" renderFilter={() =>
          <Input
            placeholder="Ticket Number..."
            defaultValue={filters.ticketNumber ?? ""}
            onChange={(event) => handleFilterChange("ticketNumber", event.target.value)}
            className="w-fit max-w-36"
          />
        } />
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
        <DataTableColumnHeader column={column} title="Title" renderFilter={() =>
          <Input
            placeholder="Title..."
            defaultValue={filters.title ?? ""}
            onChange={(event) => handleFilterChange("title", event.target.value)}
            className="w-full"
          />
        } />
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
        <DataTableColumnHeader column={column} title="Company" renderFilter={() =>
          <div className="w-fit">
            <ComboInput
              defaultValue={filters.companyID ? filters.companyID.toString() : ""}
              options={info.companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => ({
                value: company.id.toString(),
                label: company.companyName,
              }))}
              onChange={(selectedOption) => handleFilterChange("companyID", Number(selectedOption.value))}
              placeholder="Company..."
            />
          </div>
        } />
      ),
      cell: ({ row }) => {
        return (
          <a href={`${AUTOTASK_COMPANY_URL}${row.original.companyID}`} target="_blank" rel="noreferrer" className="min-w-32 line-clamp-2 text-primary hover:text-secondary-foreground dark:hover:text-primary-foreground">
            <p>{info.companies.find((company) => company.id === row.original.companyID)?.companyName}</p>
          </a>
        )
      },
      sortingFn: (a, b) => {
        const companyA = info.companies.find((company) => company.id === a.original.companyID);
        const companyB = info.companies.find((company) => company.id === b.original.companyID);
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
        <DataTableColumnHeader column={column} title="Queue" renderFilter={() =>
          <div className="w-fit">
            <ComboInput
              defaultValue={filters.queueID ? filters.queueID.toString() : ""}
              options={info.queues.sort((a, b) => a.label.localeCompare(b.label)).map((_queue) => ({
                value: _queue.value,
                label: `${_queue.label} (${info.tickets.filter(ticket => ticket.queueID === Number(_queue.value)).length})`,
              }))}
              onChange={(selectedOption) => handleFilterChange("queueID", Number(selectedOption.value))}
              placeholder="Queue..."
            />
          </div>
        } />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {info.queues.find((queue) => Number(queue.value) === row.original.queueID)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const queueA = info.queues.find((queue) => Number(queue.value) === a.original.queueID);
        const queueB = info.queues.find((queue) => Number(queue.value) === b.original.queueID);
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
        <DataTableColumnHeader column={column} title="Resource" renderFilter={() =>
          <div className="w-fit">
            <ComboInput
              defaultValue={filters.assignedResourceID ? filters.assignedResourceID.toString() : ""}
              options={info.resources.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)).map((resource) => ({
                value: resource.id.toString(),
                label: `${resource.firstName} ${resource.lastName}`,
              }))}
              onChange={(selectedOption) => handleFilterChange("assignedResourceID", Number(selectedOption.value))}
              placeholder="Resource..."
            />
          </div>
        } />
      ),
      cell: ({ row }) => {
        const resource = info.resources.find((resource) => resource.id === row.original.assignedResourceID);

        return (
          <div className="text-nowrap">
            {resource ? `${resource?.firstName} ${resource?.lastName}` : ""}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const resourceA = info.resources.find((resource) => resource.id === a.original.assignedResourceID);
        const resourceB = info.resources.find((resource) => resource.id === b.original.assignedResourceID);
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
        <DataTableColumnHeader column={column} title="Status" renderFilter={() =>
          <div className="w-fit">
            <ComboInput
              defaultValue={filters.status ? filters.status.toString() : ""}
              options={info.statuses.sort((a, b) => a.label.localeCompare(b.label)).map((status) => ({
                value: status.value,
                label: status.label,
              }))}
              onChange={(selectedOption) => handleFilterChange("status", Number(selectedOption.value))}
              placeholder="Status..."
            />
          </div>
        } />
      ),
      cell: ({ row }) => {
        return (
          <div className="min-w-28">
            {info.statuses.find((status) => Number(status.value) === row.original.status)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const statusA = info.statuses.find((status) => Number(status.value) === a.original.status);
        const statusB = info.statuses.find((status) => Number(status.value) === b.original.status);
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
        <DataTableColumnHeader column={column} title="Priority" renderFilter={() =>
          <div className="w-fit">
            <ComboInput
              defaultValue={filters.priority ? filters.priority.toString() : ""}
              options={info.priorities.sort((a, b) => a.label.localeCompare(b.label)).map((priority) => ({
                value: priority.value,
                label: priority.label,
              }))}
              onChange={(selectedOption) => handleFilterChange("priority", Number(selectedOption.value))}
              placeholder="Priority..."
            />
          </div>
        } />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {info.priorities.find((priority) => Number(priority.value) === row.original.priority)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const priorityA = info.priorities.find((priority) => Number(priority.value) === a.original.priority);
        const priorityB = info.priorities.find((priority) => Number(priority.value) === b.original.priority);
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
        <DataTableColumnHeader column={column} title="Last Activity" renderFilter={() =>
          <DateInput
            placeholder="Date"
            value={filters.lastActivityDate}
            onChange={(value) => {
              if (value) {
                value.setHours(0);
                value.setMinutes(0);
              }
              handleFilterChange("lastActivityDate", value)
            }}
          />
        } />
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
                <span>Timezone is within 2 hours of 5pm</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 my-auto rounded-full bg-red-500"></div>
                <span>Timezone is after 5pm</span>
              </div>
            </div>
          )
        }} />
      ),
      cell: ({ row }) => {
        const location = info.locations.find((location) => location.id === row.original.companyLocationID);
        return (
          <div className="flex space-x-2">
            <div className={`w-3 h-3 my-auto rounded-full ${location?.state ? getTimezoneInidicatorColor(location?.state) : "hidden"}`}></div>
            <span>{location?.state ? (getTimezoneFromState(location?.state)?.label || "N/A") : "N/A"}</span>
          </div>
        )
      },
      sortingFn: (a, b) => {
        const offsetA = getTimezoneFromState(info.locations.find((location) => location.id === a.original.companyLocationID)?.state || "")?.offset || 0;
        const offsetB = getTimezoneFromState(info.locations.find((location) => location.id === b.original.companyLocationID)?.state || "")?.offset || 0;
        return offsetA - offsetB;
      }
    }
  ];

  const [filters, setFilters] = React.useState<TicketParams>(info.params);
  const [loading, setLoading] = React.useState(false);

  const { replace } = useRouter();
  const pathname = usePathname();


  React.useEffect(() => {
    setLoading(false);
    setFilters(info.params);
  }, [info.params]);

  function handleFilterChange(column: keyof TicketParams, value: string | number | Date | undefined) {
    if (column === "ticketNumber" || column === "title") {
      if (filters[column] === value) {
        filters[column] = undefined;
        return filters;
      }

      filters[column] = value as string;
    }
    if (column === "companyID" || column === "queueID" || column === "assignedResourceID" || column === "status" || column === "priority") {
      if (filters[column]?.includes(value as number)) {
        filters[column] = filters[column]?.filter((item) => item !== value);
        return filters;
      }

      filters[column] = [value as number];
    }
    if (column === "lastActivityDate") {
      filters[column] = value as Date;
    }
  }

  function handleApplyFilters() {
    setLoading(true);
    const urlParams = convertFiltersToURLParams(filters);
    replace(`${pathname}${urlParams}`);

    setTimeout(() => {
      setLoading(false);
    }, URL_TIMEOUT);
  }

  function handleClearFilters() {
    setFilters({
      ticketNumber: undefined,
      title: undefined,
      companyID: undefined,
      queueID: undefined,
      assignedResourceID: undefined,
      status: undefined,
      priority: undefined,
      lastActivityDate: undefined,
    })
  }

  function handleViewChange(option: Option) {
    if (option.value === convertFiltersToURLParams(filters)) {
      return;
    }

    setLoading(true);
    replace(`${pathname}${option.value}`);

    setTimeout(() => {
      setLoading(false);
    }, URL_TIMEOUT);
  }

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
    if (timeUntil5PM <= 0) {
      return "bg-red-500";
    }
    if (timeUntil5PM <= 2) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  }

  return (
    <div className="flex flex-col size-full space-y-2 overflow-hidden">
      <div className="flex w-full justify-between p-sm card">
        <TicketActions />
        <div className="flex space-x-6">
          <div className="flex space-x-2">
            <Button onClick={handleApplyFilters} disabled={loading}>
              {loading && <Loader width={20} height={20} className="mr-2 animate-spin" />}
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} disabled={loading} variant="destructive">
              Clear Filters
            </Button>
          </div>
          <ComboInput
            defaultValue={info.views.find((view) => view.value === convertFiltersToURLParams(info.params))?.value || undefined}
            options={info.views}
            onChange={(value: Option) => {
              handleViewChange(value);
            }}
            placeholder="Select View..."
            disableToggle
          />
        </div>
      </div>
      <DataTable data={info.tickets} columns={columns} height="h-[92%]" paginateTag="Ticket" refreshInterval={60 * 1000 * 10} />
    </div>
  )
}

export default TicketViewTable;