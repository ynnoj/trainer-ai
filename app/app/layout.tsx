import type { User } from '@clerk/nextjs/dist/api'

import { currentUser } from '@clerk/nextjs/app-beta'
import AppPageLayout from './components/page-layout'

export default async function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user: User | null = await currentUser()

  return <AppPageLayout user={user!}>{children}</AppPageLayout>
}
