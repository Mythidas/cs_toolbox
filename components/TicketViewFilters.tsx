"use client";

import { Table } from "@tanstack/react-table";
import React from "react";
import { Input } from "./ui/input";
import ComboInput from "./ComboInput";
import { type TicketViewProps } from "./TicketView";

interface TicketViewFiltersProps {
  view: TicketViewProps;
  table: Table<AutoTaskTicket>;
}

const TicketViewFilters = ({ view, table }: TicketViewFiltersProps) => {
  return (
    <div className="flex w-full h-fit py-sm p-1 items-center space-x-2 overflow-x-auto">
      <Input
        placeholder="Search Ticket Number..."
        value={(table.getColumn("ticketNumber")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("ticketNumber")?.setFilterValue(event.target.value)
        }
        className="w-fit max-w-xs"
      />
      <Input
        placeholder="Search Title..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="max-w-xl min-w-fit"
      />
      <div>
        <ComboInput
          options={view.companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => ({
            value: company.id.toString(),
            label: company.companyName,
          }))}
          onChange={(selectedOption) => {
            if (Number(selectedOption.value) === table.getColumn("companyID")?.getFilterValue()) {
              table.getColumn("companyID")?.setFilterValue(undefined);
              return;
            }

            table.getColumn("companyID")?.setFilterValue(Number(selectedOption.value));
          }}
          placeholder="Company"
        />
      </div>
      <div>
        <ComboInput
          options={view.queues.sort((a, b) => a.label.localeCompare(b.label)).map((_queue) => ({
            value: _queue.value,
            label: `${_queue.label} (${view.tickets.filter(ticket => ticket.queueID === Number(_queue.value)).length})`,
          }))}
          onChange={(selectedOption) => {
            if (Number(selectedOption.value) === table.getColumn("queueID")?.getFilterValue()) {
              table.getColumn("queueID")?.setFilterValue(undefined);
              return;
            }

            table.getColumn("queueID")?.setFilterValue(Number(selectedOption.value));
            console.log(selectedOption.value);
          }}
          placeholder="queue"
        />
      </div>
      <div>
        <ComboInput
          options={view.resources.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)).map((resource) => ({
            value: resource.id.toString(),
            label: `${resource.firstName} ${resource.lastName}`,
          }))}
          onChange={(selectedOption) => {
            if (Number(selectedOption.value) === table.getColumn("assignedResourceID")?.getFilterValue()) {
              table.getColumn("assignedResourceID")?.setFilterValue(undefined);
              return;
            }

            table.getColumn("assignedResourceID")?.setFilterValue(Number(selectedOption.value) === 0 ? null : Number(selectedOption.value));
          }}
          placeholder="Resource"
        />
      </div>
      <div>
        <ComboInput
          options={view.statuses.sort((a, b) => a.label.localeCompare(b.label)).map((status) => ({
            value: status.value,
            label: status.label,
          }))}
          onChange={(selectedOption) => {
            if (Number(selectedOption.value) === table.getColumn("status")?.getFilterValue()) {
              table.getColumn("status")?.setFilterValue(undefined);
              return;
            }

            table.getColumn("status")?.setFilterValue(Number(selectedOption.value));
          }}
          placeholder="Status"
        />
      </div>
      <div>
        <ComboInput
          options={view.priorities.sort((a, b) => a.label.localeCompare(b.label)).map((priority) => ({
            value: priority.value,
            label: priority.label,
          }))}
          onChange={(selectedOption) => {
            if (Number(selectedOption.value) === table.getColumn("priority")?.getFilterValue()) {
              table.getColumn("priority")?.setFilterValue(undefined);
              return;
            }

            table.getColumn("priority")?.setFilterValue(Number(selectedOption.value));
          }}
          placeholder="Priority"
        />
      </div>
    </div>
  );
}

export default TicketViewFilters;