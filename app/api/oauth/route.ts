import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest, response: NextResponse) {
//   return NextResponse.json({ message: "Hello World" });
// }


export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");

    if (!userId || !secret) {
      return NextResponse.error();
    }

    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.redirect(`${request.nextUrl.origin}`);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
