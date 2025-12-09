"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

// 检查环境变量是否配置
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function Checkout({ packageId }: { packageId: string }) {
  const { t, locale } = useLocale()
  const startCheckoutSessionForPackage = useCallback(() => startCheckoutSession(packageId, locale), [packageId, locale])

  // 如果没有配置 Stripe，显示配置提示
  if (!stripePromise) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.payment.notConfigured}</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{t.payment.configureStripe}</p>
            <code className="block bg-muted p-2 rounded text-xs">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>📚 {t.payment.viewGuide}</p>
          <Button variant="outline" size="sm" asChild>
            <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t.payment.getApiKey}
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        /* Stripe Checkout iframe 完整显示优化 */
        #checkout {
          width: 100% !important;
          min-height: 900px !important;
          overflow: visible !important;
        }
        
        #checkout iframe {
          width: 100% !important;
          min-height: 900px !important;
          height: auto !important;
          max-height: none !important;
          border: none !important;
          overflow: visible !important;
        }
        
        /* 移动端优化 */
        @media (max-width: 640px) {
          #checkout {
            min-height: 850px !important;
          }
          
          #checkout iframe {
            min-height: 850px !important;
          }
        }
        
        /* 小屏幕优化 */
        @media (max-width: 480px) {
          #checkout {
            min-height: 800px !important;
          }
          
          #checkout iframe {
            min-height: 800px !important;
          }
        }
      `}</style>
      <div id="checkout" className="w-full">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForPackage }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </>
  )
}
