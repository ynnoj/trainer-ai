import { ClerkProvider } from '@clerk/nextjs/app-beta'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
