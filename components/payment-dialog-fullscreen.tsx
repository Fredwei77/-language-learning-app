"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Checkout from "@/components/checkout"
import { useLocale } from "@/hooks/use-locale"

interface PaymentDialogFullscreenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageId: string | null
}

export function PaymentDialogFullscreen({ open, onOpenChange, packageId }: PaymentDialogFullscreenProps) {
  const { t, locale } = useLocale()
  
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background" key={locale}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">{t.payment.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">{t.payment.subtitle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">{t.common.close}</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto max-w-2xl px-4 py-6 pb-12">
          {packageId && <Checkout packageId={packageId} />}
        </div>
        {/* 额外的底部空间，确保内容完整显示 */}
        <div className="h-20" />
      </div>
    </div>
  )
}
