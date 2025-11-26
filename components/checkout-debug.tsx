"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function CheckoutDebug({ packageId }: { packageId: string }) {
  const [iframeHeight, setIframeHeight] = useState<number>(0)
  const startCheckoutSessionForPackage = useCallback(() => startCheckoutSession(packageId), [packageId])

  useEffect(() => {
    // 监听 iframe 高度变化
    const checkIframeHeight = () => {
      const iframe = document.querySelector("#checkout iframe") as HTMLIFrameElement
      if (iframe) {
        const height = iframe.offsetHeight
        setIframeHeight(height)
        console.log("Stripe iframe height:", height)
      }
    }

    const interval = setInterval(checkIframeHeight, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!stripePromise) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>支付功能未配置</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>请在 .env.local 文件中添加 Stripe 配置：</p>
            <code className="block bg-muted p-2 rounded text-xs">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>📚 查看配置指南：</p>
          <Button variant="outline" size="sm" asChild>
            <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              获取 Stripe API 密钥
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 调试信息 */}
      {process.env.NODE_ENV === "development" && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>调试信息</AlertTitle>
          <AlertDescription>
            <p className="text-sm">
              Stripe iframe 当前高度: <strong>{iframeHeight}px</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              如果内容被截断，请增加 min-height 值
            </p>
          </AlertDescription>
        </Alert>
      )}

      <style jsx global>{`
        /* Stripe Checkout iframe 完整显示优化 */
        #checkout-debug {
          width: 100% !important;
          min-height: 1000px !important;
          overflow: visible !important;
        }
        
        #checkout-debug iframe {
          width: 100% !important;
          min-height: 1000px !important;
          height: auto !important;
          max-height: none !important;
          border: none !important;
          overflow: visible !important;
        }
        
        /* 移动端优化 */
        @media (max-width: 640px) {
          #checkout-debug {
            min-height: 950px !important;
          }
          
          #checkout-debug iframe {
            min-height: 950px !important;
          }
        }
      `}</style>
      <div id="checkout-debug" className="w-full">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForPackage }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </>
  )
}
