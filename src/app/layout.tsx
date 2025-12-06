import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from 'sonner'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: {
    template: '%s - New Project',
    default: 'New Project',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} h-full overflow-hidden`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&display=swap"
        />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.cdnfonts.com/css/segoe-ui"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#111111] text-white antialiased m-0 p-0 overflow-hidden" suppressHydrationWarning>
        <QueryProvider>
          <main className="h-screen overflow-hidden">{children}</main>
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
