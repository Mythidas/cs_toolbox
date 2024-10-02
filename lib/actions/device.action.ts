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

export async function getDevices(autoTaskSiteID: number) {
  try {
    const vsaClient = new VSAXClient();
    const vsaSite = await vsaClient.getSite(autoTaskSiteID);
    if (!vsaSite) {
      return [];
    }

    const vsaDevices = await vsaClient.getDevices(vsaSite?.Id.toString());

    const sophosClient = new SophosClient();
    const sophoSite = await sophosClient.getSite(vsaSite.sophosTenantId || "");
    const sophosDevices = await sophosClient.getDevices(sophoSite?.id, sophoSite?.apiHost);

    const devices: { sophos?: SophosDevice, vsax?: VSAXDevice }[] = [];

    for (const host of vsaDevices) {
      const unique: { sophos?: SophosDevice, vsax?: VSAXDevice } = { vsax: host };

      for (const ip of host.LocalIpAddresses) {
        const matchingSophosDevice = sophosDevices.find(sophosDevice =>
          sophosDevice.macAddresses.map(mac => mac.replace(/:/g, '')).includes(ip.PhysicalAddress.replace(/:/g, ''))
        );
        if (matchingSophosDevice) {
          unique.sophos = matchingSophosDevice;
          break;
        }
      }
      devices.push(unique);
    }

    for (const sophosDevice of sophosDevices) {
      const isDeviceAlreadyAdded = devices.some(device => device.sophos?.id === sophosDevice.id);
      if (!isDeviceAlreadyAdded) {
        devices.push({ sophos: sophosDevice });
      }
    }

    return devices;
  } catch (error) {
    console.error(error);
    return [];
  }
}