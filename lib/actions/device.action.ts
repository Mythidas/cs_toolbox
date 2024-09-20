import { VSAXClient } from "@/lib/vsax";
import { SophosClient } from "@/lib/sophos";

export async function getVSAXDevices(siteId: string) {
  try {
    const client = new VSAXClient();
    const devices = await client.getDevices(siteId);
    return devices;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSophosDevices(siteId: string) {
  try {
    const client = new SophosClient();
    const site = await client.getSite(siteId);
    if (!site) {
      return [];
    }

    const devices = await client.getDevices(site.id, site.apiHost);
    return devices;
  } catch (error) {
    console.error(error);
    return [];
  }
}