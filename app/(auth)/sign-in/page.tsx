"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

const SignIn = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    setTimeout(async () => {
      await signIn("azure-ad");
    }, 1000)
  }, [])

  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex w-1/4 h-1/2 bg-card p-sm border-border border-[1px]">
        <form className="flex flex-col justify-between w-full h-full" action={() => signIn("azure-ad")}>
          <div>
            <h1 className="py-md text-center font-semibold text-3xl">
              Sign in to CS Toolbox
            </h1>
            <hr />
          </div>
          <div className="flex flex-col space-y-2">
            <hr />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Sign in with Microsoft
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn;