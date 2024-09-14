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

      const supportQueueID = await this.getTicketFieldValue("queueID", "Support");
      if (!supportQueueID) {
        this._throw("Support queue not found");
      }

      const triageQueueID = await this.getTicketFieldValue("queueID", "Triage");
      if (!triageQueueID) {
        this._throw("Triage queue not found");
      }

      const apiFilter = JSON.stringify({
        Filter: [
          { field: "status", op: "noteq", value: Number(completeStatusID) },
        ]
      });

      const ticketFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/query?search=${apiFilter}`, {
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
      const queueLabels = await this.getTicketFieldLabels("queueID");
      if (!queueLabels) {
        this._throw("Queue labels not found");
      }

      return queueLabels;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // =============== Companies ===============

  async getActiveCompanies() {
    try {
      const apiFilter = JSON.stringify({
        Filter: [
          { field: "isActive", op: "eq", value: "true" },
          { field: "companyType", op: "eq", value: 1 }
        ]
      });

      const companyFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/query?search=${apiFilter}`, {
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

  private async getTicketFieldLabels(field: keyof AutoTaskTicket) {
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
      const fieldLabels = fieldInfo?.picklistValues.filter(value => value.isActive) || [];
      return fieldLabels;
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

interface AutoTaskAPIFilter {
  field: string;
  op: "eq" | "noteq" | "gt" | "gte" | "lt" | "lte" | "beginsWith" | "endsWith" | "contains" | "exist" | "notExist" | "in" | "notIn";
  value: string | number;
}