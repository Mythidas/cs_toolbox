"use client";

import * as React from "react";
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

interface ComboCommandInputProps {
  options: Option[];
  placeholder?: string;
  onChange?: (option: Option) => void;
}

const ComboCommandInput = ({ options, placeholder, onChange }: ComboCommandInputProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between border-none bg-accent hover:bg-accent-foreground hover:text-muted`}
        >
          {placeholder || "Select Option"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-full p-0`}>
        <Command>
          <CommandInput placeholder={placeholder || "Search options..."} />
          <CommandList>
            <CommandEmpty>No {placeholder || "option"} found.</CommandEmpty>
            <CommandGroup>
              {options.map((_option) => (
                <CommandItem
                  key={_option.label}
                  value={_option.label}
                  onSelect={() => {
                    setOpen(false);
                    onChange?.(_option);
                  }}
                >
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

export default ComboCommandInput;