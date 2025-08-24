import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { ThemeProvider } from '@/components/theme-provider'
import { Locale, locales } from '@/lib/i18n'

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../messages/en.json`)).default
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const messages = await getMessages(locale)

  return (
    <ThemeProvider defaultTheme="system" storageKey="anonymous-articles-theme">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href={`/${locale}`} className="mr-6 flex items-center space-x-2">
              <span className="text-xl font-bold">{messages.nav.title}</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href={`/${locale}`} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {messages.nav.browse}
              </a>
              <a href={`/${locale}/disclaimer`} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {messages.nav.disclaimer}
              </a>
              <a href={`/${locale}/report-abuse`} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {messages.nav.reportAbuse || 'Report Abuse'}
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <LanguageSwitcher currentLocale={locale} messages={messages} />
            <ThemeSwitcher />
            <Button asChild>
              <a href={`/${locale}/write`}>{messages.nav.write}</a>
            </Button>
          </div>
        </div>
      </nav>
      <main className="min-h-screen">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {messages.footer.description}
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <a href={`/${locale}/disclaimer`} className="hover:text-foreground">
              {messages.nav.disclaimer}
            </a>
          </div>
        </div>
      </footer>
    </ThemeProvider>
  )
}