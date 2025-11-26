/**
 * 性能监控工具
 */

// 性能指标类型
export interface PerformanceMetric {
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  timestamp: number
}

// Web Vitals 阈值
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
}

/**
 * 获取性能评级
 */
function getRating(value: number, thresholds: { good: number; poor: number }): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good"
  if (value <= thresholds.poor) return "needs-improvement"
  return "poor"
}

/**
 * 记录性能指标
 */
export function reportMetric(metric: PerformanceMetric) {
  // 开发环境：打印到控制台
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
    })
  }

  // 生产环境：发送到分析服务
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    // 可以集成 Google Analytics, Vercel Analytics 等
    if (window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      })
    }
  }
}

/**
 * 监听 Web Vitals
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
    const value = lastEntry.renderTime || lastEntry.loadTime || 0

    reportMetric({
      name: "LCP",
      value,
      rating: getRating(value, THRESHOLDS.LCP),
      timestamp: Date.now(),
    })
  })

  try {
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      const value = entry.processingStart - entry.startTime

      reportMetric({
        name: "FID",
        value,
        rating: getRating(value, THRESHOLDS.FID),
        timestamp: Date.now(),
      })
    })
  })

  try {
    fidObserver.observe({ type: "first-input", buffered: true })
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    })

    reportMetric({
      name: "CLS",
      value: clsValue,
      rating: getRating(clsValue, THRESHOLDS.CLS),
      timestamp: Date.now(),
    })
  })

  try {
    clsObserver.observe({ type: "layout-shift", buffered: true })
  } catch (e) {
    // CLS not supported
  }

  // First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      reportMetric({
        name: "FCP",
        value: entry.startTime,
        rating: getRating(entry.startTime, THRESHOLDS.FCP),
        timestamp: Date.now(),
      })
    })
  })

  try {
    fcpObserver.observe({ type: "paint", buffered: true })
  } catch (e) {
    // FCP not supported
  }

  // Time to First Byte (TTFB)
  const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart

    reportMetric({
      name: "TTFB",
      value: ttfb,
      rating: getRating(ttfb, THRESHOLDS.TTFB),
      timestamp: Date.now(),
    })
  }
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * 测量异步函数执行时间
 */
export async function measurePerformanceAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

// 扩展 Window 类型
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
