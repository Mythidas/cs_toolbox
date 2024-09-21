import { BaseClient } from "./utils";

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

  async getTickets(params: AutoTaskTicketFetchParams) {
    try {
      const completeStatusID = await this.getTicketFieldValue("status", "Complete");
      if (!completeStatusID) {
        this._throw("Complete status not found");
        return [];
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
        if (key === "completed" || key === "status" || typeof value === "boolean") {
          continue;
        }

        if (key === "ticketNumber" || key === "title") {
          apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "contains", value: value });
          continue;
        }

        if (value) {
          apiFilter.Filter.push({ field: key as keyof AutoTaskTicket, op: "in", value: value });
        }
      }


      const ticketFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/query`, {
        method: "POST",
        headers: {
          "APIIntegrationcode": NEXT_PUBLIC_AUTOTASK_TRACKER!,
          "UserName": NEXT_AUTOTASK_USER_ID!,
          "Secret": NEXT_AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiFilter),
        cache: "no-cache"
      });

      if (!ticketFetch.ok) {
        this._throw(ticketFetch.statusText);
      }

      const ticketData = await ticketFetch.json();
      return ticketData.items as AutoTaskTicket[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTicketFilterFields() {
    try {
      const fields = await this.getTicketFields();
      if (!fields) {
        this._throw("Ticket fields not found");
      }

      const queues = fields.find(field => field.name === "queueID")?.picklistValues.filter(value => value.isActive) || [];
      const statuses = fields.find(field => field.name === "status")?.picklistValues.filter(value => value.isActive) || [];
      const priorities = fields.find(field => field.name === "priority")?.picklistValues.filter(value => value.isActive) || [];

      return { queues, statuses, priorities };
    } catch (error) {
      console.error(error);
      return { queues: [], statuses: [], priorities: [] };
    }
  }

  async getResources() {
    try {
      const apiFilter: AutoTaskAPIFilter<AutoTaskResource> = {
        Filter: [
          { field: "isActive", op: "eq", value: "true" },
          { field: "licenseType", op: "in", value: [1, 3] } // 1 = Full, 3 = Limited, 7 = API User
        ]
      };

      const resourceFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Resources/query?search=${JSON.stringify(apiFilter)}`, {
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
      return resourceData.items as AutoTaskResource[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // =============== Companies ===============

  async getActiveCompanies() {
    try {
      const apiFilter: AutoTaskAPIFilter<AutoTaskCompany> = {
        Filter: [
          { field: "isActive", op: "eq", value: "true" },
          { field: "companyType", op: "eq", value: "1" },
        ],
      };

      const companyFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/query?search=${JSON.stringify(apiFilter)}`, {
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
      return companyData.items as AutoTaskCompany[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCompanyLocations(companyIds: number[]) {
    try {
      const apiFilter: AutoTaskAPIFilter<AutoTaskCompanyLocation> = {
        Filter: [
          { field: "companyID", op: "in", value: companyIds },
        ],
      };

      const companyLocationFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/CompanyLocations/query?search=${JSON.stringify(apiFilter)}`, {
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
      return companyLocationData.items as AutoTaskCompanyLocation[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // =============== Helpers ===============

  private async getTicketFieldValue(field: keyof AutoTaskTicket, label: string) {
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

  private async getTicketFieldValues(field: keyof AutoTaskTicket) {
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
      return null;
    }
  }

  private async getTicketFields() {
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
      return ticketInfoData.fields;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getCompanyFieldValue(field: string, label: string) {
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