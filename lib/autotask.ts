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

  async getOpenTickets() {
    try {
      const completeStatusID = await this.getTicketFieldValue("status", "Complete");
      if (!completeStatusID) {
        this._throw("Complete status not found");
      }

      const ticketFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Tickets/query?search={"Filter":[{"field":"status","op":"noteq","value":${completeStatusID}}]}`, {
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

  async getActiveCompanies() {
    try {
      const companyFetch = await fetch(`${NEXT_PUBLIC_AUTOTASK_URL}/Companies/query?search={"Filter":[{"field":"isActive","op":"eq","value":"true"},{"field":"companyType","op":"eq","value":1}]}`, {
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

      return companyData.items;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getTicketFieldValue(field: string, label: string) {
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

  async getCompanyFieldValue(field: string, label: string) {
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

interface AutoTaskFieldInfo {
  name: string;
  dataType: string;
  length: number;
  isRequired: boolean;
  isReadOnly: boolean;
  isQueryable: boolean;
  isReference: boolean;
  referenceEntityType: string;
  isPickList: boolean;
  picklistValues: AutoTaskFieldValue[];
  picklistParentValueField: string;
  isSupportedWebhookField: boolean;
}

interface AutoTaskFieldValue {
  value: string;
  label: string;
  isDefaultValue: boolean;
  sortOrder: number;
  parentValue: string;
  isActive: boolean;
  isSystem: boolean;
}