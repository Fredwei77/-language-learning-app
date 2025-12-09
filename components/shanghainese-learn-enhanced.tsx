"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Volume2, BookOpen, Award, TrendingUp } from "lucide-react"
import { allVocabulary, vocabularyByCategory } from "@/lib/shanghainese/vocabulary-data"
import { lessons } from "@/lib/shanghainese/lessons-data"

export function ShanghainesesLearnEnhanced() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("greeting")
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)

  const categoryWords = vocabularyByCategory[selectedCategory as keyof typeof vocabularyByCategory] || []
  const currentWord = categoryWords[currentWordIndex]

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      // 播放真实的沪语音频
      const audio = new Audio(audioUrl)
      audio.play().catch(err => {
        console.log("Audio play failed:", err)
        alert("音频文件加载失败，请检查网络连接")
      })
    }
    // 如果没有音频，按钮会被禁用，不会触发这个函数
  }

  const nextWord = () => {
    setShowAnswer(false)
    setCurrentWordIndex((prev) => (prev + 1) % categoryWords.length)
  }

  const previousWord = () => {
    setShowAnswer(false)
    setCurrentWordIndex((prev) => (prev - 1 + categoryWords.length) % categoryWords.length)
  }

  const startLesson = (lessonId: string) => {
    setSelectedLesson(lessonId)
    setCurrentDialogueIndex(0)
  }

  const backToLessons = () => {
    setSelectedLesson(null)
    setCurrentDialogueIndex(0)
  }

  const nextDialogue = () => {
    const lesson = lessons.find(l => l.id === selectedLesson)
    if (lesson && currentDialogueIndex < lesson.dialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1)
    }
  }

  const previousDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(prev => prev - 1)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题区域 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">沪语学习</h1>
          <p className="text-xl text-muted-foreground">
            学习地道的上海话 · Learn Authentic Shanghainese
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总词汇量</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allVocabulary.length}</div>
              <p className="text-xs text-muted-foreground">个常用词汇</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">课程数量</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-muted-foreground">个精品课程</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">学习进度</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">继续加油！</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">掌握词汇</CardTitle>
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">个已掌握</p>
            </CardContent>
          </Card>
        </div>

        {/* 主要学习区域 */}
        <Tabs defaultValue="vocabulary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vocabulary">词汇学习</TabsTrigger>
            <TabsTrigger value="lessons">课程</TabsTrigger>
            <TabsTrigger value="culture">文化</TabsTrigger>
          </TabsList>

          {/* 词汇学习标签页 */}
          <TabsContent value="vocabulary" className="space-y-6">
            {/* 类别选择 */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "greeting" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("greeting")
                  setCurrentWordIndex(0)
                  setShowAnswer(false)
                }}
              >
                问候语
              </Button>
              <Button
                variant={selectedCategory === "family" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("family")
                  setCurrentWordIndex(0)
                  setShowAnswer(false)
                }}
              >
                家庭称谓
              </Button>
              <Button
                variant={selectedCategory === "number" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("number")
                  setCurrentWordIndex(0)
                  setShowAnswer(false)
                }}
              >
                数字
              </Button>
              <Button
                variant={selectedCategory === "food" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("food")
                  setCurrentWordIndex(0)
                  setShowAnswer(false)
                }}
              >
                食物
              </Button>
              <Button
                variant={selectedCategory === "daily" ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory("daily")
                  setCurrentWordIndex(0)
                  setShowAnswer(false)
                }}
              >
                日常用语
              </Button>
            </div>

            {/* 词汇卡片 */}
            {currentWord && (
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {currentWordIndex + 1} / {categoryWords.length}
                    </Badge>
                    <Badge>难度 {currentWord.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 沪语显示 */}
                  <div className="text-center space-y-4">
                    <h2 className="text-6xl font-bold text-primary">
                      {currentWord.shanghainese}
                    </h2>
                    <p className="text-2xl text-muted-foreground">
                      {currentWord.pinyin}
                    </p>
                    {currentWord.ipa && (
                      <p className="text-lg text-muted-foreground font-mono">
                        {currentWord.ipa}
                      </p>
                    )}
                  </div>

                  {/* 发音按钮 */}
                  <div className="flex flex-col items-center gap-2">
                    {currentWord.audio ? (
                      <Button
                        size="lg"
                        onClick={() => playAudio(currentWord.audio)}
                        className="gap-2"
                      >
                        <Volume2 className="h-5 w-5" />
                        播放发音
                      </Button>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          size="lg"
                          disabled
                          className="gap-2"
                          variant="outline"
                        >
                          <Volume2 className="h-5 w-5" />
                          音频待添加
                        </Button>
                        <p className="text-xs text-muted-foreground text-center max-w-xs">
                          💡 真实沪语音频正在准备中，敬请期待
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 答案区域 */}
                  {!showAnswer ? (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAnswer(true)}
                      >
                        显示答案
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-6 bg-muted rounded-lg">
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-semibold">
                          {currentWord.chinese}
                        </p>
                        <p className="text-xl text-muted-foreground">
                          {currentWord.english}
                        </p>
                      </div>

                      {currentWord.usage && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold mb-2">用法：</p>
                          <p className="text-sm text-muted-foreground">
                            {currentWord.usage}
                          </p>
                        </div>
                      )}

                      {currentWord.example && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold mb-2">例句：</p>
                          <p className="text-sm">{currentWord.example}</p>
                        </div>
                      )}

                      {currentWord.culturalNote && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-semibold mb-2">文化注释：</p>
                          <p className="text-sm text-muted-foreground">
                            {currentWord.culturalNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 导航按钮 */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={previousWord}
                      disabled={categoryWords.length <= 1}
                    >
                      上一个
                    </Button>
                    <Button
                      onClick={nextWord}
                      disabled={categoryWords.length <= 1}
                    >
                      下一个
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 课程标签页 */}
          <TabsContent value="lessons" className="space-y-4">
            {!selectedLesson ? (
              // 课程列表
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>第{lesson.number}课：{lesson.title}</CardTitle>
                        <Badge>难度 {lesson.difficulty}</Badge>
                      </div>
                      <CardDescription>{lesson.titleEn}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">学习目标：</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {lesson.objectives.map((obj, idx) => (
                            <li key={idx}>• {obj}</li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => startLesson(lesson.id)}
                      >
                        开始学习
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // 课程学习界面
              (() => {
                const lesson = lessons.find(l => l.id === selectedLesson)
                if (!lesson) return null
                
                const dialogue = lesson.dialogues[currentDialogueIndex]
                
                return (
                  <div className="space-y-6">
                    {/* 课程标题 */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>第{lesson.number}课：{lesson.title}</CardTitle>
                            <CardDescription>{lesson.titleEn}</CardDescription>
                          </div>
                          <Button variant="outline" onClick={backToLessons}>
                            返回课程列表
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* 对话内容 */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>对话 {currentDialogueIndex + 1} / {lesson.dialogues.length}</CardTitle>
                          <Badge variant="secondary">{dialogue.context}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* 对话列表 */}
                        <div className="space-y-4">
                          {dialogue.lines.map((line, idx) => (
                            <div 
                              key={idx}
                              className={`p-4 rounded-lg ${
                                idx % 2 === 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-green-50 dark:bg-green-950'
                              }`}
                            >
                              <p className="text-sm font-semibold text-muted-foreground mb-2">
                                {line.speaker}
                              </p>
                              <p className="text-2xl font-bold mb-2">
                                {line.shanghainese}
                              </p>
                              <p className="text-lg text-muted-foreground mb-1">
                                {line.chinese}
                              </p>
                              <p className="text-sm text-muted-foreground italic">
                                {line.english}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* 导航按钮 */}
                        <div className="flex justify-between pt-4">
                          <Button
                            variant="outline"
                            onClick={previousDialogue}
                            disabled={currentDialogueIndex === 0}
                          >
                            上一个对话
                          </Button>
                          <Button
                            onClick={nextDialogue}
                            disabled={currentDialogueIndex === lesson.dialogues.length - 1}
                          >
                            下一个对话
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 语法讲解 */}
                    {lesson.grammar && lesson.grammar.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>语法讲解</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {lesson.grammar.map((point, idx) => (
                            <div key={idx} className="space-y-2">
                              <h4 className="font-semibold">{point.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {point.explanation}
                              </p>
                              <div className="pl-4 space-y-1">
                                {point.examples.map((example, exIdx) => (
                                  <p key={exIdx} className="text-sm">
                                    • {example}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* 文化注释 */}
                    {lesson.culturalNotes && lesson.culturalNotes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>文化注释</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {lesson.culturalNotes.map((note, idx) => (
                            <div key={idx} className="space-y-2">
                              <h4 className="font-semibold">{note.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {note.content}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )
              })()
            )}
          </TabsContent>

          {/* 文化标签页 */}
          <TabsContent value="culture" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>上海开埠历史</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    1843年上海开埠，成为通商口岸，西方文化大量涌入，形成了独特的海派文化。
                    上海话也在这个过程中吸收了许多外来词汇，形成了独特的语言特色。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>上海小吃文化</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    上海小吃丰富多样，小笼包、生煎包、粢饭团等都是代表性美食。
                    这些小吃不仅美味，更承载着上海人的生活记忆和文化传统。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>上海方言特色</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    上海话属于吴语太湖片苏沪嘉小片，保留了古汉语的许多特征，
                    如浊音声母、入声韵尾等。这使得上海话具有独特的音韵美感。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>上海人的性格</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    上海人以精明、务实、开放著称。这种性格特点也反映在上海话中，
                    表达简洁明了，注重实际效果。
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
