import { BaseClient } from "./utils";

const {
  NEXT_PUBLIC_AUTOTASK_URL,
  AUTOTASK_USER_ID,
  AUTOTASK_SECRET,
  AUTOTASK_TRACKER
} = process.env;

export class AutoTaskClient extends BaseClient {
  constructor() {
    super("AutoTask");
  }

  // =============== Tickets ===============

  // TODO: Make the queues a parameter
  async getOpenTickets() {
    try {
      const completeStatusID = await this.getTicketFieldValue("status", "Complete");
      if (!completeStatusID) {
        this._throw("Complete status not found");
      }

      const apiFilter: AutoTaskAPIFilter<AutoTaskTicket> = {
        Filter: [
          { field: "status", op: "noteq", value: Number(completeStatusID) },
        ]
      };

      const ticketFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/query?search=${JSON.stringify(apiFilter)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
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

  async getTicketQueues() {
    try {
      const queueLabels = await this.getTicketFields("queueID");
      if (!queueLabels) {
        this._throw("Queue labels not found");
      }

      return queueLabels;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTicketStatuses() {
    try {
      const statusLabels = await this.getTicketFields("status");
      if (!statusLabels) {
        this._throw("Status labels not found");
      }

      return statusLabels;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTicketPriorities() {
    try {
      const priorityLabels = await this.getTicketFields("priority");
      if (!priorityLabels) {
        this._throw("Priority labels not found");
      }

      return priorityLabels;
    } catch (error) {
      console.error(error);
      return [];
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
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
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
          { field: "companyType", op: "eq", value: "1" }
        ]
      };

      const companyFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/query?search=${JSON.stringify(apiFilter)}`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
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

  // =============== Helpers ===============

  private async getTicketFieldValue(field: keyof AutoTaskTicket, label: string) {
    try {
      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
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

  private async getTicketFieldValues(field: keyof AutoTaskTicket, label: string) {
    try {
      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!ticketInfoFetch.ok) {
        this._throw(ticketInfoFetch.statusText);
      }

      const ticketInfoData = await ticketInfoFetch.json() as { fields: AutoTaskFieldInfo[] };

      const fieldInfo = ticketInfoData.fields.find(fieldInfo => fieldInfo.name === field);
      return fieldInfo?.picklistValues;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async getTicketFields(field: keyof AutoTaskTicket) {
    try {
      const ticketInfoFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/entityInformation/fields`, {
        method: "GET",
        headers: {
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
          "Content-Type": "application/json"
        }
      });

      if (!ticketInfoFetch.ok) {
        this._throw(ticketInfoFetch.statusText);
      }

      const ticketInfoData = await ticketInfoFetch.json() as { fields: AutoTaskFieldInfo[] };
      const fieldInfo = ticketInfoData.fields.find(fieldInfo => fieldInfo.name === field);
      const fields = fieldInfo?.picklistValues.filter(value => value.isActive) || [];
      return fields;
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
          "APIIntegrationcode": AUTOTASK_TRACKER!,
          "UserName": AUTOTASK_USER_ID!,
          "Secret": AUTOTASK_SECRET!,
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
  }[]
}