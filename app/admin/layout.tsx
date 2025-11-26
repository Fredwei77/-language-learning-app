// 强制 admin 路由下的所有页面动态渲染
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
