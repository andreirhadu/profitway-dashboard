import NextAuth, { Session, User } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

const users = [
  { id: "1", email: "test@example.com", password: bcrypt.hashSync("password123", 10) },
]

interface ExtendedToken extends JWT {
  user?: User
  accessToken?: string
}

interface ExtendedSession extends Session {
  user?: User
  accessToken?: string
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(user => user.email === credentials.email)
        if (!user || !bcrypt.compareSync(credentials.password as string, user.password)) {
          throw new Error("Invalid credentials")
        }
        return { id: user.id, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const extendedToken = token as ExtendedToken
      if (user) extendedToken.user = user
      if (account?.access_token && typeof account.access_token === "string") {
        extendedToken.accessToken = account.access_token
      }
      return extendedToken
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession
      if (token.user) extendedSession.user = token.user as User
      if (typeof token.accessToken === "string") {
        extendedSession.accessToken = token.accessToken
      }
      return extendedSession
    }
  },
  secret: process.env.AUTH_SECRET,
})