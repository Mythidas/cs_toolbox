import { getServerSession } from "next-auth";

export async function getLoggedInUser() {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error(`[getLoggedInUser] Failed to get session!`);
    }

    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}