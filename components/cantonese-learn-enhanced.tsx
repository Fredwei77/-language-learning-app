"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, BookOpen, MessageCircle, Star, Lightbulb, Quote } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/hooks/use-locale"
import { speak, preloadVoices } from "@/lib/speech-utils"
import { 
  cantonesePhrasesData, 
  cantoneseIdioms, 
  learningTips, 
  culturalKnowledge 
} from "@/lib/cantonese-data"

export function CantoneseLearnEnhanced() {
  const { t, locale } = useLocale()
  const [activeTab, setActiveTab] = useState("phrases")
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // 预加载语音列表（Chrome 需要）
  useEffect(() => {
    preloadVoices()
  }, [])

  // 使用导入的数据，根据语言选择显示
  const commonPhrases = cantonesePhrasesData.map(cat => ({
    category: locale === 'en' ? cat.categoryEn : cat.category,
    phrases: cat.phrases
  }))

  const cultureTips = culturalKnowledge.map(item => ({
    title: locale === 'en' ? item.titleEn : item.title,
    content: locale === 'en' ? item.contentEn : item.content,
    icon: item.icon,
    tips: locale === 'en' ? item.tipsEn : item.tips,
  }))

  const tones = [
    { number: 1, name: t.cantonese.learn.tones.tone1, example: "诗 (si1)", pitch: t.cantonese.learn.tones.highFlat, color: "bg-red-500" },
    { number: 2, name: t.cantonese.learn.tones.tone2, example: "史 (si2)", pitch: t.cantonese.learn.tones.highRising, color: "bg-orange-500" },
    { number: 3, name: t.cantonese.learn.tones.tone3, example: "试 (si3)", pitch: t.cantonese.learn.tones.midFlat, color: "bg-yellow-500" },
    { number: 4, name: t.cantonese.learn.tones.tone4, example: "时 (si4)", pitch: t.cantonese.learn.tones.lowFalling, color: "bg-green-500" },
    { number: 5, name: t.cantonese.learn.tones.tone5, example: "市 (si5)", pitch: t.cantonese.learn.tones.lowRising, color: "bg-blue-500" },
    { number: 6, name: t.cantonese.learn.tones.tone6, example: "事 (si6)", pitch: t.cantonese.learn.tones.lowFlat, color: "bg-indigo-500" },
  ]

  const playCantonese = async (text: string) => {
    if (isPlaying) return
    
    try {
      setIsPlaying(true)
      await speak(text, { lang: "zh-HK", rate: 0.7 })
    } catch (error) {
      console.error("Speech error:", error)
    } finally {
      setIsPlaying(false)
    }
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="phrases">{t.cantonese.learn.tabs.phrases}</TabsTrigger>
          <TabsTrigger value="tones">{t.cantonese.learn.tabs.tones}</TabsTrigger>
          <TabsTrigger value="culture">{t.cantonese.learn.tabs.culture}</TabsTrigger>
          <TabsTrigger value="idioms">{t.cantonese.learn.tabs.idioms}</TabsTrigger>
          <TabsTrigger value="tips">{t.cantonese.learn.tabs.tips}</TabsTrigger>
        </TabsList>

        {/* Phrases Tab */}
        <TabsContent value="phrases" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.cantonese.learn.category}</CardTitle>
                <CardDescription>{commonPhrases.length} {locale === 'en' ? 'categories' : '个分类'}</CardDescription>
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
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => playCantonese(phrase.cantonese)}
                                    disabled={isPlaying}
                                  >
                                    <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
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
                          disabled={isPlaying}
                        >
                          <Volume2 className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
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
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed text-muted-foreground">{tip.content}</p>
                  {tip.tips && tip.tips.length > 0 && (
                    <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                      <p className="font-semibold text-sm">{locale === 'en' ? 'Tips:' : '小贴士：'}</p>
                      {tip.tips.map((tipItem, tidx) => (
                        <p key={tidx} className="text-sm leading-relaxed">• {tipItem}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Idioms Tab - NEW */}
        <TabsContent value="idioms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-primary" />
                {locale === 'en' ? 'Common Cantonese Idioms & Expressions' : '粤语俗语和常用表达'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Learn authentic Cantonese expressions used in daily life' 
                  : '学习日常生活中地道的粤语表达'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cantoneseIdioms.map((idiom, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-all">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">{idiom.cantonese}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => playCantonese(idiom.cantonese)}
                              disabled={isPlaying}
                            >
                              <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                            </Button>
                          </div>
                          <code className="text-xs bg-muted px-2 py-1 rounded inline-block">
                            {idiom.jyutping}
                          </code>
                        </div>
                      </div>
                      <div className="space-y-2 border-t pt-3">
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t.cantonese.learn.mandarin}：</span>
                          {idiom.mandarin}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="opacity-70">{t.cantonese.learn.english}：</span>
                          {idiom.english}
                        </p>
                        <div className="bg-accent/10 rounded p-3 mt-2">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">{locale === 'en' ? 'Usage:' : '用法：'}</span> {idiom.meaning}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tips Tab - NEW */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                {locale === 'en' ? 'Cantonese Learning Tips' : '粤语学习小贴士'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Effective methods to improve your Cantonese skills' 
                  : '提升粤语水平的有效方法'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {learningTips.map((tip, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-all border-2">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{idx + 1}</span>
                        </div>
                        <CardTitle className="text-lg">
                          {locale === 'en' ? tip.titleEn : tip.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-muted-foreground">
                        {locale === 'en' ? tip.contentEn : tip.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
