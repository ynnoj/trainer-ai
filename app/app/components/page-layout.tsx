'use client'

import type { User } from '@clerk/nextjs/dist/api'

import { ApplicationProvider } from '../../../lib/hooks/useApplicationState'
import Navigation from './navigation'

export default function AppPageLayout({
  children,
  user
}: {
  children: React.ReactNode
  user: Partial<User>
}) {
  return (
    <ApplicationProvider>
      <html lang="en" className="h-full bg-gray-50">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="h-full overflow-hidden">
          <div className="flex h-full">
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navigation user={user} />
              <div className="flex flex-1 items-stretch overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </body>
      </html>
    </ApplicationProvider>
  )
}
