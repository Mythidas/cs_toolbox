"use server";

import { VSAXClient } from "../vsax";

// =============== Get Sites ===============

export async function getSites() {
  try {
    const client = new VSAXClient();
    const sites = await client.getSites();
    return sites;
  } catch (error) {
    console.error(error);
    return [];
  }
}