"use server";

import { Button } from "@/components/ui/button";
import { signInWithMicrosoft } from "@/lib/actions/user.action";
import React from "react";

const SignIn = async () => {
  return (
    <div>
      <form action={signInWithMicrosoft}>
        <Button type="submit">Sign in with Microsoft</Button>
      </form>
    </div>
  )
}

export default SignIn;