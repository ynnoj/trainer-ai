import { ClerkProvider } from '@clerk/nextjs/app-beta'

import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
