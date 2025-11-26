export interface CoinPackage {
  id: string
  name: string
  description: string
  coins: number
  priceInCents: number
  bonus?: number
  popular?: boolean
}

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "coins-100",
    name: "100金币",
    description: "入门金币包",
    coins: 100,
    priceInCents: 600, // ¥6
  },
  {
    id: "coins-500",
    name: "500金币",
    description: "常规金币包",
    coins: 500,
    bonus: 50,
    priceInCents: 2500, // ¥25
  },
  {
    id: "coins-1000",
    name: "1000金币",
    description: "热门金币包",
    coins: 1000,
    bonus: 150,
    priceInCents: 4500, // ¥45
    popular: true,
  },
  {
    id: "coins-3000",
    name: "3000金币",
    description: "超值金币包",
    coins: 3000,
    bonus: 600,
    priceInCents: 12000, // ¥120
  },
]
