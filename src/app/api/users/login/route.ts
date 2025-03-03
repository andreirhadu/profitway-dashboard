import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) { 
  const { email, password } = await request.json()
  console.log(email)

  if (!email || !password) {
    return new Response('Email and password are required.', { status: 404})
  }

  const user = await db.collection('users').findOne({ email })
  if (!user) return new Response('invalid-credentials', { status: 404})

  if (user.provider == 'apple') {
    return new Response('apple-auth-required', { status: 404})
  }

  const isMatch = await bcrypt.compare(password, user.pwHash);
  if (!isMatch) return new Response('invalid-credentials', { status: 404})

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
  return Response.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } })
}