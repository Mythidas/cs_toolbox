import React from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="text" placeholder="Search..." className="pl-8 border-border" />
    </div>
  )
}

export default SearchInput;