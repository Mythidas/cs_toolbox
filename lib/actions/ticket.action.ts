// =============== Get Tickets ===============

import { AutoTaskClient } from "../autotask";

export async function getTickets() {
  try {
    const autotaskClient = new AutoTaskClient();
    const tickets = await autotaskClient.getOpenTickets();
    const companies = await autotaskClient.getActiveCompanies();
    const queues = await autotaskClient.getTicketQueues();
    const statuses = await autotaskClient.getTicketStatuses();
    const priorities = await autotaskClient.getTicketPriorities();
    const resources = [...(await autotaskClient.getResources()), { id: 0, firstName: "Unassigned", lastName: "" }] as AutoTaskResource[];
    return { tickets, companies, queues, statuses, priorities, resources };
  } catch (error) {
    console.error(error);
    return { tickets: [], companies: [], queues: [], statuses: [], priorities: [], resources: [] };
  }
}