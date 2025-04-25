import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export async function PATCH(request: Request) {
  const bearer = request.headers.get('Authorization')

  if (!bearer) {
    return new Response('Token is required.', { status: 401 })
  }

  const token = bearer.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(decoded.userId) })
    
    if (!user) {
      return new Response('invalid-token.', { status: 401 })
    }

    const { firstName, lastName, email, phone, password, oldPassword, country } = await request.json()

    if ( password ) {
      const valid = await bcrypt.compare(oldPassword, user.pwHash)
      if (!valid) {
        return new Response('invalid-old-password', { status: 404 })
      }

      const pwHash = await bcrypt.hash(password, 10)
      await db.collection('users').updateOne({ _id: user._id }, { $set: { pwHash } })
      
      return Response.json({ user: true })
    } else {
      await db.collection('users').updateOne({ _id: user._id }, { $set: { firstName, lastName, email, phone, country } })
      var updatedUser = await db.collection('users').findOne({ _id: user._id })
      updatedUser!.pwHash = undefined

      return Response.json({ user: updatedUser })
    }

  } catch (error) {
    console.log(error)
    return new Response('something-went-wrong', { status: 400 })
  }
}