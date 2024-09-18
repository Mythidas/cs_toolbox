"use client";

import { Table } from "@tanstack/react-table";
import React from "react";
import { Input } from "./ui/input";
import ComboInput from "./ComboInput";
import { type TicketViewProps } from "./TicketViewTable";

interface TicketViewFiltersProps {
  view: TicketViewProps;
  table: Table<AutoTaskTicket>;
}

const TicketViewFilters = ({ view, table }: TicketViewFiltersProps) => {
  function handleChange(column: keyof AutoTaskTicket, value: string | number | null) {
    console.log(column, value);

    if (value === table.getColumn(column)?.getFilterValue()) {
      table.getColumn(column)?.setFilterValue(undefined);
      return;
    }

    table.getColumn(column)?.setFilterValue(value);
  }

  return (
    <div className="flex w-full h-fit py-sm p-1 items-center space-x-2 overflow-x-auto">
      <Input
        placeholder="Search Ticket Number..."
        value={(table.getColumn("ticketNumber")?.getFilterValue() as string) ?? ""}
        onChange={(event) => handleChange("ticketNumber", event.target.value)}
        className="w-fit max-w-xs"
      />
      <Input
        placeholder="Search Title..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) => handleChange("title", event.target.value)}
        className="max-w-xl min-w-fit"
      />
      <div>
        <ComboInput
          options={view.companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => ({
            value: company.id.toString(),
            label: company.companyName,
          }))}
          onChange={(selectedOption) => handleChange("companyID", Number(selectedOption.value))}
          placeholder="Company"
        />
      </div>
      <div>
        <ComboInput
          options={view.queues.sort((a, b) => a.label.localeCompare(b.label)).map((_queue) => ({
            value: _queue.value,
            label: `${_queue.label} (${view.tickets.filter(ticket => ticket.queueID === Number(_queue.value)).length})`,
          }))}
          onChange={(selectedOption) => handleChange("queueID", Number(selectedOption.value))}
          placeholder="queue"
        />
      </div>
      <div>
        <ComboInput
          options={view.resources.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)).map((resource) => ({
            value: resource.id.toString(),
            label: `${resource.firstName} ${resource.lastName}`,
          }))}
          onChange={(selectedOption) => handleChange("assignedResourceID", Number(selectedOption.value))}
          placeholder="Resource"
        />
      </div>
      <div>
        <ComboInput
          options={view.statuses.sort((a, b) => a.label.localeCompare(b.label)).map((status) => ({
            value: status.value,
            label: status.label,
          }))}
          onChange={(selectedOption) => handleChange("status", Number(selectedOption.value))}
          placeholder="Status"
        />
      </div>
      <div>
        <ComboInput
          options={view.priorities.sort((a, b) => a.label.localeCompare(b.label)).map((priority) => ({
            value: priority.value,
            label: priority.label,
          }))}
          onChange={(selectedOption) => handleChange("priority", Number(selectedOption.value))}
          placeholder="Priority"
        />
      </div>
    </div>
  );
}

export default TicketViewFilters;