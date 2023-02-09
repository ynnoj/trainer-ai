import AppPageLayout from './components/page-layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppPageLayout>{children}</AppPageLayout>
}
