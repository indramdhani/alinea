'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { Locale, locales, removeLocaleFromPath } from '@/lib/i18n'

interface LanguageSwitcherProps {
  currentLocale: Locale
  messages: any
}

export function LanguageSwitcher({ currentLocale, messages }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: Locale) => {
    const pathWithoutLocale = removeLocaleFromPath(pathname)
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex space-x-1">
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "ghost"}
            size="sm"
            onClick={() => switchLanguage(locale)}
            className="text-xs"
          >
            {locale === 'en' ? messages.language.english : messages.language.indonesian}
          </Button>
        ))}
      </div>
    </div>
  )
}