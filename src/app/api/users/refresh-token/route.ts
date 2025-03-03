import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  const bearer = request.headers.get('Authorization')
  
  if (!bearer) {
    return new Response('Token is required.', { status: 401 })
  }

  const token = bearer.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(decoded.userId) })
    
    if (!user) {
      return new Response('Invalid token.', { status: 401 })
    }

    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
    return Response.json({ token: newToken, user})
  } catch (error) {
    return new Response('Invalid or expired token.', { status: 401 })
  }
}
