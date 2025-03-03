import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) { 
  const { firstName, lastName, email, password } = await request.json()

    if (!firstName || !lastName || !email || !password) {
        return new Response('All fields are required,', { status: 400})
    }

    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) return new Response('Email already used.', { status: 400} )

    const pwHash = await bcrypt.hash(password, 10)
    const { insertedId } = await db.collection('users').insertOne({ firstName, lastName, email, pwHash })
  
    const token = jwt.sign({ userId: String(insertedId) }, process.env.JWT_SECRET!, { expiresIn: '30d' })
    return Response.json({ token, user: { firstName: firstName, lastName: lastName, email: email } })
}