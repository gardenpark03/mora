'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  const [loading, setLoading] = useState<string | null>(null)

  // 다국어 요금제 데이터
  const plans = [
    {
      id: 'free',
      name: t('pricing.free.name'),
      price: t('pricing.free.price'),
      description: t('pricing.free.description'),
      priceId: null,
      features: Array.isArray(t('pricing.free.features')) ? t('pricing.free.features') as unknown as string[] : [],
      cta: t('pricing.free.cta'),
      popular: false,
    },
    {
      id: 'pro',
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      description: t('pricing.pro.description'),
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      features: Array.isArray(t('pricing.pro.features')) ? t('pricing.pro.features') as unknown as string[] : [],
      cta: t('pricing.pro.cta'),
      popular: true,
    },
    {
      id: 'business',
      name: t('pricing.business.name'),
      price: t('pricing.business.price'),
      description: t('pricing.business.description'),
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
      features: Array.isArray(t('pricing.business.features')) ? t('pricing.business.features') as unknown as string[] : [],
      cta: t('pricing.business.cta'),
      popular: false,
    },
  ]

  const handleSelectPlan = async (planId: string, priceId: string | null) => {
    if (!priceId) {
      router.push(`/${locale}/dashboard`)
      return
    }

    setLoading(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planId }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout 생성 실패')
      }
    } catch (error) {
      console.error('Checkout 오류:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            {t('landing.pricing.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        {/* 요금제 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-indigo-600 shadow-2xl scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold rounded-full flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{t('pricing.pro.popular')}</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== t('pricing.free.price') && (
                    <span className="text-muted-foreground">/{locale === 'ko' ? '월' : locale === 'ja' ? '月' : locale === 'es' ? 'mes' : 'month'}</span>
                  )}
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  disabled={loading === plan.id}
                  onClick={() => handleSelectPlan(plan.id, plan.priceId || null)}
                >
                  {loading === plan.id ? (locale === 'ko' ? '처리 중...' : locale === 'ja' ? '処理中...' : locale === 'es' ? 'Procesando...' : 'Processing...') : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ 섹션 */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('faq.title')}
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('faq.q1')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('faq.a1')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('faq.q2')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('faq.a2')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('faq.q3')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('faq.a3')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}