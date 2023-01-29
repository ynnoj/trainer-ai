'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { signOut } = useClerk()
  const router = useRouter()

  const onClick = async () => {
    await signOut()

    router.push('/')
  }

  return (
    <>
      <button onClick={() => onClick()}>sign out</button>
      {children}
    </>
  )
}
