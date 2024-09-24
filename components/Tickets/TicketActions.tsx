"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AUTOTASK_NEW_TICKET_URL } from "@/constants";

const TicketActions = () => {
  function handleNewTicket() {
    window.open(AUTOTASK_NEW_TICKET_URL, "_blank");
  }

  return (
    <div className="flex flex-col size-full">
      <Button className="flex w-fit space-x-1" variant="ghost" onClick={handleNewTicket}>
        <Plus width={24} height={24} />
        <span className="w-full">New Ticket</span>
      </Button>
    </div>
  )
}

export default TicketActions;