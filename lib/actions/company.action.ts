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
    const sites = await client.getCompanies();
    return sites;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVSASite(autoTaskSiteID: number) {
  try {
    const client = new VSAXClient();
    const site = await client.getSite(autoTaskSiteID);
    return site;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompanyConfigurations(companyId: number) {
  try {
    const client = new AutoTaskClient();
    const configurations = await client.getCompanyConfigurations({
      Filter: [
        { field: "companyID", op: "eq", value: companyId },
      ],
    });
    return configurations;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompanyContacts(companyId: number) {
  try {
    const client = new AutoTaskClient();
    const contacts = await client.getContacts({
      Filter: [
        { field: "companyID", op: "eq", value: companyId },
      ],
    });
    return contacts;
  } catch (error) {
    console.error(error);
    return null;
  }
}