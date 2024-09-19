import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import React from "react"
import { useRouter } from "next/navigation"

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  tag?: string;
  refreshInterval?: number;
}

export function DataTablePagination<TData>({
  table,
  tag,
  refreshInterval
}: DataTablePaginationProps<TData>) {
  const [refreshTimerCount, setRefreshTimerCount] = React.useState(refreshInterval || null);
  const router = useRouter();

  // Set the page size to 20 when the component mounts
  React.useEffect(() => {
    table.setPageSize(50)
  }, [])

  React.useEffect(() => {
    if (refreshTimerCount === null) {
      return;
    }

    const interval = setInterval(() => {
      setRefreshTimerCount(refreshTimerCount - 1000);

      if (refreshTimerCount <= 0) {
        router.refresh();
        setRefreshTimerCount(refreshInterval || 0);
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [refreshTimerCount])

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground space-x-6">
        <span>{table.getFilteredRowModel().rows.length} {tag || "row"}(s)</span>
        {refreshInterval && refreshTimerCount ? (
          <span>
            Refresh in {Math.floor(refreshTimerCount / 60000)}:{Math.floor((refreshTimerCount % 60000) / 1000).toString().padStart(2, '0')} minutes
          </span>
        ) : (
          <span>Refresh in 0:00 minutes</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{tag || "Row"}s per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
