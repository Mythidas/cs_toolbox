export const NAV_LINKS = [
  {
    route: "/",
    title: "Dashboard",
    icon: "/icons/chart.svg",
  },
  {
    route: "/tickets",
    title: "Tickets",
    icon: "/icons/ticket.svg",
  },
  {
    route: "/sites",
    title: "Sites",
    icon: "/icons/office.svg",
  },
];

// =================== AUTOTASK =========================

export const AUTOTASK_TICKET_URL = "https://ww15.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&ticketId=";
export const AUTOTASK_NEW_TICKET_URL = "https://ww15.autotask.net/Mvc/ServiceDesk/TicketNew.mvc/Create?categoryId=3";
export const AUTOTASK_COMPANY_URL = "https://ww15.autotask.net/Mvc/CRM/AccountDetail.mvc?accountId=";

export function convertFiltersToURLParams(filters: TicketParams): string {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc;
    }

    if (Array.isArray(value)) {
      return `${acc}${value.map((_val) => `${key}=${_val}`).join("&")}&`;
    }

    if (key === "lastActivityDate") {
      return `${acc}${key}=${(value as Date).toISOString()}&`;
    }

    return `${acc}${key}=${value}&`;
  }, "?").slice(0, -1);
}

export function convertSearchParamsToFilters(searchParams?: { [key: string]: string | string[] | undefined }) {
  return {
    ticketNumber: searchParams?.ticketNumber ? String(searchParams?.ticketNumber) : undefined,
    title: searchParams?.title ? String(searchParams?.title) : undefined,
    status: searchParams?.status ? (Array.isArray(searchParams.status) ? searchParams.status.map((_val) => Number(_val)) : [Number(searchParams.status)]) : undefined,
    companyID: searchParams?.companyID ? (Array.isArray(searchParams.companyID) ? searchParams.companyID.map((_val) => Number(_val)) : [Number(searchParams.companyID)]) : undefined,
    queueID: searchParams?.queueID ? (Array.isArray(searchParams.queueID) ? searchParams.queueID.map((_val) => Number(_val)) : [Number(searchParams.queueID)]) : undefined,
    assignedResourceID: searchParams?.assignedResourceID ? (Array.isArray(searchParams.assignedResourceID) ? searchParams.assignedResourceID.map((_val) => Number(_val)) : [Number(searchParams.assignedResourceID)]) : undefined,
    priority: searchParams?.priority ? (Array.isArray(searchParams.priority) ? searchParams.priority.map((_val) => Number(_val)) : [Number(searchParams.priority)]) : undefined,
    lastActivityDate: searchParams?.lastActivityDate ? new Date(searchParams.lastActivityDate as string) : undefined,
  };
}

// =================== MISC =========================

export const TIMEZONES = [
  { state: "Arizona", shorthand: "AZ", label: "MST", offset: -7 },
  { state: "Alabama", shorthand: "AL", label: "CST", offset: -6 },
  { state: "Alaska", shorthand: "AK", label: "AKST", offset: -9 },
  { state: "Arkansas", shorthand: "AR", label: "CST", offset: -6 },
  { state: "California", shorthand: "CA", label: "PST", offset: -8 },
  { state: "Colorado", shorthand: "CO", label: "MST", offset: -7 },
  { state: "Connecticut", shorthand: "CT", label: "EST", offset: -5 },
  { state: "Delaware", shorthand: "DE", label: "EST", offset: -5 },
  { state: "Florida", shorthand: "FL", label: "EST", offset: -5 },
  { state: "Georgia", shorthand: "GA", label: "EST", offset: -5 },
  { state: "Hawaii", shorthand: "HI", label: "HST", offset: -10 },
  { state: "Idaho", shorthand: "ID", label: "MST", offset: -7 },
  { state: "Illinois", shorthand: "IL", label: "CST", offset: -6 },
  { state: "Indiana", shorthand: "IN", label: "EST", offset: -5 },
  { state: "Iowa", shorthand: "IA", label: "CST", offset: -6 },
  { state: "Kansas", shorthand: "KS", label: "CST", offset: -6 },
  { state: "Kentucky", shorthand: "KY", label: "EST", offset: -5 },
  { state: "Louisiana", shorthand: "LA", label: "CST", offset: -6 },
  { state: "Maine", shorthand: "ME", label: "EST", offset: -5 },
  { state: "Maryland", shorthand: "MD", label: "EST", offset: -5 },
  { state: "Massachusetts", shorthand: "MA", label: "EST", offset: -5 },
  { state: "Michigan", shorthand: "MI", label: "EST", offset: -5 },
  { state: "Minnesota", shorthand: "MN", label: "CST", offset: -6 },
  { state: "Mississippi", shorthand: "MS", label: "CST", offset: -6 },
  { state: "Missouri", shorthand: "MO", label: "CST", offset: -6 },
  { state: "Montana", shorthand: "MT", label: "MST", offset: -7 },
  { state: "Nebraska", shorthand: "NE", label: "CST", offset: -6 },
  { state: "Nevada", shorthand: "NV", label: "PST", offset: -8 },
  { state: "New Hampshire", shorthand: "NH", label: "EST", offset: -5 },
  { state: "New Jersey", shorthand: "NJ", label: "EST", offset: -5 },
  { state: "New Mexico", shorthand: "NM", label: "MST", offset: -7 },
  { state: "New York", shorthand: "NY", label: "EST", offset: -5 },
  { state: "North Carolina", shorthand: "NC", label: "EST", offset: -5 },
  { state: "North Dakota", shorthand: "ND", label: "CST", offset: -6 },
  { state: "Ohio", shorthand: "OH", label: "EST", offset: -5 },
  { state: "Oklahoma", shorthand: "OK", label: "CST", offset: -6 },
  { state: "Oregon", shorthand: "OR", label: "PST", offset: -8 },
  { state: "Pennsylvania", shorthand: "PA", label: "EST", offset: -5 },
  { state: "Rhode Island", shorthand: "RI", label: "EST", offset: -5 },
  { state: "South Carolina", shorthand: "SC", label: "EST", offset: -5 },
  { state: "South Dakota", shorthand: "SD", label: "CST", offset: -6 },
  { state: "Tennessee", shorthand: "TN", label: "CST", offset: -6 },
  { state: "Texas", shorthand: "TX", label: "CST", offset: -6 },
  { state: "Utah", shorthand: "UT", label: "MST", offset: -7 },
  { state: "Vermont", shorthand: "VT", label: "EST", offset: -5 },
  { state: "Virginia", shorthand: "VA", label: "EST", offset: -5 },
  { state: "Washington", shorthand: "WA", label: "PST", offset: -8 },
  { state: "West Virginia", shorthand: "WV", label: "EST", offset: -5 },
  { state: "Wisconsin", shorthand: "WI", label: "CST", offset: -6 },
  { state: "Wyoming", shorthand: "WY", label: "MST", offset: -7 }
];