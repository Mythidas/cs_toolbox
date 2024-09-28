import TicketView from "@/components/Tickets/TicketView";
import TicketViewSkeleton from "@/components/Tickets/TicketViewSkeleton";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const Tickets = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("/sign-in");

  return (
    <div className="flex w-full h-full p-sm">
      <React.Suspense fallback={<TicketViewSkeleton />}>
        <TicketView searchParams={searchParams} />
      </React.Suspense>
    </div>
  )
}

export default Tickets;