"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface CoinExplosionProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}

export function CoinExplosion({ isOpen, onClose, amount }: CoinExplosionProps) {
  const [showCoins, setShowCoins] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowCoins(true)
      // 触发五彩纸屑效果
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FFD700", "#FFA500", "#FF6347"],
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FFD700", "#FFA500", "#FF6347"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    } else {
      setShowCoins(false)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-12 shadow-2xl max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 闪光效果 */}
            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse" />

            {/* 主内容 */}
            <div className="relative z-10 text-center space-y-6">
              {/* 金币图标动画 */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Coins className="h-24 w-24 text-white drop-shadow-lg" />
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="h-32 w-32 text-yellow-200" />
                  </motion.div>
                </div>
              </motion.div>

              {/* 祝贺文字 */}
              <div className="space-y-3">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white drop-shadow-lg"
                >
                  恭喜爆金币！
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/90 text-lg"
                >
                  完成今日30分钟口语练习
                </motion.p>
              </div>

              {/* 金币数量显示 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", damping: 10 }}
                className="bg-white/30 backdrop-blur-sm rounded-2xl p-6"
              >
                <p className="text-white/80 text-sm mb-2">获得金币</p>
                <motion.p
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                  className="text-6xl font-bold text-white drop-shadow-lg"
                >
                  +{amount}
                </motion.p>
              </motion.div>

              {/* 飘落的金币动画 */}
              {showCoins && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        y: -100,
                        x: Math.random() * 400 - 200,
                        rotate: 0,
                        opacity: 1,
                      }}
                      animate={{
                        y: 600,
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                        opacity: 0,
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 1.5,
                        ease: "easeIn",
                      }}
                      className="absolute"
                    >
                      <Coins className="h-6 w-6 text-yellow-300" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 继续按钮 */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Button
                  size="lg"
                  onClick={onClose}
                  className="bg-white text-orange-600 hover:bg-white/90 font-bold text-lg px-8 shadow-lg"
                >
                  继续加油！
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
