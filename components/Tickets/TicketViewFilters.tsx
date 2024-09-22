"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import ComboInput from "@/components/ComboInput";
import { type TicketViewProps } from "./TicketViewTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Loader } from "lucide-react";

interface TicketViewFiltersProps {
  info: TicketViewProps;
  params: AutoTaskTicketFetchParams;
  views: Option[];
}

const URL_TIMEOUT = 7000;

const TicketViewFilters = ({ info, params, views }: TicketViewFiltersProps) => {
  const [filters, setFilters] = React.useState<AutoTaskTicketFetchParams>(params);
  const [loading, setLoading] = React.useState(false);

  const { replace } = useRouter();
  const pathname = usePathname();


  React.useEffect(() => {
    setLoading(false);
    setFilters(params);
  }, [params]);

  function handleChange(column: keyof AutoTaskTicketFetchParams, value: string | number | undefined) {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      console.log(newFilters);
      if (column === "ticketNumber" || column === "title") {
        if (newFilters[column] === value) {
          newFilters[column] = undefined;
          return newFilters;
        }

        newFilters[column] = value as string;
      }
      if (column === "companyID" || column === "queueID" || column === "assignedResourceID" || column === "status" || column === "priority") {
        if (newFilters[column]?.includes(value as number)) {
          newFilters[column] = newFilters[column]?.filter((item) => item !== value);
          return newFilters;
        }

        newFilters[column] = [value as number];
      }

      return newFilters;
    });
  }

  function handleApply() {
    setLoading(true);
    const urlParams = convertFiltersToURLParams(filters);
    replace(`${pathname}${urlParams}`);

    setTimeout(() => {
      setLoading(false);
    }, URL_TIMEOUT);
  }

  function handleViewChange(option: Option) {
    setLoading(true);
    replace(`${pathname}${option.value}`);

    setTimeout(() => {
      setLoading(false);
    }, URL_TIMEOUT);
  }

  function convertFiltersToURLParams(filters: AutoTaskTicketFetchParams): string {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value === null || value === undefined) {
        return acc;
      }

      if (Array.isArray(value)) {
        return `${acc}${value.map((_val) => `${key}=${_val}`).join("&")}&`;
      }

      return `${acc}${key}=${value}&`;
    }, "?").slice(0, -1);
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex w-full h-fit px-1 py-sm items-center space-x-2 overflow-x-auto">
        <Input
          placeholder="Search Ticket Number..."
          value={filters.ticketNumber ?? ""}
          onChange={(event) => handleChange("ticketNumber", event.target.value)}
          className="w-fit max-w-xs"
        />
        <Input
          placeholder="Search Title..."
          value={filters.title ?? ""}
          onChange={(event) => handleChange("title", event.target.value)}
          className="max-w-sm min-w-fit"
        />
        <div>
          <ComboInput
            defaultValue={filters.companyID ? filters.companyID.toString() : ""}
            options={info.companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => ({
              value: company.id.toString(),
              label: company.companyName,
            }))}
            onChange={(selectedOption) => handleChange("companyID", Number(selectedOption.value))}
            placeholder="Company"
          />
        </div>
        <div>
          <ComboInput
            defaultValue={filters.queueID ? filters.queueID.toString() : ""}
            options={info.queues.sort((a, b) => a.label.localeCompare(b.label)).map((_queue) => ({
              value: _queue.value,
              label: `${_queue.label} (${info.tickets.filter(ticket => ticket.queueID === Number(_queue.value)).length})`,
            }))}
            onChange={(selectedOption) => handleChange("queueID", Number(selectedOption.value))}
            placeholder="queue"
          />
        </div>
        <div>
          <ComboInput
            defaultValue={filters.assignedResourceID ? filters.assignedResourceID.toString() : ""}
            options={info.resources.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)).map((resource) => ({
              value: resource.id.toString(),
              label: `${resource.firstName} ${resource.lastName}`,
            }))}
            onChange={(selectedOption) => handleChange("assignedResourceID", Number(selectedOption.value))}
            placeholder="Resource"
          />
        </div>
        <div>
          <ComboInput
            defaultValue={filters.status ? filters.status.toString() : ""}
            options={info.statuses.sort((a, b) => a.label.localeCompare(b.label)).map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            onChange={(selectedOption) => handleChange("status", Number(selectedOption.value))}
            placeholder="Status"
          />
        </div>
        <div>
          <ComboInput
            defaultValue={filters.priority ? filters.priority.toString() : ""}
            options={info.priorities.sort((a, b) => a.label.localeCompare(b.label)).map((priority) => ({
              value: priority.value,
              label: priority.label,
            }))}
            onChange={(selectedOption) => handleChange("priority", Number(selectedOption.value))}
            placeholder="Priority"
          />
        </div>
        <Button onClick={handleApply} disabled={loading}>
          {loading && <Loader width={20} height={20} className="mr-2 animate-spin" />}
          <span>Apply</span>
        </Button>
      </div>
      <div className="flex space-x-2 px-1 py-sm">
        <ComboInput
          defaultValue={views.find((view) => view.value === convertFiltersToURLParams(params))?.value || undefined}
          options={views}
          onChange={handleViewChange}
          placeholder="Views"
        />
      </div>
    </div>
  );
}

export default TicketViewFilters;