"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Volume2, RotateCcw, CheckCircle2, AlertCircle, Loader2, Coins, Clock, ShoppingBag, Filter, Shuffle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addPracticeTime, getUserCoins } from "@/lib/coins-system"
import { CoinExplosion } from "@/components/coin-explosion"
import { useLocale } from "@/hooks/use-locale"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { speak, preloadVoices } from "@/lib/speech-utils"
import Link from "next/link"
import {
  type PracticeItem,
  getAllPracticeItems,
  getPracticeItemsByType,
  getPracticeItemsByDifficulty,
  getPracticeItemsByCategory,
  getRandomPracticeItem,
  categories,
} from "@/lib/pronunciation-data"

interface EvaluationResult {
  score: number
  feedback: string[]
  improvements: string[]
  accuracy: number
  fluency: number
  pronunciation: number
}

export function PronunciationPracticeI18n() {
  const { t } = useLocale()
  const [practiceType, setPracticeType] = useState<PracticeItem["type"]>("sentence")
  const [difficulty, setDifficulty] = useState<PracticeItem["difficulty"] | "all">("all")
  const [category, setCategory] = useState<string>("all")
  const [availableItems, setAvailableItems] = useState<PracticeItem[]>([])
  const [currentItem, setCurrentItem] = useState<PracticeItem | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [recordedText, setRecordedText] = useState("")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null)
  const [currentSessionTime, setCurrentSessionTime] = useState(0)
  const [showExplosion, setShowExplosion] = useState(false)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [userCoins, setUserCoins] = useState(getUserCoins())

  const recognitionRef = useRef<any>(null)

  // 更新可用的练习材料
  useEffect(() => {
    let items = getPracticeItemsByType(practiceType)
    
    if (difficulty !== "all") {
      items = items.filter((item) => item.difficulty === difficulty)
    }
    
    if (category !== "all") {
      items = items.filter((item) => item.category === category)
    }
    
    setAvailableItems(items)
    
    // 设置第一个项目
    if (items.length > 0 && !currentItem) {
      setCurrentItem(items[0])
    }
  }, [practiceType, difficulty, category])

  // 初始化当前项目
  useEffect(() => {
    if (!currentItem && availableItems.length > 0) {
      setCurrentItem(availableItems[0])
    }
  }, [availableItems])

  useEffect(() => {
    // 检查浏览器支持
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setRecordedText(transcript)
        handleEvaluation(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }

    // 请求麦克风权限
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (practiceStartTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - practiceStartTime) / 1000
        setCurrentSessionTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [practiceStartTime])

  const startRecording = async () => {
    try {
      setRecordedText("")
      setResult(null)
      setIsRecording(true)

      // 启动练习计时
      if (!practiceStartTime) {
        setPracticeStartTime(Date.now())
      }

      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error("Recording start error:", error)
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)

    // 保存练习时长
    if (practiceStartTime) {
      const sessionSeconds = (Date.now() - practiceStartTime) / 1000
      const result = addPracticeTime(sessionSeconds)
      setUserCoins(result.coins)

      // 如果可以爆金币，显示动画
      if (result.canExplode) {
        setEarnedCoins(result.earnedCoins)
        setShowExplosion(true)
      }

      setPracticeStartTime(Date.now()) // 重新开始计时
    }
  }

  const handleEvaluation = async (transcript: string) => {
    if (!currentItem) return
    setIsEvaluating(true)

    try {
      const response = await fetch("/api/pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: currentItem.text,
          spoken: transcript,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      // API 返回格式是 { data: { result } }
      setResult(data.data?.result || data.result)
    } catch (error) {
      console.error("Evaluation error:", error)
    } finally {
      setIsEvaluating(false)
    }
  }

  const [isPlayingReference, setIsPlayingReference] = useState(false)

  // 预加载语音列表（Chrome 需要）
  useEffect(() => {
    preloadVoices()
  }, [])

  const playReference = async () => {
    if (!currentItem || isPlayingReference) return
    
    try {
      setIsPlayingReference(true)
      await speak(currentItem.text, { lang: "en-US", rate: 0.8 })
    } catch (error) {
      console.error("Speech error:", error)
    } finally {
      setIsPlayingReference(false)
    }
  }

  const nextItem = () => {
    if (!currentItem || availableItems.length === 0) return
    
    const currentIndex = availableItems.findIndex((item) => item.id === currentItem.id)
    const nextIndex = (currentIndex + 1) % availableItems.length
    setCurrentItem(availableItems[nextIndex])
    setResult(null)
    setRecordedText("")
  }

  const randomItem = () => {
    const filters: any = { type: practiceType }
    if (difficulty !== "all") filters.difficulty = difficulty
    if (category !== "all") filters.category = category
    
    const item = getRandomPracticeItem(filters)
    setCurrentItem(item)
    setResult(null)
    setRecordedText("")
  }

  const resetPractice = () => {
    setResult(null)
    setRecordedText("")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <CoinExplosion isOpen={showExplosion} onClose={() => setShowExplosion(false)} amount={earnedCoins} />

      {/* Header with Language Switcher */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{t.pronunciation.title}</CardTitle>
              <CardDescription>{t.pronunciation.aiPowered}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/shop">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Coins className="h-5 w-5 text-orange-500" />
                  <span className="font-bold text-orange-600">{userCoins.total}</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Practice Progress Card */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white p-4 rounded-2xl">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.pronunciation.practiceProgress}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{Math.floor(userCoins.dailyPracticeTime)}</p>
                  <p className="text-muted-foreground">/ 30 {t.pronunciation.minutes}</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto md:min-w-[300px] space-y-2">
              <Progress value={(userCoins.dailyPracticeTime / 30) * 100} className="h-3" />
              {userCoins.earnedToday > 0 ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {t.pronunciation.completedToday} {userCoins.earnedToday} {t.coins.balance}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center md:text-right">
                  {t.pronunciation.needMore} {Math.max(0, Math.ceil(30 - userCoins.dailyPracticeTime))}{" "}
                  {t.pronunciation.canEarn} 100 {t.coins.balance}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Check */}
      {hasPermission === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t.pronunciation.micPermission}</AlertDescription>
        </Alert>
      )}

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">{t.pronunciation.filter.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Practice Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.pronunciation.filter.type}</label>
              <Select value={practiceType} onValueChange={(value: any) => setPracticeType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word">{t.pronunciation.types.word} ({getPracticeItemsByType("word").length})</SelectItem>
                  <SelectItem value="phrase">{t.pronunciation.types.phrase} ({getPracticeItemsByType("phrase").length})</SelectItem>
                  <SelectItem value="sentence">{t.pronunciation.types.sentence} ({getPracticeItemsByType("sentence").length})</SelectItem>
                  <SelectItem value="passage">{t.pronunciation.types.passage} ({getPracticeItemsByType("passage").length})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.pronunciation.filter.difficulty}</label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.common.all}</SelectItem>
                  <SelectItem value="easy">{t.pronunciation.difficulty.easy}</SelectItem>
                  <SelectItem value="medium">{t.pronunciation.difficulty.medium}</SelectItem>
                  <SelectItem value="hard">{t.pronunciation.difficulty.hard}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.pronunciation.filter.category}</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.pronunciation.filter.allThemes}</SelectItem>
                  {Object.entries(categories).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      {cat.icon} {t.pronunciation.categories[key as keyof typeof t.pronunciation.categories] || cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Random Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.pronunciation.filter.quickSelect}</label>
              <Button variant="outline" className="w-full" onClick={randomItem}>
                <Shuffle className="h-4 w-4 mr-2" />
                {t.pronunciation.filter.random}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{t.pronunciation.filter.currentBank}：{availableItems.length} {t.pronunciation.filter.questions}</span>
            {currentItem && (
              <span>
                {t.pronunciation.filter.progress}：{availableItems.findIndex((item) => item.id === currentItem.id) + 1} / {availableItems.length}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Practice Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentItem && (
                  <>
                    <Badge className={getDifficultyColor(currentItem.difficulty)}>
                      {t.pronunciation.difficulty[currentItem.difficulty].toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {categories[currentItem.category as keyof typeof categories]?.icon}{" "}
                      {categories[currentItem.category as keyof typeof categories]?.name || currentItem.category}
                    </Badge>
                    <Badge variant="secondary">{t.pronunciation.types[currentItem.type]}</Badge>
                  </>
                )}
                {practiceStartTime && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(currentSessionTime)}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={randomItem}>
                  <Shuffle className="h-4 w-4 mr-1" />
                  {t.pronunciation.filter.random}
                </Button>
                <Button variant="ghost" size="sm" onClick={nextItem}>
                  {t.pronunciation.nextQuestion}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!currentItem ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t.pronunciation.filter.noResults}</p>
                <p className="text-sm mt-2">{t.pronunciation.filter.adjustFilters}</p>
              </div>
            ) : (
              <>
                {/* Reference Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{t.pronunciation.readAloud}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={playReference}
                      disabled={isPlayingReference}
                    >
                      <Volume2 className={`h-4 w-4 mr-2 ${isPlayingReference ? 'animate-pulse' : ''}`} />
                      {t.pronunciation.listenDemo}
                    </Button>
                  </div>

                  <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-3">
                    <p className={`font-semibold text-primary leading-relaxed ${currentItem.type === "passage" ? "text-lg" : "text-2xl"}`}>
                      {currentItem.text}
                    </p>
                    <code className="text-sm text-muted-foreground block">{currentItem.phonetic}</code>
                    <p className="text-muted-foreground">{currentItem.translation}</p>
                  </div>

                  {/* 练习提示 */}
                  {currentItem.tips && currentItem.tips.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {t.pronunciation.practiceTips}
                      </h4>
                      <ul className="space-y-1">
                        {currentItem.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Recording Controls */}
            <div className="flex flex-col items-center gap-4 py-6">
              <Button
                size="lg"
                className="h-24 w-24 rounded-full"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={hasPermission === false || isEvaluating}
              >
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <Mic className="h-8 w-8 animate-pulse" />
                    <span className="text-xs mt-1">{t.pronunciation.stopRecording}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Mic className="h-8 w-8" />
                    <span className="text-xs mt-1">{t.pronunciation.startRecording}</span>
                  </div>
                )}
              </Button>

              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  {t.pronunciation.recording}
                </Badge>
              )}

              {isEvaluating && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{t.pronunciation.evaluating}</span>
                </div>
              )}
            </div>

            {/* Recorded Text */}
            {recordedText && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">{t.pronunciation.yourResult}</h4>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-lg">{recordedText}</p>
                </div>
              </div>
            )}

            {/* Evaluation Result */}
            {result && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t.pronunciation.evaluationResult}</h3>
                  <Button variant="ghost" size="sm" onClick={resetPractice}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.pronunciation.retryPractice}
                  </Button>
                </div>

                {/* Overall Score */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">{t.pronunciation.overallScore}</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
                      <p className="text-sm text-muted-foreground">/ 100</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">{t.pronunciation.accuracy}</p>
                      <p className="text-2xl font-bold">{result.accuracy}</p>
                      <Progress value={result.accuracy} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">{t.pronunciation.fluency}</p>
                      <p className="text-2xl font-bold">{result.fluency}</p>
                      <Progress value={result.fluency} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">{t.pronunciation.pronunciation}</p>
                      <p className="text-2xl font-bold">{result.pronunciation}</p>
                      <Progress value={result.pronunciation} className="h-2" />
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback */}
                {result.feedback.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      {t.pronunciation.feedback}
                    </h4>
                    <ul className="space-y-1">
                      {result.feedback.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      {t.pronunciation.improvements}
                    </h4>
                    <ul className="space-y-1">
                      {result.improvements.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-yellow-600 mt-0.5">!</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Practice Guide */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.pronunciation.coinReward}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                <Coins className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">{t.pronunciation.dailyTask}</p>
                  <p className="text-muted-foreground">{t.pronunciation.dailyTaskDesc}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t.pronunciation.viewShop}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.pronunciation.practiceTips}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. {t.pronunciation.tip1}</p>
              <p>2. {t.pronunciation.tip2}</p>
              <p>3. {t.pronunciation.tip3}</p>
              <p>4. {t.pronunciation.tip4}</p>
              <p>5. {t.pronunciation.tip5}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.pronunciation.scoringCriteria}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t.pronunciation.excellent}</span>
                  <span className="text-green-600 font-semibold">90-100</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t.pronunciation.good}</span>
                  <span className="text-yellow-600 font-semibold">70-89</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t.pronunciation.needsImprovement}</span>
                  <span className="text-red-600 font-semibold">0-69</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.pronunciation.practiceSuggestions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• {t.pronunciation.suggestion1}</p>
              <p>• {t.pronunciation.suggestion2}</p>
              <p>• {t.pronunciation.suggestion3}</p>
              <p>• {t.pronunciation.suggestion4}</p>
              <p>• {t.pronunciation.suggestion5}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
