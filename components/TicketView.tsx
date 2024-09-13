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
}

const TicketView = ({ tickets, companies }: TicketViewProps) => {
  const columns: ColumnDef<AutoTaskTicket>[] = [
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