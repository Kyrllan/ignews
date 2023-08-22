import { query as q } from "faunadb"

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/faunta'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  jwt: {
    signingKey: process.env.SIGNING_KEY,
  },
  callbacks: {
    async signIn(user, account, profile) {

      const email = user['user'].email

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'), {
            data: { email }
          }
          )
        )
        return true
      } catch (error) {
        return false
      }
    }
  }
}
export default NextAuth(authOptions)

