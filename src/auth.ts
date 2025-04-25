import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { getUserFromDb } from "./services/getUserFromDb"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }: any) {
      session.user.id = token._id
      return session
    },
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        // logic to verify if the user exists
        user = await getUserFromDb(credentials.email as string)

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return null
        }
        
        // logic to verify if password is correct
        if (!bcrypt.compareSync(credentials.password as string, user.pwHash)) {
          return null
        }
        // return user object with their profile data
        return user as User
      },
    }),
  ]
})