'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { locales, localeNames, Locale } from '@/i18n'

export default function LanguageSelector() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Extract current locale from pathname
  const segments = pathname.split('/')
  const currentLocale = segments[1] && locales.includes(segments[1] as Locale) ? segments[1] : 'en'

  const handleLocaleChange = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = '/' + segments.slice(2).join('/')
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeNames[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}