"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  BookOpen,
  MessageSquare,
  Mic,
  BookMarked,
  Volume2,
  ShoppingBag,
  Menu,
  X,
  Trophy,
  LineChart,
  User,
} from "lucide-react"

const navItems = [
  { href: "/dictionary", label: "词典", icon: BookMarked },
  { href: "/ai-chat", label: "AI学习", icon: MessageSquare },
  { href: "/textbooks", label: "课文", icon: BookOpen },
  { href: "/cantonese", label: "粤语", icon: Volume2 },
  { href: "/pronunciation", label: "发音", icon: Mic },
  { href: "/shop", label: "礼物商城", icon: ShoppingBag },
  { href: "/leaderboard", label: "排行榜", icon: Trophy },
  { href: "/progress", label: "学习统计", icon: LineChart },
  { href: "/profile", label: "个人中心", icon: User },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">导航菜单</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-bold">智学语言</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
