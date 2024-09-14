"use client";

import React from "react";
import { ColumnDef, Table } from "@tanstack/react-table"
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Input } from "./ui/input";
import ComboInput from "./ComboInput";

interface TicketViewProps {
  tickets: AutoTaskTicket[];
  companies: AutoTaskCompany[];
  queues: AutoTaskFieldValue[];
}

const TicketView = ({ tickets, companies, queues }: TicketViewProps) => {
  const columns: ColumnDef<AutoTaskTicket>[] = [
    {
      accessorKey: "ticketNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ticket Number" />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: "companyID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {companies.find((company) => company.id === row.original.companyID)?.companyName}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const companyA = companies.find((company) => company.id === a.original.companyID);
        const companyB = companies.find((company) => company.id === b.original.companyID);
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
            {queues.find((queue) => Number(queue.value) === row.original.queueID)?.label}
          </div>
        )
      },
      sortingFn: (a, b) => {
        const queueA = queues.find((queue) => Number(queue.value) === a.original.queueID);
        const queueB = queues.find((queue) => Number(queue.value) === b.original.queueID);
        if (queueA && queueB) {
          return queueA.label.localeCompare(queueB.label);
        }
        return 0;
      },
      filterFn: (rows, id, value) => {
        return rows.original.queueID === value;
      }
    }
  ];

  const TicketViewFilters = (table: Table<AutoTaskTicket>) => {
    return (
      <div className="flex w-full items-center space-x-2">
        <Input
          placeholder="Search Title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div>
          <ComboInput
            options={companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => ({
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
            options={queues.sort((a, b) => a.label.localeCompare(b.label)).map((_queue) => ({
              value: _queue.value,
              label: `${_queue.label} (${tickets.filter(ticket => ticket.queueID === Number(_queue.value)).length})`,
            }))}
            onChange={(selectedOption) => {
              if (Number(selectedOption.value) === table.getColumn("queueID")?.getFilterValue()) {
                table.getColumn("queueID")?.setFilterValue(undefined);
                return;
              }

              table.getColumn("queueID")?.setFilterValue(Number(selectedOption.value));
              console.log(selectedOption.value);
            }}
            placeholder="Company"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      <DataTable data={tickets} columns={columns} renderFilter={TicketViewFilters} />
    </div>
  )
}

export default TicketView;