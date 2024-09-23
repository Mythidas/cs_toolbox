import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectProps } from "@radix-ui/react-select";

interface SelectInputProps extends SelectProps {
  options: Option[];
  label: string;
}

function SelectInput({ options, label, ...props }: SelectInputProps) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => {
            return <SelectItem key={option.label} value={option.value}>{option.label}</SelectItem>
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectInput;