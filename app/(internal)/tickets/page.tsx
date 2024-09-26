import TicketView from "@/components/Tickets/TicketView";
import TicketViewSkeleton from "@/components/Tickets/TicketViewSkeleton";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { AutoTaskClient } from "@/lib/autotask";
import { redirect } from "next/navigation";
import React from "react";

const Tickets = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("/sign-in");

  return (
    <div className="flex size-full justify-between space-x-2">
      <div className="flex flex-col w-full h-full p-sm">
        <React.Suspense fallback={<TicketViewSkeleton />}>
          <TicketView searchParams={searchParams} />
        </React.Suspense>
      </div>
    </div>
  )
}

export default Tickets;