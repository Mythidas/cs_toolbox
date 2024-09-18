"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { AUTOTASK_NEW_TICKET_URL } from "@/constants";
import Link from "next/link";

const TicketActions = () => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={cn("flex flex-col size-full p-sm bg-card rounded-md border-border border-[1px] items-center justify-between transition-all", { "w-40": expanded, "w-14": !expanded })}>
      <div className="flex flex-col w-full space-y-2">
        <Link href={AUTOTASK_NEW_TICKET_URL} target="_blank" className="flex px-sm py-1 space-x-2 text-nowrap rounded-md border-border border-[1px] hover:bg-secondary">
          <Plus width={24} height={24} />
          <span className={cn("w-full", { "hidden": !expanded })}>New Ticket</span>
        </Link>
      </div>
      <div className="flex w-full">
        <Button className="px-sm w-full space-x-2" onClick={() => setExpanded(!expanded)} variant="ghost">
          {expanded ? <ArrowLeft /> : <ArrowRight />}
          {expanded && <span>Actions</span>}
        </Button>
      </div>
    </div>
  )
}

export default TicketActions;