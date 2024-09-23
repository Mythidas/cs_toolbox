import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldInputProps<T extends FieldValues> {
  control: Control<T, unknown>;
  name: Path<T>;
  label: string;
  renderInput: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
  description?: string;
  alignRow?: boolean;
}

const FormFieldInput = <T extends FieldValues>({ control, name, label, renderInput, description, alignRow }: FormFieldInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", { "flex text-nowrap items-center": alignRow })}>
          <FormLabel className="text-base font-semibold">
            {label}
          </FormLabel>
          <FormControl>
            {renderInput(field)}
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormFieldInput;