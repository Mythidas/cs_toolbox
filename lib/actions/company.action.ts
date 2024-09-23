"use server";

import { AutoTaskClient } from "../autotask";
import { VSAXClient } from "../vsax";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_COMPANY_COLLECTION,
} = process.env;

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

export async function getCompanyConfigurations(companyId: number) {
  try {
    const client = new AutoTaskClient();
    const configurations = await client.getCompanyConfigurations(companyId);
    return configurations;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompanyContacts(companyId: number) {
  try {
    const client = new AutoTaskClient();
    const contacts = await client.getContacts(companyId);
    return contacts;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ================= DATABASE =================

export async function generateCompanyDocuments() {
  try {
    const { database } = await createAdminClient();
    const companies = await getAutoTaskSites();

    for await (const comp of companies) {
      const companyDocument = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_COMPANY_COLLECTION!, [Query.equal("autotaskId", comp.id.toString())]);
      if (companyDocument.documents.length > 0) {
        continue;
      }

      await database.createDocument(APPWRITE_DATABASE_ID!, APPWRITE_COMPANY_COLLECTION!, ID.unique(), {
        autotaskId: comp.id.toString(),
      });
    }

    return "Complete";
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCompanyDocument(id: string) {
  try {
    const { database } = await createAdminClient();
    const companyDocument = await database.getDocument(APPWRITE_DATABASE_ID!, APPWRITE_COMPANY_COLLECTION!, id);
    return companyDocument;
  } catch (error) {
    console.error(error);
    return null;
  }
}