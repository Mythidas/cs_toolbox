"use server";

import { Button } from "@/components/ui/button";
import { signInWithMicrosoft } from "@/lib/actions/user.action";
import React from "react";

const SignIn = async () => {
  return (
    <div className="flex size-full justify-center items-center">
      <div className="flex w-1/4 h-1/2 bg-card p-sm border-border border-[1px]">
        <form className="flex flex-col justify-between w-full h-full" action={signInWithMicrosoft}>
          <div>
            <h1 className="py-md text-center font-semibold text-3xl">
              Sign in to CS Toolbox
            </h1>
            <hr />
          </div>
          <div className="flex flex-col space-y-2">
            <hr />
            <Button type="submit" className="w-full">
              Sign in with Microsoft
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn;