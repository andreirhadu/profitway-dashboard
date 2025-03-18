import { db } from "@/lib/db"
import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import axios from "axios"

const APPLE_PUBLIC_KEYS_URL = "https://appleid.apple.com/auth/keys"
const APPLE_ISSUER = "https://appleid.apple.com"
const CLIENT_ID = process.env.APPLE_CLIENT_ID! // Your Apple Services ID

// Fetch Apple's public key
async function getApplePublicKey(kid: string) {
  const { data } = await axios.get(APPLE_PUBLIC_KEYS_URL)
  const key = data.keys.find((k: any) => k.kid === kid)

  if (!key) throw new Error("Apple public key not found")

  return jwksClient({ jwksUri: APPLE_PUBLIC_KEYS_URL }).getSigningKey(key.kid)
}

export async function POST(request: Request) {
  const { token, firstName, lastName } = await request.json()

  if (!token) return new Response("token-required", { status: 400 })

  try {
    // Decode header to get key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true }) as any
    if (!decodedHeader) {
      return new Response("invalid-token", { status: 401 })
    }

    // Fetch Apple's public key
    const key = await getApplePublicKey(decodedHeader.header.kid)

    // Verify token using Apple's public key
    const decoded = jwt.verify(token, key.getPublicKey(), {
      issuer: APPLE_ISSUER,
      // audience: CLIENT_ID,
    }) as jwt.JwtPayload

    if (!decoded || !decoded.sub) {
      return new Response("invalid-token", { status: 401 })
    }

    const email = decoded.email || decoded.sub // Apple might not send email on refresh
    const appleId = decoded.sub

    if (!email) return new Response("email-required", { status: 400 })

    const usersCollection = db.collection("users")

    let user = await usersCollection.findOne({ email })

    var authToken

    if (user) {
      if (user.provider !== "apple") {
        if (user.provider === "credentials") {
          await usersCollection.updateOne({ email }, { $set: { provider: "apple", appleId } })
        } else {
          return new Response("wrong-provider", { status: 401 })
        }
      }

      authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "30d" })
    } else {
      const { insertedId } = await usersCollection.insertOne({
        firstName: firstName || "First",
        lastName: lastName || "Last",
        email,
        provider: "apple",
        appleId
      })

      authToken = jwt.sign({ userId: insertedId }, process.env.JWT_SECRET!, { expiresIn: "30d" })
    }

    return Response.json({ token: authToken, user })
  } catch (error) {
    console.error("Apple Auth Error:", error)
    return new Response("authentication-failed", { status: 401 })
  }
}