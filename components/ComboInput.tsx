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

interface ComboInputProps {
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (option: Option) => void;
}

const ComboInput = ({ options, placeholder, defaultValue, onChange }: ComboInputProps) => {
  const COMBO_WIDTH = 260;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[${COMBO_WIDTH}px] justify-between border-none bg-accent hover:bg-accent-foreground hover:text-muted`}
        >
          {value
            ? options.find((_option) => _option.value === value)?.label
            : `Select ${placeholder?.toLowerCase() || "option"}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[${COMBO_WIDTH}px] p-0`}>
        <Command>
          <CommandInput placeholder={`Search ${placeholder?.toLowerCase() || "option"}...`} />
          <CommandList>
            <CommandEmpty>No {placeholder || "option"} found.</CommandEmpty>
            <CommandGroup>
              {options.map((_option) => (
                <CommandItem
                  key={_option.label}
                  value={_option.label}
                  onSelect={(_current) => {
                    setValue(_option.value === value ? "" : _option.value);
                    setOpen(false);
                    onChange?.(_option);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 stroke-primary",
                      value === _option.value ? "opacity-100" : "opacity-0"
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

export default ComboInput;