const {
  NEXT_PUBLIC_VSAX_URL,
  VSAX_USER_ID,
  VSAX_SECRET,
} = process.env;

interface VSAXSite {
  Id: number;
  Name: string;
  ParentId: number;
  ParentName: string;
  PsaMappingId: number;
  PsaIntegrationType: string;
  HasCustomFields: boolean;
}

interface VSAXCustomField {
  Id: number;
  Name: string;
  Value: string;
  Type: string;
}

class VSAXClient {
  private readonly BEARER_TOKEN = btoa(`${VSAX_USER_ID}:${VSAX_SECRET}`);

  async getSites() {
    let siteList: Site[] = [];
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

        siteList.push(...siteData.Data.map(_site => ({
          name: _site.Name,
          parentName: _site.ParentName,
          vsaId: _site.Id,
          parentVSAId: _site.ParentId,
          autoTaskId: _site.PsaMappingId,
          sophosTenantId: "",
        })));

        if (siteList.length >= siteData.Meta.TotalCount) {
          break;
        }
      }

      return siteList.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      this._throw(error);
      return [];
    }
  }

  private _throw(error: any) {
    throw new Error(`[VSAX] ${error}`);
  }
}

export { VSAXClient };