import NextAuth, { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || []

export const authConfig: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async signIn({ user }) {
            console.log("--- AUTH DEBUG: signIn callback ---");
            console.log("Email attempting login:", user.email);
            console.log("Whitelisted emails:", ADMIN_EMAILS);

            const isAllowed = user.email && ADMIN_EMAILS.includes(user.email);

            if (isAllowed) {
                console.log("Login APPROVED for:", user.email);
                return true;
            }

            console.log("Login DENIED for:", user.email);
            return "/unauthorized";
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = ADMIN_EMAILS.includes(session.user.email!) ? "admin" : "user"
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = ADMIN_EMAILS.includes(user.email!) ? "admin" : "user"
            }
            return token
        }
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
