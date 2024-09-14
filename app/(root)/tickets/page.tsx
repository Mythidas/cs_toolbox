import TicketView from "@/components/TicketView";
import { getAutoTaskSites } from "@/lib/actions/site.action";
import { getTickets } from "@/lib/actions/ticket.action";
import React from "react";

const Tickets = async () => {
  const ticketInfo = await getTickets();

  return (
    <div className="flex size-full justify-between space-x-2">
      <div className="flex flex-col w-full h-full p-sm rounded-md border-[1px] border-border bg-card">
        <TicketView tickets={ticketInfo?.tickets} companies={ticketInfo.companies} queues={ticketInfo.queues} />
      </div>
      <div className="w-24 bg-card rounded-md border-border border-[1px]">
        <div className="flex flex-col size-full items-center p-2">
          <p>S</p>
          <p>S</p>
          <p>S</p>
          <p>S</p>
          <p>S</p>
        </div>
      </div>
    </div>
  )
}

export default Tickets;