"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ID, OAuthProvider, Query } from "node-appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION,
} = process.env;

// =================== AUTH ===================

export async function signInWithMicrosoft() {
  const { account } = await createAdminClient();
  const origin = headers().get("origin");

  console.log(`[${origin}] Signing in with Microsoft...`);

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Microsoft,
    `${origin}/api/oauth`,
    `${origin}/sign-in`
  );

  console.log(`[${origin}] Redirecting to: ${redirectUrl}. Fallback to /sign-in if not redirected. Proceed to /api/oauth if redirected.`);

  return redirect(redirectUrl);
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// =================== DATABASE ===================

export async function createUserDocument(userId: string) {
  try {
    const { database } = await createAdminClient();
    const userDocument = await database.createDocument(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION!, ID.unique(), {
      userId,
    });

    return userDocument;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserDocument(userId: string) {
  try {
    const { database } = await createAdminClient();
    const ticketViews = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION!, [Query.equal("userId", userId)]);

    return parseStringify(ticketViews.documents)[0] as UserDocument;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUserDocument(userId: string, ticketViews: string[]) {
  try {
    const { database } = await createAdminClient();

    const updatedDocument = await database.updateDocument(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION!, userId, {
      userId,
      ticketViews,
    });

    return parseStringify(updatedDocument) as UserDocument;
  } catch (error) {
    console.error(error);
    return null;
  }
}