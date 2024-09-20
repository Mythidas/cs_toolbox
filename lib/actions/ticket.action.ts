// =============== Get Tickets ===============

import { AutoTaskClient } from "../autotask";
import { Timer } from "../utils";

export async function getTickets(params: AutoTaskTicketFetchParams) {
  try {
    const autotaskClient = new AutoTaskClient();
    const timer = new Timer();

    const tickets = await autotaskClient.getTickets(params);
    autotaskClient._log(`Tickets: ${tickets.length} [${timer.elapsedSeconds}s]`);
    timer.reset();

    const companies = await autotaskClient.getActiveCompanies();
    autotaskClient._log(`Companies: ${companies.length} [${timer.elapsedSeconds}s]`);
    timer.reset();

    const filterFields = await autotaskClient.getTicketFilterFields();
    autotaskClient._log(`Queues: ${filterFields.queues.length}, Statuses: ${filterFields.statuses.length}, Priorities: ${filterFields.priorities.length} [${timer.elapsedSeconds}s]`);
    timer.reset();

    const resources = [...(await autotaskClient.getResources()), { id: 0, firstName: "Unassigned", lastName: "" }] as AutoTaskResource[];
    autotaskClient._log(`Resources: ${resources.length} [${timer.elapsedSeconds}s]`);

    return { tickets, companies, ...filterFields, resources };
  } catch (error) {
    console.error(error);
    return { tickets: [], companies: [], queues: [], statuses: [], priorities: [], resources: [] };
  }
}

export async function getTicketResources() {
  try {
    const autotaskClient = new AutoTaskClient();
    return await autotaskClient.getResources();
  } catch (error) {
    console.error(error);
    return [];
  }
}