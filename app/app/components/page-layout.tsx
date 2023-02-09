'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function AppPageLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleClick = () => {
    signOut()

    router.push('/')
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <button onClick={handleClick}>sign out</button>
        {children}
      </body>
    </html>
  )
}
