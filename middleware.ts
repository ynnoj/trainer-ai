import type { NextRequest } from 'next/server'

import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const unauthenticedPaths = ['/auth*']
const authenticatedPaths = ['/dashboard*']

const pathMatcher = (paths: string[], path: string): string =>
  paths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))))

const isAuthenticatedRoute = (path: string): string =>
  pathMatcher(authenticatedPaths, path)
const isUnauthenticatedRoute = (path: string): string =>
  pathMatcher(unauthenticedPaths, path)

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request)

  if (isUnauthenticatedRoute(request.nextUrl.pathname) && userId)
    return NextResponse.redirect(new URL('/dashboard', request.url))

  if (isAuthenticatedRoute(request.nextUrl.pathname) && !userId)
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))

  return NextResponse.next()
})

export const config = { matcher: '/((?!.*\\.).*)' }
