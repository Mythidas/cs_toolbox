"use server";

import { AutoTaskClient } from "../autotask";
import { VSAXClient } from "../vsax";

// =============== Get Sites ===============

export async function getVSASites() {
  try {
    const client = new VSAXClient();
    const sites = await client.getSites();
    return sites;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAutoTaskSites() {
  try {
    const client = new AutoTaskClient();
    const sites = await client.getActiveCompanies();
    return sites;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVSASite(siteId: string) {
  try {
    const client = new VSAXClient();
    const site = await client.getSite(siteId);
    return site;
  } catch (error) {
    console.error(error);
    return null;
  }
}