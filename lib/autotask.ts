import { BaseClient, Timer } from "./utils";

const {
  NEXT_PUBLIC_AUTOTASK_URL,
  NEXT_PUBLIC_AUTOTASK_TRACKER,
  NEXT_AUTOTASK_USER_ID,
  NEXT_AUTOTASK_SECRET,
} = process.env;

export class AutoTaskClient extends BaseClient {
  constructor() {
    super("AutoTask");
  }

  // =============== Tickets ===============

  async getTickets(filters: AutoTaskAPIFilter<AutoTaskTicket>) {
    try {
      const timer = new Timer();

      const ticketFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/query`, {
        method: "POST",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filters),
        cache: "no-cache"
      });

      if (!ticketFetch.ok) {
        this._throw(ticketFetch.statusText);
      }

      const ticketData = await ticketFetch.json();

      this._log(`Tickets: ${ticketData.items.length} [${timer.elapsedSeconds}s]`);
      return ticketData.items as AutoTaskTicket[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTicketFieldValue(field: keyof AutoTaskTicket, label: string) {
    try {
      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!ticketInfoFetch.ok) {
        this._throw(ticketInfoFetch.statusText);
      }

      const ticketInfoData = await ticketInfoFetch.json() as { fields: AutoTaskFieldInfo[] };

      const fieldInfo = ticketInfoData.fields.find(fieldInfo => fieldInfo.name === field);
      const fieldValue = fieldInfo?.picklistValues.find(value => value.label === label);
      return fieldValue?.value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getTicketFieldValues(field: keyof AutoTaskTicket) {
    try {
      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!ticketInfoFetch.ok) {
        this._throw(ticketInfoFetch.statusText);
      }

      const ticketInfoData = await ticketInfoFetch.json() as { fields: AutoTaskFieldInfo[] };
      const fieldInfo = ticketInfoData.fields.find(fieldInfo => fieldInfo.name === field);
      return fieldInfo?.picklistValues.filter(value => value.isActive) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTicketFields() {
    try {
      const timer = new Timer();

      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!ticketInfoFetch.ok) {
        this._throw(ticketInfoFetch.statusText);
      }

      const ticketInfoData = await ticketInfoFetch.json() as { fields: AutoTaskFieldInfo[] };

      this._log(`Fields: ${ticketInfoData.fields.length} [${timer.elapsedSeconds}s]`);
      return ticketInfoData.fields;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // =============== Resources ===============

  async getResources(filters: AutoTaskAPIFilter<AutoTaskResource> = {
    Filter: [
      { field: "isActive", op: "eq", value: "true" },
      { field: "licenseType", op: "in", value: [1, 3] } // 1 = Full, 3 = Limited, 7 = API User
    ]
  }) {
    try {
      const timer = new Timer();

      const resourceFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Resources/query?search=${JSON.stringify(filters)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!resourceFetch.ok) {
        this._throw(resourceFetch.statusText);
      }


      const resourceData = await resourceFetch.json();

      this._log(`Resources: ${resourceData.items.length} [${timer.elapsedSeconds}s]`);
      return resourceData.items as AutoTaskResource[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // =============== Companies ===============

  async getCompanies(filters: AutoTaskAPIFilter<AutoTaskCompany> = {
    Filter: [
      { field: "isActive", op: "eq", value: "true" },
      { field: "companyType", op: "eq", value: "1" },
    ]
  }) {
    try {
      const timer = new Timer();

      const companyFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/query?search=${JSON.stringify(filters)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        cache: "force-cache",
      });

      if (!companyFetch.ok) {
        this._throw(companyFetch.statusText);
      }

      const companyData = await companyFetch.json();

      this._log(`Companies: ${companyData.items.length} [${timer.elapsedSeconds}s]`);
      return companyData.items as AutoTaskCompany[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCompanyLocations(filters: AutoTaskAPIFilter<AutoTaskCompanyLocation>) {
    try {
      const timer = new Timer();

      const companyLocationFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/CompanyLocations/query?search=${JSON.stringify(filters)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        cache: "force-cache",
      });

      if (!companyLocationFetch.ok) {
        this._throw(companyLocationFetch.statusText);
      }

      const companyLocationData = await companyLocationFetch.json();

      this._log(`Company Locations: ${companyLocationData.items.length} [${timer.elapsedSeconds}s]`);
      return companyLocationData.items as AutoTaskCompanyLocation[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCompanyConfigurations(filters: AutoTaskAPIFilter<AutoTaskCompanyConfigurations>) {
    try {
      const timer = new Timer();

      const companyConfigurationsFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/CompanySiteConfigurations/query?search=${JSON.stringify(filters)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        cache: "force-cache",
      });

      if (!companyConfigurationsFetch.ok) {
        this._throw(companyConfigurationsFetch.statusText);
      }

      const companyConfigurationData = await companyConfigurationsFetch.json();

      this._log(`Company Configurations: ${companyConfigurationData.items.length} [${timer.elapsedSeconds}s]`);
      return companyConfigurationData.items[0] as AutoTaskCompanyConfigurations;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // =============== Contacts ===============

  async getContacts(filters: AutoTaskAPIFilter<AutoTaskContact>) {
    try {
      const timer = new Timer();

      const contactsFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Contacts/query?search=${JSON.stringify(filters)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        cache: "force-cache",
      });

      if (!contactsFetch.ok) {
        this._throw(contactsFetch.statusText);
      }

      const contactsData = await contactsFetch.json();

      this._log(`Contacts: ${contactsData.items.length} [${timer.elapsedSeconds}s]`);
      return contactsData.items as AutoTaskContact[];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // =============== Helpers ===============

  async getTicketFiltersFromParams(params: TicketParams): Promise<AutoTaskAPIFilter<AutoTaskTicket>> {
    try {
      const completeStatusID = await this.getTicketFieldValue("status", "Complete");
      if (!completeStatusID) {
        this._throw("Complete status not found");
        return { Filter: [] };
      }

      const apiFilter: AutoTaskAPIFilter<AutoTaskTicket> = {
        Filter: [],
        MaxRecords: 500,
        IncludeFields: [
          "id",
          "ticketNumber",
          "title",
          "companyID",
          "queueID",
          "status",
          "priority",
          "assignedResourceID",
          "lastActivityDate",
          "companyLocationID"
        ]
      };

      if (params.completed) {
        if (params.status) {
          apiFilter.Filter.push({ field: "status", op: "in", value: [...params.status, Number(completeStatusID)] });
        } else {
          apiFilter.Filter.push({ field: "status", op: "eq", value: Number(completeStatusID) });
        }
      } else {
        if (params.status) {
          apiFilter.Filter.push({ field: "status", op: "in", value: params.status });
        } else {
          apiFilter.Filter.push({ field: "status", op: "noteq", value: Number(completeStatusID) });
        }
      }

      for (const [key, value] of Object.entries(params)) {
        if (key === "completed" || key === "status" || typeof value === "boolean" || !value) {
          continue;
        }

        if (key === "lastActivityDate") {
          const dateValue = (value as Date).toISOString().split('T')[0];
          const nextDateValue = new Date(dateValue);
          nextDateValue.setDate(nextDateValue.getDate() + 1);
          const nextDateString = nextDateValue.toISOString().split('T')[0];
          apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "lt", value: nextDateString });
          apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "gte", value: dateValue });
          continue;
        }

        if (key === "ticketNumber" || key === "title") {
          apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "contains", value: value as string });
          continue;
        }

        apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "in", value: value as number[] });
      }

      return apiFilter;
    } catch (error) {
      console.log(error);
      return { Filter: [] };
    }
  }

  async getCompanyFieldValue(field: string, label: string) {
    try {
      const companyInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!companyInfoFetch.ok) {
        this._throw(companyInfoFetch.statusText);
      }

      const companyInfoData = await companyInfoFetch.json() as { fields: AutoTaskFieldInfo[] };

      const fieldInfo = companyInfoData.fields.find(fieldInfo => fieldInfo.name === field);
      const fieldValue = fieldInfo?.picklistValues.find(value => value.label === label);
      return fieldValue?.value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

interface AutoTaskAPIFilter<T> {
  Filter: {
    field: keyof T;
    op: "eq" | "noteq" | "gt" | "gte" | "lt" | "lte" | "beginsWith" | "endsWith" | "contains" | "exist" | "notExist" | "in" | "notIn";
    value: string | number | string[] | number[];
  }[];
  MaxRecords?: number;
  IncludeFields?: (keyof T)[];
}