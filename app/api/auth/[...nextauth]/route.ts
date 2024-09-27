import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    AzureAD({
      clientId: process.env.ENTRA_ID!,
      clientSecret: process.env.ENTRA_SECRET!,
      tenantId: process.env.ENTRA_TENANT!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      },
    })
  ],
  session: {
    maxAge: 60 * 60 * 8,
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    }
  }
})

export { handler as GET, handler as POST };