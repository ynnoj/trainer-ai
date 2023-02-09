'use client'

import { useEffect } from 'react'
import Clerk from '@clerk/clerk-js'

export default function OAuth() {
  useEffect(() => {
    const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

    async function handleCallback() {
      await clerk.load()

      return clerk.handleRedirectCallback()
    }

    handleCallback()
  }, [])
}
