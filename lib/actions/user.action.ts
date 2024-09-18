"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { OAuthProvider } from "node-appwrite";

// =================== AUTH ===================

export async function signInWithMicrosoft() {
  const { account } = await createAdminClient();
  const origin = headers().get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Microsoft,
    `${origin}/api/oauth`,
    `${origin}/sign-in`
  );

  return redirect(redirectUrl);
}

export async function getLoggedInUser() {
  const { account } = await createSessionClient();
  return account.get();
}