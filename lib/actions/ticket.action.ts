// =============== Get Tickets ===============

import { AutoTaskClient } from "../autotask";

export async function getTickets() {
  try {
    const autotaskClient = new AutoTaskClient();
    const tickets = await autotaskClient.getOpenTickets();
    const companies = await autotaskClient.getActiveCompanies();
    const queues = await autotaskClient.getTicketQueues();
    return { tickets, companies, queues };
  } catch (error) {
    console.error(error);
    return { tickets: [], companies: [], queues: [] };
  }
}