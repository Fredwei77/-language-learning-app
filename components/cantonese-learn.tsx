"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, BookOpen, MessageCircle, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocale } from "@/hooks/use-locale"

interface CantonesePhrases {
  category: string
  phrases: Phrase[]
}

interface Phrase {
  cantonese: string
  jyutping: string
  mandarin: string
  english: string
  audio?: string
}

interface CultureTip {
  title: string
  content: string
  icon: string
}

export function CantoneseLearn() {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState("phrases")
  const [selectedCategory, setSelectedCategory] = useState(0)

  // 模拟数据
  const commonPhrases: CantonesePhrases[] = [
    {
      category: t.cantonese.learn.categories.greetings,
      phrases: [
      {
        cantonese: "你好",
        jyutping: "nei5 hou2",
        mandarin: "你好",
        english: "Hello",
      },
      {
        cantonese: "早晨",
        jyutping: "zou2 san4",
        mandarin: "早上好",
        english: "Good morning",
      },
      {
        cantonese: "多谢",
        jyutping: "do1 ze6",
        mandarin: "谢谢",
        english: "Thank you",
      },
      {
        cantonese: "唔该",
        jyutping: "m4 goi1",
        mandarin: "劳驾/谢谢",
        english: "Excuse me / Thank you",
      },
      {
        cantonese: "对唔住",
        jyutping: "deoi3 m4 zyu6",
        mandarin: "对不起",
        english: "Sorry",
      },
    ],
  },
  {
    category: t.cantonese.learn.categories.food,
    phrases: [
      {
        cantonese: "食饭",
        jyutping: "sik6 faan6",
        mandarin: "吃饭",
        english: "Eat / Have a meal",
      },
      {
        cantonese: "饮茶",
        jyutping: "jam2 caa4",
        mandarin: "喝茶 / 吃早茶",
        english: "Drink tea / Have dim sum",
      },
      {
        cantonese: "好味",
        jyutping: "hou2 mei6",
        mandarin: "好吃",
        english: "Delicious",
      },
      {
        cantonese: "埋单",
        jyutping: "maai4 daan1",
        mandarin: "买单 / 结账",
        english: "Check please",
      },
    ],
  },
  {
    category: t.cantonese.learn.categories.shopping,
    phrases: [
      {
        cantonese: "几多钱",
        jyutping: "gei2 do1 cin2",
        mandarin: "多少钱",
        english: "How much?",
      },
      {
        cantonese: "平啲得唔得",
        jyutping: "peng4 di1 dak1 m4 dak1",
        mandarin: "便宜点行吗",
        english: "Can it be cheaper?",
      },
      {
        cantonese: "我要呢个",
        jyutping: "ngo5 jiu3 ni1 go3",
        mandarin: "我要这个",
        english: "I want this one",
      },
    ],
  },
  ]

  const cultureTips: CultureTip[] = [
    {
      title: t.cantonese.learn.culture.teaCulture,
      content: t.cantonese.learn.culture.teaCultureDesc,
      icon: "🍵",
    },
    {
      title: t.cantonese.learn.culture.tones,
      content: t.cantonese.learn.culture.tonesDesc,
      icon: "🎵",
    },
    {
      title: t.cantonese.learn.culture.politeness,
      content: t.cantonese.learn.culture.politenessDesc,
      icon: "🙏",
    },
  ]

  const tones = [
    { number: 1, name: t.cantonese.learn.tones.tone1, example: "诗 (si1)", pitch: t.cantonese.learn.tones.highFlat, color: "bg-red-500" },
    { number: 2, name: t.cantonese.learn.tones.tone2, example: "史 (si2)", pitch: t.cantonese.learn.tones.highRising, color: "bg-orange-500" },
    { number: 3, name: t.cantonese.learn.tones.tone3, example: "试 (si3)", pitch: t.cantonese.learn.tones.midFlat, color: "bg-yellow-500" },
    { number: 4, name: t.cantonese.learn.tones.tone4, example: "时 (si4)", pitch: t.cantonese.learn.tones.lowFalling, color: "bg-green-500" },
    { number: 5, name: t.cantonese.learn.tones.tone5, example: "市 (si5)", pitch: t.cantonese.learn.tones.lowRising, color: "bg-blue-500" },
    { number: 6, name: t.cantonese.learn.tones.tone6, example: "事 (si6)", pitch: t.cantonese.learn.tones.lowFlat, color: "bg-indigo-500" },
  ]

  const playCantonese = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-HK"
    utterance.rate = 0.7
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-chart-4/10 to-chart-4/5">
        <CardHeader>
          <CardTitle className="text-2xl">{t.cantonese.learn.title}</CardTitle>
          <CardDescription>{t.cantonese.learn.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="phrases">{t.cantonese.learn.tabs.phrases}</TabsTrigger>
          <TabsTrigger value="tones">{t.cantonese.learn.tabs.tones}</TabsTrigger>
          <TabsTrigger value="culture">{t.cantonese.learn.tabs.culture}</TabsTrigger>
        </TabsList>

        {/* Phrases Tab */}
        <TabsContent value="phrases" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.cantonese.learn.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commonPhrases.map((category, idx) => (
                    <Button
                      key={idx}
                      variant={selectedCategory === idx ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(idx)}
                    >
                      {category.category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Phrases List */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{commonPhrases[selectedCategory].category}</CardTitle>
                <CardDescription>{t.cantonese.learn.listenTip}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {commonPhrases[selectedCategory].phrases.map((phrase, idx) => (
                      <Card key={idx} className="hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl font-bold text-chart-4">{phrase.cantonese}</span>
                                  <Button size="sm" variant="outline" onClick={() => playCantonese(phrase.cantonese)}>
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <code className="text-sm bg-muted px-3 py-1 rounded inline-block">
                                  {phrase.jyutping}
                                </code>
                              </div>
                            </div>
                            <div className="space-y-1 border-t pt-3">
                              <p className="text-foreground">
                                <span className="text-muted-foreground">{t.cantonese.learn.mandarin}：</span>
                                {phrase.mandarin}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="opacity-70">{t.cantonese.learn.english}：</span>
                                {phrase.english}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tones Tab */}
        <TabsContent value="tones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.cantonese.learn.tones.title}</CardTitle>
              <CardDescription>{t.cantonese.learn.tones.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tones.map((tone) => (
                  <Card key={tone.number} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg ${tone.color} flex items-center justify-center text-white font-bold text-xl`}
                          >
                            {tone.number}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{tone.name}</h3>
                            <p className="text-sm text-muted-foreground">{tone.pitch}</p>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-center text-2xl font-bold mb-2">{tone.example.split(" ")[0]}</p>
                          <code className="text-sm text-center block text-muted-foreground">
                            {tone.example.split(" ")[1]}
                          </code>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => playCantonese(tone.example.split(" ")[0])}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          {t.cantonese.learn.tones.listen}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tone Practice Tip */}
          <Card className="bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                {t.cantonese.learn.tips.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="leading-relaxed">• {t.cantonese.learn.tips.tip1}</p>
              <p className="leading-relaxed">• {t.cantonese.learn.tips.tip2}</p>
              <p className="leading-relaxed">• {t.cantonese.learn.tips.tip3}</p>
              <p className="leading-relaxed">• {t.cantonese.learn.tips.tip4}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Culture Tab */}
        <TabsContent value="culture" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {cultureTips.map((tip, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{tip.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{tip.content}</p>
                </CardContent>
              </Card>
            ))}

            {/* Additional Culture Card */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-4xl">🎭</span>
                  <div>
                    <CardTitle className="text-xl">{t.cantonese.learn.culture.opera}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{t.cantonese.learn.culture.operaDesc}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-4xl">🏮</span>
                  <div>
                    <CardTitle className="text-xl">{t.cantonese.learn.culture.festival}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{t.cantonese.learn.culture.festivalDesc}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-4xl">🌃</span>
                  <div>
                    <CardTitle className="text-xl">{t.cantonese.learn.culture.hongkong}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{t.cantonese.learn.culture.hongkongDesc}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-chart-4 mb-2" />
            <CardTitle className="text-lg">{t.cantonese.learn.quickActions.conversation}</CardTitle>
            <CardDescription>{t.cantonese.learn.quickActions.conversationDesc}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-chart-4 mb-2" />
            <CardTitle className="text-lg">{t.cantonese.learn.quickActions.songs}</CardTitle>
            <CardDescription>{t.cantonese.learn.quickActions.songsDesc}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Volume2 className="h-8 w-8 text-chart-4 mb-2" />
            <CardTitle className="text-lg">{t.cantonese.learn.quickActions.pronunciation}</CardTitle>
            <CardDescription>{t.cantonese.learn.quickActions.pronunciationDesc}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
