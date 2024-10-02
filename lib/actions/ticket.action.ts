import { AutoTaskAPIFilter, AutoTaskClient } from "../autotask";

export async function getTickets(params: TicketParams): Promise<AutoTaskTicket[]> {
  try {
    const autotaskClient = new AutoTaskClient();

    const completeStatusID = await autotaskClient.getTicketFieldValue("status", "Complete");
    if (!completeStatusID) {
      throw new Error("[Ticket.Actions.getTickets] Complete status not found");
    }

    const apiFilter: AutoTaskAPIFilter<AutoTaskTicket> = {
      Filter: [],
      MaxRecords: 500,
      IncludeFields: [
        "id",
        "ticketNumber",
        "title",
        "companyID",
        "queueID",
        "status",
        "priority",
        "assignedResourceID",
        "lastActivityDate",
        "companyLocationID",
        "createDate"
      ]
    };

    if (params.includeCompleted) {
      if (params.status) {
        apiFilter.Filter.push({ field: "status", op: "in", value: [...params?.status || []] });
      }
    } else {
      if (params.status) {
        apiFilter.Filter.push({ field: "status", op: "in", value: [...params?.status || []] });
      } else {
        apiFilter.Filter.push({ field: "status", op: "noteq", value: Number(completeStatusID) });
      }
    }

    for (const [key, value] of Object.entries(params)) {
      if (key === "completed" || key === "status" || typeof value === "boolean" || !value) {
        continue;
      }

      if (key === "lastActivityDate") {
        const dateValue = (value as Date).toISOString().split('T')[0];
        const nextDateValue = new Date(dateValue);
        nextDateValue.setDate(nextDateValue.getDate() + 1);
        const nextDateString = nextDateValue.toISOString().split('T')[0];
        apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "lt", value: nextDateString });
        apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "gte", value: dateValue });
        continue;
      }

      if (key === "ticketNumber" || key === "title") {
        apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "contains", value: value as string });
        continue;
      }

      apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "in", value: value as number[] });
    }

    return await autotaskClient.getTickets(apiFilter);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getTicketInfo(params: TicketParams) {
  try {
    const autotaskClient = new AutoTaskClient();
    const tickets = await getTickets(params);
    const locations = await autotaskClient.getCompanyLocations({ Filter: [{ field: "companyID", op: "in", value: tickets.map((ticket) => ticket.companyID) }] });
    const resources = await autotaskClient.getResources();
    const companies = await autotaskClient.getCompanies();

    const ticketFields = await autotaskClient.getTicketFields();
    const queues = ticketFields.find(field => field.name === "queueID")?.picklistValues.filter(value => value.isActive) || [];
    const statuses = ticketFields.find(field => field.name === "status")?.picklistValues.filter(value => value.isActive) || [];
    const priorities = ticketFields.find(field => field.name === "priority")?.picklistValues.filter(value => value.isActive) || [];

    return { tickets, resources, locations, companies, queues, statuses, priorities };
  } catch (error) {
    console.error(error);
    return { tickets: [], resources: [], locations: [], companies: [], queues: [], statuses: [], priorities: [] };
  }
}