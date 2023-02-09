'use client'

import type { OAuthStrategy } from '@clerk/types'

import { useSignIn } from '@clerk/nextjs'

export default function SignIn() {
  const { signIn } = useSignIn()

  const onClick = (strategy: OAuthStrategy) =>
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/oauth',
      redirectUrlComplete: '/app'
    })

  return <button onClick={() => onClick('oauth_facebook')}>fb</button>
}
