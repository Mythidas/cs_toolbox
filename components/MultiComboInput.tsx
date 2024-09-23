"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";

interface MultiComboInputProps {
  options: Option[];
  placeholder?: string;
  defaultValues?: string[];
  onChange?: (selected: string[]) => void;
}

const MultiComboInput = ({ options, placeholder = "items", defaultValues, onChange }: MultiComboInputProps) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleSelect = (value: string) => {
    const updatedSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange?.(updatedSelected)
    setSelected(updatedSelected);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <Badge key={value} variant="secondary">
                  {options.find(option => option.value === value)?.label}
                </Badge>
              ))}
            </div>
          ) : (
            `Select ${placeholder}...`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-full p-0`}>
        <Command>
          <CommandInput placeholder={`Search ${placeholder?.toLowerCase() || "option"}...`} />
          <CommandList>
            <CommandEmpty>No {placeholder || "option"} found.</CommandEmpty>
            <CommandGroup>
              {options.map((_option) => (
                <CommandItem
                  key={_option.label}
                  value={_option.label}
                  onSelect={() => {
                    handleSelect(_option.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 stroke-primary",
                      selected.includes(_option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {_option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MultiComboInput;