import ErrorPage from "@/components/ErrorPage";
import NewUserForm from "@/components/Forms/NewUserForm";
import { getAutoTaskSites, getCompanyConfigurations, getCompanyContacts, getCompanyDocument } from "@/lib/actions/company.action";
import React from "react";

const Forms = async ({ params }: { params: { customerId: string }, searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const companyDocument = await getCompanyDocument(params.customerId);

  const autotaskCompanies = await getAutoTaskSites();
  const company = autotaskCompanies.find((comp) => comp.id === Number(companyDocument?.autotaskId));

  if (!companyDocument || !company) {
    return (
      <ErrorPage>
        No Company Found
      </ErrorPage>
    )
  }

  const companyContacts = await getCompanyContacts(company.id);
  const companyConfigurations = await getCompanyConfigurations(company.id);
  const softwareStack = companyConfigurations?.userDefinedFields.find((udf) => udf.name === "Software Stack")?.value.split('\n') || [];

  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex w-1/3 h-2/3 p-sm card">
        <NewUserForm company={company} software={softwareStack} contacts={companyContacts || []} />
      </div>
    </div>
  )
}

export default Forms;