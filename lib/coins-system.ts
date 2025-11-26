// 金币系统数据管理（已迁移到数据库，保留接口用于兼容）
export interface UserCoins {
  total: number
  dailyPracticeTime: number // 今日练习时长（分钟）
  lastPracticeDate: string
  earnedToday: number
  history: CoinHistory[]
}

export interface CoinHistory {
  id: string
  amount: number
  reason: string
  timestamp: string
}

// 数据库版本的金币操作
export async function getUserCoinsFromDB(): Promise<UserCoins | null> {
  try {
    const response = await fetch("/api/coins/balance")
    if (!response.ok) return null
    const data = await response.json()
    return {
      total: data.total,
      dailyPracticeTime: data.dailyPracticeTime,
      lastPracticeDate: new Date().toDateString(),
      earnedToday: data.earnedToday,
      history: data.history.map((h: any) => ({
        id: h.id,
        amount: h.amount,
        reason: h.description || "",
        timestamp: h.created_at,
      })),
    }
  } catch {
    return null
  }
}

export async function addPracticeTimeDB(
  seconds: number,
): Promise<{ coins: UserCoins; earnedCoins: number; canExplode: boolean } | null> {
  try {
    const response = await fetch("/api/coins/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seconds }),
    })
    if (!response.ok) return null
    const data = await response.json()

    const coins: UserCoins = {
      total: data.totalCoins,
      dailyPracticeTime: data.dailyPracticeTime,
      lastPracticeDate: new Date().toDateString(),
      earnedToday: data.earnedCoins,
      history: [],
    }

    return {
      coins,
      earnedCoins: data.earnedCoins,
      canExplode: data.canExplode,
    }
  } catch {
    return null
  }
}

export async function redeemGiftDB(
  giftId: string,
  giftName: string,
  giftCoins: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/coins/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftId, giftName, giftCoins }),
    })
    const data = await response.json()
    return {
      success: response.ok && data.success,
      message: data.message || data.error || "兑换失败",
    }
  } catch {
    return { success: false, message: "网络错误，请稍后重试" }
  }
}

export interface Gift {
  id: string
  name: string
  description: string
  coins: number
  image: string
  category: "physical" | "digital" | "privilege"
  stock: number
}

// 礼物商城数据
export const gifts: Gift[] = [
  {
    id: "1",
    name: "实体英语字典",
    description: "牛津高阶英语词典第10版",
    coins: 2000,
    image: "/oxford-dictionary.jpg",
    category: "physical",
    stock: 50,
  },
  {
    id: "2",
    name: "星巴克咖啡券",
    description: "中杯任意咖啡一杯",
    coins: 500,
    image: "/generic-coffee-cup.png",
    category: "physical",
    stock: 100,
  },
  {
    id: "3",
    name: "学习笔记本套装",
    description: "精美笔记本+荧光笔套装",
    coins: 300,
    image: "/notebook-set.png",
    category: "physical",
    stock: 200,
  },
  {
    id: "4",
    name: "AI学习会员",
    description: "30天无限次AI对话学习",
    coins: 800,
    image: "/ai-membership-badge.jpg",
    category: "digital",
    stock: 999,
  },
  {
    id: "5",
    name: "电子证书",
    description: "完成课程电子认证证书",
    coins: 1000,
    image: "/formal-certificate.png",
    category: "digital",
    stock: 999,
  },
  {
    id: "6",
    name: "专属学习徽章",
    description: "展示在个人资料的成就徽章",
    coins: 200,
    image: "/achievement-badge.png",
    category: "digital",
    stock: 999,
  },
  {
    id: "7",
    name: "蓝牙耳机",
    description: "适合练习听力的高品质耳机",
    coins: 1500,
    image: "/bluetooth-earphones.jpg",
    category: "physical",
    stock: 30,
  },
  {
    id: "8",
    name: "学习用品大礼包",
    description: "包含笔、橡皮、便签等全套用品",
    coins: 600,
    image: "/stationery-gift-box.jpg",
    category: "physical",
    stock: 80,
  },
]

// ============================================
// 以下为旧版本 localStorage 实现（已废弃，仅用于向后兼容）
// 新代码请使用上面的数据库版本函数
// ============================================

const STORAGE_KEY = "userCoins"

export function getUserCoins(): UserCoins {
  if (typeof window === "undefined") {
    return getDefaultCoins()
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return getDefaultCoins()
  }

  try {
    return JSON.parse(stored)
  } catch {
    return getDefaultCoins()
  }
}

function getDefaultCoins(): UserCoins {
  return {
    total: 0,
    dailyPracticeTime: 0,
    lastPracticeDate: new Date().toDateString(),
    earnedToday: 0,
    history: [],
  }
}

export function saveUserCoins(coins: UserCoins): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coins))
  }
}

/**
 * @deprecated 使用 addPracticeTimeDB 替代
 */
export function addPracticeTime(seconds: number): { coins: UserCoins; earnedCoins: number; canExplode: boolean } {
  const coins = getUserCoins()
  const today = new Date().toDateString()

  if (coins.lastPracticeDate !== today) {
    coins.dailyPracticeTime = 0
    coins.earnedToday = 0
    coins.lastPracticeDate = today
  }

  const minutesBefore = coins.dailyPracticeTime
  coins.dailyPracticeTime += seconds / 60

  let earnedCoins = 0
  let canExplode = false

  if (minutesBefore < 30 && coins.dailyPracticeTime >= 30 && coins.earnedToday === 0) {
    earnedCoins = 100
    canExplode = true
    coins.total += earnedCoins
    coins.earnedToday = earnedCoins
    coins.history.unshift({
      id: Date.now().toString(),
      amount: earnedCoins,
      reason: "完成每日30分钟口语练习",
      timestamp: new Date().toISOString(),
    })
  }

  saveUserCoins(coins)
  return { coins, earnedCoins, canExplode }
}

/**
 * @deprecated 使用 redeemGiftDB 替代
 */
export function redeemGift(giftId: string): { success: boolean; message: string } {
  const coins = getUserCoins()
  const gift = gifts.find((g) => g.id === giftId)

  if (!gift) {
    return { success: false, message: "礼物不存在" }
  }

  if (gift.stock <= 0) {
    return { success: false, message: "礼物已兑完" }
  }

  if (coins.total < gift.coins) {
    return { success: false, message: `金币不足，还需要 ${gift.coins - coins.total} 金币` }
  }

  coins.total -= gift.coins
  coins.history.unshift({
    id: Date.now().toString(),
    amount: -gift.coins,
    reason: `兑换${gift.name}`,
    timestamp: new Date().toISOString(),
  })

  gift.stock -= 1

  saveUserCoins(coins)
  return { success: true, message: `成功兑换 ${gift.name}！` }
}
