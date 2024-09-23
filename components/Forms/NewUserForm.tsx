"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormFieldInput from "../FormFieldInput";
import SelectInput from "../SelectInput";
import { Textarea } from "../ui/textarea";
import MultiComboInput from "../MultiComboInput";

const formSchema = z.object({
  email: z.string(),
  userFirstName: z.string(),
  userLastName: z.string(),
  location: z.string(),
  managerName: z.string(),
  newOrRehire: z.string(),
  employeeToMirror: z.string().optional(),
  startDate: z.string(),
  requireDeskphone: z.boolean().optional(),
  requireComputer: z.boolean().optional(),
  softwareNeeded: z.string().array(),
  notes: z.string().optional()
});

interface NewUserFormProps {
  company: AutoTaskCompany;
  software: string[];
}

const NewUserForm = ({ company, software }: NewUserFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between size-full">
        <div className="flex flex-col px-2 w-full h-full space-y-2 overflow-y-auto">
          <h1 className="text-center text-2xl font-semibold">
            {company.companyName}
          </h1>
          <FormFieldInput control={form.control} name="email" label="Email *" renderInput={(field) => <Input type="email" {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="Enter your email..." />} />
          <hr />
          <div className="flex flex-col w-full px-sm space-y-4 overflow-y-auto">
            <div className="flex w-full space-x-2">
              <FormFieldInput control={form.control} name="userFirstName" label="First Name *" renderInput={(field) => <Input {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="User first name..." />} />
              <FormFieldInput control={form.control} name="userLastName" label="Last Name *" renderInput={(field) => <Input {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="User last name..." />} />
            </div>
            <div className="flex w-full space-x-2">
              <FormFieldInput control={form.control} name="location" label="Location *" renderInput={(field) => <Input {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="Enter location..." />} />
              <FormFieldInput control={form.control} name="managerName" label="Manager *" renderInput={(field) => <Input {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="Enter manager name..." />} />
            </div>
            <div className="flex w-full space-x-2">
              <FormFieldInput control={form.control} name="newOrRehire" label="New or Rehire *" renderInput={(field) => <SelectInput options={[{ label: "New", value: "0" }, { label: "ReHire", value: "1" }]} label="Option" {...field} value={typeof field.value === 'boolean' ? '' : field.value as string} onValueChange={field.onChange} />} />
              <FormFieldInput control={form.control} name="employeeToMirror" label="Employee to Mirror" renderInput={(field) => <Input {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="Enter employee name..." />} />
            </div>
            <FormFieldInput control={form.control} name="startDate" label="Start Date *" renderInput={(field) => <Input type="date" {...field} value={typeof field.value === 'boolean' ? '' : field.value} />} />
            <div className="flex w-full space-x-2">
              <FormFieldInput control={form.control} name="requireDeskphone" label="Require Deskphone?" renderInput={(field) => <Input className="ml-4 w-5 h-5" type="checkbox" onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />} alignRow />
              <FormFieldInput control={form.control} name="requireComputer" label="Require Computer?" renderInput={(field) => <Input className="ml-4 w-5 h-5" type="checkbox" onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />} alignRow />
            </div>
            <FormFieldInput control={form.control} name="softwareNeeded" label="Software *" renderInput={(field) => <MultiComboInput options={software.map((soft) => { return { label: soft, value: soft } })} {...field} />} />
            <FormFieldInput control={form.control} name="notes" label="Notes" renderInput={(field) => <Textarea {...field} value={typeof field.value === 'boolean' ? '' : field.value} placeholder="Notes..." />} />
          </div>
        </div>
        <div className="flex flex-col w-full h-fit space-y-2">
          <hr />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default NewUserForm;