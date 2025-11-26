"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Volume2, RotateCcw, CheckCircle2, AlertCircle, Loader2, Coins, Clock, ShoppingBag, Languages } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addPracticeTime, getUserCoins } from "@/lib/coins-system"
import { CoinExplosion } from "@/components/coin-explosion"
import { useLocale } from "@/hooks/use-locale"
import Link from "next/link"

interface PracticeItem {
  id: string
  text: string
  phonetic: string
  translation: string
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface EvaluationResult {
  score: number
  feedback: string[]
  improvements: string[]
  accuracy: number
  fluency: number
  pronunciation: number
}

// 练习材料
const practiceItems: PracticeItem[] = [
  {
    id: "1",
    text: "Hello, how are you today?",
    phonetic: "/həˈləʊ haʊ ɑː juː təˈdeɪ/",
    translation: "你好，你今天怎么样？",
    difficulty: "easy",
    category: "greeting",
  },
  {
    id: "2",
    text: "I enjoy learning English very much.",
    phonetic: "/aɪ ɪnˈdʒɔɪ ˈlɜːnɪŋ ˈɪŋɡlɪʃ ˈveri mʌtʃ/",
    translation: "我非常喜欢学英语。",
    difficulty: "medium",
    category: "daily",
  },
  {
    id: "3",
    text: "The weather is beautiful this morning.",
    phonetic: "/ðə ˈweðə ɪz ˈbjuːtɪfl ðɪs ˈmɔːnɪŋ/",
    translation: "今天早上天气很好。",
    difficulty: "medium",
    category: "daily",
  },
  {
    id: "4",
    text: "Pronunciation practice is essential for language learning.",
    phonetic: "/prəˌnʌnsiˈeɪʃn ˈpræktɪs ɪz ɪˈsenʃl fɔː ˈlæŋɡwɪdʒ ˈlɜːnɪŋ/",
    translation: "发音练习对语言学习至关重要。",
    difficulty: "hard",
    category: "academic",
  },
]

export function PronunciationPractice() {
  const [currentItem, setCurrentItem] = useState<PracticeItem>(practiceItems[0])
  const [isRecording, setIsRecording] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [recordedText, setRecordedText] = useState("")
  const [practiceMode, setPracticeMode] = useState<"word" | "sentence" | "passage">("sentence")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null)
  const [currentSessionTime, setCurrentSessionTime] = useState(0)
  const [showExplosion, setShowExplosion] = useState(false)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [userCoins, setUserCoins] = useState(getUserCoins())

  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

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
        console.error("[v0] Speech recognition error:", event.error)
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
      console.error("[v0] Recording start error:", error)
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
      console.error("[v0] Evaluation error:", error)
    } finally {
      setIsEvaluating(false)
    }
  }

  const playReference = () => {
    const utterance = new SpeechSynthesisUtterance(currentItem.text)
    utterance.lang = "en-US"
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const nextItem = () => {
    const currentIndex = practiceItems.indexOf(currentItem)
    const nextIndex = (currentIndex + 1) % practiceItems.length
    setCurrentItem(practiceItems[nextIndex])
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

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">智能发音评测</CardTitle>
              <CardDescription>AI驱动的实时发音分析，帮助你说出标准英语</CardDescription>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Coins className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-600">{userCoins.total}</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-400 to-yellow-400 text-white p-4 rounded-2xl">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">今日口语练习进度</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{Math.floor(userCoins.dailyPracticeTime)}</p>
                  <p className="text-muted-foreground">/ 30 分钟</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto md:min-w-[300px] space-y-2">
              <Progress value={(userCoins.dailyPracticeTime / 30) * 100} className="h-3" />
              {userCoins.earnedToday > 0 ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>今日已完成！获得 {userCoins.earnedToday} 金币</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center md:text-right">
                  还需 {Math.max(0, Math.ceil(30 - userCoins.dailyPracticeTime))} 分钟可获得 100 金币
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
          <AlertDescription>需要麦克风权限才能使用发音评测功能。请在浏览器设置中允许麦克风访问。</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Practice Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentItem.difficulty)}>
                  {currentItem.difficulty.toUpperCase()}
                </Badge>
                <Badge variant="outline">{currentItem.category}</Badge>
                {practiceStartTime && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(currentSessionTime)}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={nextItem}>
                下一题
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reference Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">请朗读以下内容</h3>
                <Button variant="outline" size="sm" onClick={playReference}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  听示范
                </Button>
              </div>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 space-y-3">
                <p className="text-2xl font-semibold text-primary leading-relaxed">{currentItem.text}</p>
                <code className="text-sm text-muted-foreground block">{currentItem.phonetic}</code>
                <p className="text-muted-foreground">{currentItem.translation}</p>
              </div>
            </div>

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
                    <span className="text-xs mt-1">停止</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Mic className="h-8 w-8" />
                    <span className="text-xs mt-1">开始</span>
                  </div>
                )}
              </Button>

              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  正在录音...
                </Badge>
              )}

              {isEvaluating && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI正在评测中...</span>
                </div>
              )}
            </div>

            {/* Recorded Text */}
            {recordedText && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">你的发音识别结果：</h4>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-lg">{recordedText}</p>
                </div>
              </div>
            )}

            {/* Evaluation Result */}
            {result && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">评测结果</h3>
                  <Button variant="ghost" size="sm" onClick={resetPractice}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重新练习
                  </Button>
                </div>

                {/* Overall Score */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">综合得分</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
                      <p className="text-sm text-muted-foreground">/ 100</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">准确度</p>
                      <p className="text-2xl font-bold">{result.accuracy}</p>
                      <Progress value={result.accuracy} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">流畅度</p>
                      <p className="text-2xl font-bold">{result.fluency}</p>
                      <Progress value={result.fluency} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">发音</p>
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
                      做得好
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
                      改进建议
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
              <CardTitle className="text-lg">金币奖励</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
                <Coins className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">每日任务</p>
                  <p className="text-muted-foreground">完成30分钟口语练习即可爆100金币！金币可在商城兑换礼物。</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  查看礼物商城
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">练习提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. 先点击"听示范"熟悉发音</p>
              <p>2. 点击麦克风按钮开始录音</p>
              <p>3. 清晰、自然地朗读句子</p>
              <p>4. 再次点击停止录音</p>
              <p>5. 查看AI评测结果和建议</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">评分标准</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>优秀</span>
                  <span className="text-green-600 font-semibold">90-100</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>良好</span>
                  <span className="text-yellow-600 font-semibold">70-89</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>需改进</span>
                  <span className="text-red-600 font-semibold">0-69</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">练习建议</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• 每天练习15-20分钟</p>
              <p>• 从简单句子开始</p>
              <p>• 注意单词重音和语调</p>
              <p>• 模仿标准发音</p>
              <p>• 反复练习难点部分</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
