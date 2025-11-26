"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Checkout from "@/components/checkout"
import { useLocale } from "@/hooks/use-locale"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageId: string | null
}

export function PaymentDialog({ open, onOpenChange, packageId }: PaymentDialogProps) {
  const { t, locale } = useLocale()
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={locale}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">{t.payment.title}</DialogTitle>
          <DialogDescription className="text-sm">{t.payment.subtitle}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="px-4 sm:px-6 py-4 pb-6">
            {packageId && <Checkout packageId={packageId} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
