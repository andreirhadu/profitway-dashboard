import { db } from "@/lib/db"

export const getUserFromDb = async (email: string) => {
  const user =  await db.collection('admins').findOne({email: email})

  return user
}