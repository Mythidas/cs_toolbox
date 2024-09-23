import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex flex-col p-lg card">
        <h1 className="text-4xl font-bold">Welcome to CS Tools</h1>
        <p className="text-lg mt-2 space-x-2">
          <span>Please visit</span>
          <Link href="/tickets" className="text-primary font-semibold hover:text-primary-foreground hover:underline">Tickets</Link>
          {/* or 
          <Link href="/devices" className="text-primary font-semibold hover:text-primary-foreground hover:underline">Devices</Link> */}
        </p>
      </div>
    </div>
  )
}

export default Home;