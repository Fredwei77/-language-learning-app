"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, Volume2, BookOpen, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocale } from "@/hooks/use-locale"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  corrections?: string[]
}

export function AIChatInterface() {
  const { t } = useLocale()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [scenario, setScenario] = useState("daily")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const scenarios = [
    { id: "daily", label: t.aiChat.scenarios.daily, prompt: t.aiChat.scenarioPrompts.daily },
    { id: "school", label: t.aiChat.scenarios.school, prompt: t.aiChat.scenarioPrompts.school },
    { id: "shopping", label: t.aiChat.scenarios.shopping, prompt: t.aiChat.scenarioPrompts.shopping },
    { id: "travel", label: t.aiChat.scenarios.travel, prompt: t.aiChat.scenarioPrompts.travel },
    { id: "business", label: t.aiChat.scenarios.business, prompt: t.aiChat.scenarioPrompts.business },
  ]

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // 准备发送给 API 的消息（移除 timestamp 字段）
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          scenario: scenarios.find((s) => s.id === scenario)?.prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("AI chat API error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      // API 返回格式是 { data: { message, corrections } }
      if (!data.data || !data.data.message) {
        console.error("Invalid response data:", data)
        throw new Error("Invalid response from AI")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.data.message,
        corrections: data.data.corrections,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI chat error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: `${t.aiChat.error}${error instanceof Error ? error.message : t.aiChat.retryLater}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const playMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const startNewConversation = () => {
    setMessages([])
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t.aiChat.pageTitle}
          </CardTitle>
          <CardDescription>{t.aiChat.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={scenario} onValueChange={setScenario}>
            <TabsList className="grid w-full grid-cols-5">
              {scenarios.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.aiChat.chatArea.title}</CardTitle>
              <CardDescription>{t.aiChat.chatArea.subtitle}</CardDescription>
            </div>
            <Button variant="outline" onClick={startNewConversation}>
              {t.aiChat.chatArea.newConversation}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t.aiChat.chatArea.emptyTitle}</p>
                  <p className="text-sm mt-2">{t.aiChat.chatArea.emptySubtitle}</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
                  >
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {msg.role === "assistant" && (
                      <Button size="sm" variant="ghost" onClick={() => playMessage(msg.content)}>
                        <Volume2 className="h-4 w-4 mr-1" />
                        {t.aiChat.chatArea.readAloud}
                      </Button>
                    )}

                    {msg.corrections && msg.corrections.length > 0 && (
                      <div className="bg-accent/30 border border-accent rounded-lg p-3 space-y-1 w-full">
                        <p className="text-sm font-semibold text-accent-foreground">{t.aiChat.chatArea.correction}：</p>
                        {msg.corrections.map((correction, cidx) => (
                          <p key={cidx} className="text-sm text-accent-foreground">
                            • {correction}
                          </p>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Textarea
                placeholder={t.aiChat.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} size="lg">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t.aiChat.chatArea.enterHint}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Badge className="w-fit mb-2">{t.aiChat.tips.tip1.badge}</Badge>
            <CardTitle className="text-lg">{t.aiChat.tips.tip1.title}</CardTitle>
            <CardDescription>{t.aiChat.tips.tip1.desc}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge className="w-fit mb-2">{t.aiChat.tips.tip2.badge}</Badge>
            <CardTitle className="text-lg">{t.aiChat.tips.tip2.title}</CardTitle>
            <CardDescription>{t.aiChat.tips.tip2.desc}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge className="w-fit mb-2">{t.aiChat.tips.tip3.badge}</Badge>
            <CardTitle className="text-lg">{t.aiChat.tips.tip3.title}</CardTitle>
            <CardDescription>{t.aiChat.tips.tip3.desc}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
