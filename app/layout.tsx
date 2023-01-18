import { ClerkProvider } from '@clerk/nextjs/app-beta'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html>
        <head />
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
