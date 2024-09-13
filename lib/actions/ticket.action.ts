// =============== Get Tickets ===============

import { AutoTaskClient } from "../autotask";

export async function getTickets() {
  try {
    const autotaskClient = new AutoTaskClient();
    const tickets = await autotaskClient.getOpenTickets();
    return tickets;
  } catch (error) {
    console.error(error);
    return [];
  }
}