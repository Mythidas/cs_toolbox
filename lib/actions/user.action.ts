"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { ID, OAuthProvider, Query } from "node-appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION,
  NEXT_PUBLIC_ORIGIN
} = process.env;

// =================== AUTH ===================

export async function signInWithMicrosoft() {
  const { account } = await createAdminClient();

  console.log(`[${NEXT_PUBLIC_ORIGIN}] Signing in with Microsoft...`);

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Microsoft,
    `${NEXT_PUBLIC_ORIGIN}/api/oauth`,
    `${NEXT_PUBLIC_ORIGIN}/`
  );

  console.log(`[${NEXT_PUBLIC_ORIGIN}] Redirecting to: ${redirectUrl}. Fallback to / if not redirected. Proceed to /api/oauth if redirected.`);

  return redirect(redirectUrl);
}

export async function getLoggedInUser(hint?: string) {
  try {
    const { account } = await createSessionClient(hint);
    return await account.get();
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