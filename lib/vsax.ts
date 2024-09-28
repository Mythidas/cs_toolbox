import { BaseClient } from "./utils";

const {
  NEXT_PUBLIC_VSAX_URL,
  NEXT_VSAX_USER_ID,
  NEXT_VSAX_SECRET,
} = process.env;

class VSAXClient extends BaseClient {
  private readonly BEARER_TOKEN = btoa(`${NEXT_VSAX_USER_ID}:${NEXT_VSAX_SECRET}`);

  constructor() {
    super("VSAX");
  }

  async getSites() {
    const siteList: VSAXSite[] = [];
    let totalCount = 1;

    try {
      while (siteList.length < totalCount) {
        const siteFetch = await fetch(`${NEXT_PUBLIC_VSAX_URL}/sites?$skip=${siteList.length}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${this.BEARER_TOKEN}`
          }
        });

        if (!siteFetch.ok) {
          this._throw(siteFetch.statusText);
        }

        const siteData = await siteFetch.json() as { Data: VSAXSite[], Meta: { TotalCount: number } };
        totalCount = siteData.Meta.TotalCount;

        siteList.push(...siteData.Data);

        if (siteList.length >= siteData.Meta.TotalCount) {
          break;
        }
      }

      return siteList.sort((a, b) => a.Name.localeCompare(b.Name));
    } catch (error) {
      this._throw(error);
      return [];
    }
  }

  async getSite(autoTaskSiteID: number): Promise<VSAXSite | null> {
    try {
      const siteFetch = await fetch(`${NEXT_PUBLIC_VSAX_URL}/sites?$filter=PsaMappingId eq ${autoTaskSiteID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${this.BEARER_TOKEN}`
        }
      });

      if (!siteFetch.ok) {
        this._throw(siteFetch.statusText);
      }

      const site = await siteFetch.json() as { Data: VSAXSite[] };
      const sophosTenantId = await this.getSiteSophosTenantId(site.Data[0].Id.toString());

      return { ...site.Data[0], sophosTenantId: sophosTenantId || undefined };
    } catch (error) {
      this._throw(error);
      return null;
    }
  }

  async getDevices(siteId: string) {
    try {
      const deviceFetch = await fetch(`${NEXT_PUBLIC_VSAX_URL}/assets?$filter=SiteId eq ${siteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${this.BEARER_TOKEN}`
        }
      });

      if (!deviceFetch.ok) {
        this._throw(deviceFetch.statusText);
      }

      const devices = await deviceFetch.json() as { Data: VSAXDevice[] };
      return devices.Data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getSiteSophosTenantId(siteId: string) {
    try {
      const siteFetch = await fetch(`${NEXT_PUBLIC_VSAX_URL}/sites/${siteId}/customfields?$filter=Id eq 504`, { // 504 is the custom field ID for Sophos Tenant ID
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${this.BEARER_TOKEN}`
        }
      });

      if (!siteFetch.ok) {
        this._throw(siteFetch.statusText);
      }

      const customFields = await siteFetch.json() as { Data: VSAXCustomField[] };
      return customFields?.Data[0].Value || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

interface VSAXCustomField {
  Id: number;
  Name: string;
  Value: string;
  Type: string;
}

export { VSAXClient };