import { BaseClient } from "@/lib/utils";

const {
  NEXT_PUBLIC_SOPHOS_URL,
  NEXT_SOPHOS_ID,
  NEXT_SOPHOS_SECRET,
} = process.env;

export class SophosClient extends BaseClient {
  constructor() {
    super("Sophos");
  }

  async getSite(siteId: string) {
    try {
      const bearerToken = await this.getBearerToken();
      if (!bearerToken) {
        this._throw("Failed to get bearer token");
      }

      const partnerId = await this.getPartnerId(bearerToken);
      if (!partnerId) {
        this._throw("Failed to get partner ID");
      }

      const siteFetch = await fetch(`https://api.central.sophos.com/partner/v1/tenants/${siteId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "X-Partner-ID": partnerId,
        },
      });

      if (!siteFetch.ok) {
        this._throw(`Failed to fetch site: ${siteFetch.statusText}`);
      }

      const { name, id, apiHost } = await siteFetch.json();
      return { name, id, apiHost };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getDevices(siteId: string, siteUrl: string) {
    try {
      const bearerToken = await this.getBearerToken();
      if (!bearerToken) {
        this._throw("Failed to get bearer token");
      }

      const deviceFetch = await fetch(`${siteUrl}/endpoint/v1/endpoints`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "X-Tenant-ID": siteId,
        },
      });

      if (!deviceFetch.ok) {
        this._throw(`Failed to fetch devices: ${deviceFetch.statusText}`);
      }

      const { items } = await deviceFetch.json() as { items: SophosDevice[] };
      return items;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getBearerToken() {
    try {
      const response = await fetch(`${NEXT_PUBLIC_SOPHOS_URL}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: NEXT_SOPHOS_ID!,
          client_secret: NEXT_SOPHOS_SECRET!,
          scope: "token",
        }),
      });

      if (!response.ok) {
        this._throw(`Failed to get bearer token: ${response.statusText}`);
      }

      const { access_token } = await response.json();
      return access_token
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async getPartnerId(bearerToken: string) {
    try {
      const partnerIdFetch = await fetch("https://api.central.sophos.com/whoami/v1", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (!partnerIdFetch.ok) {
        this._throw(`Failed to get partner ID: ${partnerIdFetch.statusText}`);
      }

      const { id } = await partnerIdFetch.json();
      return id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}