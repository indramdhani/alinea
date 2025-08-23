import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anonymous Articles',
  description: 'Share your thoughts anonymously',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex">
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="text-xl font-bold">Anonymous Articles</span>
              </a>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Browse
                </a>
                <a href="/disclaimer" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Disclaimer
                </a>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <Button asChild>
                <a href="/write">Write Article</a>
              </Button>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built for anonymous sharing. No accounts, no tracking, just pure expression.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a href="/disclaimer" className="hover:text-foreground">
                Disclaimer
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}