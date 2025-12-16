import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, CheckCircle2, Users, Sparkles, GitBranch, Zap } from 'lucide-react'

interface HomeProps {
  params: {
    locale: string
  }
}

export default async function Home({ params: { locale } }: HomeProps) {
  const t = await getTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">{t('landing.hero.badge')}</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            {t('landing.hero.title')}{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              {t('landing.hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link href={`/${locale}/dashboard`}>
              <Button size="lg" className="text-lg px-8 py-6">
                {t('landing.hero.ctaPrimary')}
                <Zap className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              {t('landing.hero.ctaSecondary')}
            </Button>
          </div>
        </div>

        {/* Feature Preview Image Placeholder */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="relative rounded-2xl border-2 border-gray-200 shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50">
            <div className="aspect-video flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <GitBranch className="w-16 h-16 mx-auto text-indigo-400" />
                <p className="text-muted-foreground font-medium">Meeting Visualization Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('landing.features.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-indigo-200 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{t('landing.features.visualization.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('landing.features.visualization.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-200 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{t('landing.features.actionItems.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('landing.features.actionItems.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-200 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{t('landing.features.collaboration.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('landing.features.collaboration.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-500 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-8">Trusted by teams who value clarity</h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-indigo-100">Meetings analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-100">Teams using Mora</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-100">Satisfaction rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">{t('landing.cta.title')}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t('landing.cta.subtitle')}</p>
          <Link href={`/${locale}/dashboard`}>
            <Button size="lg" className="text-lg px-8 py-6">
              {t('landing.cta.button')}
              <Zap className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-xl font-bold">{t('common.appName')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('common.tagline')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-indigo-600">Features</Link></li>
                <li><Link href={`/${locale}/pricing`} className="hover:text-indigo-600">{t('nav.pricing')}</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Use Cases</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-indigo-600">About</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-indigo-600">Privacy</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Terms</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Mora. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}