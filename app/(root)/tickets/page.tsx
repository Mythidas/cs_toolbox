import TicketActions from "@/components/TicketActions";
import TicketView from "@/components/TicketView";
import TicketViewSkeleton from "@/components/TicketViewSkeleton";
import React from "react";

const Tickets = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  return (
    <div className="flex size-full justify-between space-x-2">
      <TicketActions />
      <div className="flex flex-col w-full h-full p-sm rounded-md border-[1px] border-border bg-card">
        <React.Suspense fallback={<TicketViewSkeleton />}>
          <TicketView searchParams={searchParams} />
        </React.Suspense>
      </div>
    </div>
  )
}

export default Tickets;