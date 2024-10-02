import React from "react";
import TicketViewTable from "./TicketViewTable";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { getTicketInfo } from "@/lib/actions/ticket.action";

interface CompanyTicketViewProps extends URLParams {
  company: AutoTaskCompany;
}

const CompanyTicketView = async ({ searchParams, company }: CompanyTicketViewProps) => {
  const ticketParams: TicketParams = {
    includeCompleted: true,
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

  const ticketInfo = await getTicketInfo(ticketParams);
  ticketInfo.companies = [company];

  const resourceId = ticketInfo.resources.find((resource) => resource.email === loggedInUser?.user?.email)?.id || 0;
  const ticketViews = [{ label: "My Tickets", value: `?assignedResourceID=${resourceId}` }];

  return (
    <div className="flex flex-col h-[95%] size-full">
      <TicketViewTable info={{ ...ticketInfo, params: ticketParams, views: ticketViews }} />
    </div>
  )
}

export default CompanyTicketView;