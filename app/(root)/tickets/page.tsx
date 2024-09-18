import TicketView from "@/components/TicketView";
import React from "react";

const Tickets = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  return (
    <div className="flex size-full justify-between space-x-2">
      <div className="w-12 bg-card rounded-md border-border border-[1px]">
        <div className="flex flex-col size-full items-center p-2">
          <p>A</p>
          <p>C</p>
          <p>T</p>
          <p>I</p>
          <p>O</p>
          <p>N</p>
          <p>S</p>
        </div>
      </div>
      <div className="flex flex-col w-full h-full p-sm rounded-md border-[1px] border-border bg-card">
        <React.Suspense fallback={<div>Loading...</div>}>
          <TicketView searchParams={searchParams} />
        </React.Suspense>
      </div>
    </div>
  )
}

export default Tickets;