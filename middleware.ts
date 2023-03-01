import type { NextRequest } from 'next/server'

import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const unauthenticedPaths = ['/sign-in', '/oauth']
const authenticatedPaths = ['/app*']

const pathMatcher = (paths: string[], path: string): string | undefined =>
  paths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))))

const isAuthenticatedRoute = (path: string): boolean =>
  !!pathMatcher(authenticatedPaths, path)
const isUnauthenticatedRoute = (path: string): boolean =>
  !!pathMatcher(unauthenticedPaths, path)

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request)

  if (isUnauthenticatedRoute(request.nextUrl.pathname) && userId)
    return NextResponse.redirect(new URL('/app', request.url))

  if (isAuthenticatedRoute(request.nextUrl.pathname) && !userId)
    return NextResponse.redirect(new URL('/sign-in', request.url))

  return NextResponse.next()
})

export const config = { matcher: '/((?!.*\\.).*)' }
