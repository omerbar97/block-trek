import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from './api/auth/[...nextauth]/authOptions'

export default function Home() {

  const session = getServerSession(authOptions)
  console.log(session)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Welcome to home page</p>
    </main>
  )
}
