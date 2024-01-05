import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { authOptions } from './api/auth/[...nextauth]/authOptions'
import SigninBtn from '@/components/signInBtn'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Welcome to home page</p>
      <SigninBtn />
    </main>
  )
}
