import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl }}) {
      const isLoggedIn = !!auth?.user
      const requiresPermission = nextUrl.pathname.startsWith('/dashboard')
      
      if ( requiresPermission ) {
        if (isLoggedIn) {
          return true
        }
        else return false
      } else if ( nextUrl.pathname == '/' ) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl))
        else return false
      }

      return true
    }
  },
  providers: [Credentials]
} satisfies NextAuthConfig