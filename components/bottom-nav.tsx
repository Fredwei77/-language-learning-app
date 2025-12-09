"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookMarked, MessageSquare, BookOpen, User, ShoppingBag } from "lucide-react"

const navItems = [
  { href: "/dictionary", label: "词典", icon: BookMarked },
  { href: "/ai-chat", label: "AI学习", icon: MessageSquare },
  { href: "/textbooks", label: "课文", icon: BookOpen },
  { href: "/shop", label: "商城", icon: ShoppingBag },
  { href: "/profile", label: "我的", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
