import React from "react";
import TicketViewTable from "./TicketViewTable";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { AutoTaskClient } from "@/lib/autotask";

const TicketView = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const ticketParams: TicketParams = {
    completed: (searchParams?.completed === "true"),
    ticketNumber: searchParams?.ticketNumber ? String(searchParams?.ticketNumber) : undefined,
    title: searchParams?.title ? String(searchParams?.title) : undefined,
    status: searchParams?.status ? (Array.isArray(searchParams.status) ? searchParams.status.map((_val) => Number(_val)) : [Number(searchParams.status)]) : undefined,
    companyID: searchParams?.companyID ? (Array.isArray(searchParams.companyID) ? searchParams.companyID.map((_val) => Number(_val)) : [Number(searchParams.companyID)]) : undefined,
    queueID: searchParams?.queueID ? (Array.isArray(searchParams.queueID) ? searchParams.queueID.map((_val) => Number(_val)) : [Number(searchParams.queueID)]) : undefined,
    assignedResourceID: searchParams?.assignedResourceID ? (Array.isArray(searchParams.assignedResourceID) ? searchParams.assignedResourceID.map((_val) => Number(_val)) : [Number(searchParams.assignedResourceID)]) : undefined,
    priority: searchParams?.priority ? (Array.isArray(searchParams.priority) ? searchParams.priority.map((_val) => Number(_val)) : [Number(searchParams.priority)]) : undefined,
    lastActivityDate: searchParams?.lastActivityDate ? new Date(searchParams.lastActivityDate as string) : undefined,
  };

  const loggedInUser = await getLoggedInUser();
  //const userDocument = await getUserDocument(loggedInUser?.$id!);

  const autotaskClient = new AutoTaskClient();
  const tickets = await autotaskClient.getTickets(await autotaskClient.getTicketFiltersFromParams(ticketParams));
  const locations = await autotaskClient.getCompanyLocations({ Filter: [{ field: "companyID", op: "in", value: tickets.map((ticket) => ticket.companyID) }] });
  const resources = await autotaskClient.getResources();
  const companies = await autotaskClient.getCompanies();

  const ticketFields = await autotaskClient.getTicketFields();
  const queues = ticketFields.find(field => field.name === "queueID")?.picklistValues.filter(value => value.isActive) || [];
  const statuses = ticketFields.find(field => field.name === "status")?.picklistValues.filter(value => value.isActive) || [];
  const priorities = ticketFields.find(field => field.name === "priority")?.picklistValues.filter(value => value.isActive) || [];

  const ticketInfo = { tickets, resources, locations, companies, queues, statuses, priorities };

  const resourceId = resources.find((resource) => resource.email === loggedInUser?.email)?.id || 0;
  const ticketViews = [{ label: "My Tickets", value: `?completed=false&assignedResourceID=${resourceId}` }];

  return (
    <div className="flex flex-col size-full">
      <TicketViewTable info={{ ...ticketInfo, params: ticketParams, views: ticketViews }} />
    </div>
  )
}

export default TicketView;