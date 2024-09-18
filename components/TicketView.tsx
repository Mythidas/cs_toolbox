import { getTickets } from "@/lib/actions/ticket.action";
import React from "react";
import TicketViewTable from "./TicketViewTable";

const TicketView = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const ticketFetchParams: AutoTaskTicketFetchParams = {
    completed: (searchParams?.completed === "true"),
    ticketNumber: searchParams?.ticketNumber ? String(searchParams?.ticketNumber) : undefined,
    title: searchParams?.title ? String(searchParams?.title) : undefined,
    status: searchParams?.status ? (Array.isArray(searchParams.status) ? searchParams.status.map((_val) => Number(_val)) : [Number(searchParams.status)]) : undefined,
    companyID: searchParams?.companyID ? (Array.isArray(searchParams.companyID) ? searchParams.companyID.map((_val) => Number(_val)) : [Number(searchParams.companyID)]) : undefined,
    queueID: searchParams?.queueID ? (Array.isArray(searchParams.queueID) ? searchParams.queueID.map((_val) => Number(_val)) : [Number(searchParams.queueID)]) : undefined,
    assignedResourceID: searchParams?.assignedResourceID ? (Array.isArray(searchParams.assignedResourceID) ? searchParams.assignedResourceID.map((_val) => Number(_val)) : [Number(searchParams.assignedResourceID)]) : undefined,
    priority: searchParams?.priority ? (Array.isArray(searchParams.priority) ? searchParams.priority.map((_val) => Number(_val)) : [Number(searchParams.priority)]) : undefined,
  };

  const ticketInfo = await getTickets(ticketFetchParams);

  return (
    <div className="size-full">
      <TicketViewTable view={ticketInfo} />
    </div>
  )
}

export default TicketView;