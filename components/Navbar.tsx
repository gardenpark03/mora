import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import LanguageSelector from './LanguageSelector'
import UserMenu from './UserMenu'

interface NavbarProps {
  locale: string
}

export default async function Navbar({ locale }: NavbarProps) {
  const t = await getTranslations()

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            {t('common.appName')}
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Navigation Links */}
          <Link href={`/${locale}/dashboard`} className="text-sm font-medium hover:text-indigo-600 transition-colors">
            {t('nav.dashboard')}
          </Link>
          <Link href={`/${locale}/pricing`} className="text-sm font-medium hover:text-indigo-600 transition-colors">
            {t('nav.pricing')}
          </Link>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}