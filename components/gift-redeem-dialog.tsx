"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

interface ShippingInfo {
  name: string
  phone: string
  address: string
  notes?: string
}

interface GiftRedeemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  giftName: string
  giftCoins: number
  onConfirm: (shippingInfo: ShippingInfo) => Promise<void>
}

export function GiftRedeemDialog({ open, onOpenChange, giftName, giftCoins, onConfirm }: GiftRedeemDialogProps) {
  const { t } = useLocale()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ShippingInfo>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirm(formData)
      setFormData({ name: "", phone: "", address: "", notes: "" })
      onOpenChange(false)
    } catch (error) {
      console.error("Redeem error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.shop.redeemDialog?.title || "填写收货信息"}</DialogTitle>
          <DialogDescription>
            {t.shop.redeemDialog?.description || `兑换 ${giftName}（${giftCoins} 金币）`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.shop.redeemDialog?.name || "收货人姓名"} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.shop.redeemDialog?.namePlaceholder || "请输入姓名"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t.shop.redeemDialog?.phone || "联系电话"} *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t.shop.redeemDialog?.phonePlaceholder || "请输入手机号"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t.shop.redeemDialog?.address || "收货地址"} *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.shop.redeemDialog?.addressPlaceholder || "请输入详细地址"}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t.shop.redeemDialog?.notes || "备注"}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.shop.redeemDialog?.notesPlaceholder || "选填，如有特殊要求请备注"}
              rows={2}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.common.confirm}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
