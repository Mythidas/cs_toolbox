import { getTicketCompanyLocations, getTickets } from "@/lib/actions/ticket.action";
import React from "react";
import TicketViewTable from "./TicketViewTable";
import TicketViewFilters from "./TicketViewFilters";
import { getLoggedInUser } from "@/lib/actions/user.action";

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
  const ticketLocations = await getTicketCompanyLocations(ticketInfo.tickets);
  const loggedInUser = await getLoggedInUser();
  //const userDocument = await getUserDocument(loggedInUser?.$id!);
  const resourceId = ticketInfo.resources.find((resource) => resource.email === loggedInUser?.email)?.id || 0;
  const ticketViews = [{ label: "My Tickets", value: `?completed=false&assignedResourceID=${resourceId}` }];

  const tickets = { ...ticketInfo, locations: ticketLocations };

  return (
    <div className="flex flex-col size-full">
      <TicketViewFilters info={tickets} params={ticketFetchParams} views={ticketViews} />
      <TicketViewTable view={tickets} />
    </div>
  )
}

export default TicketView;