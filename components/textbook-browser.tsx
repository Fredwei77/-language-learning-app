"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, FileText, CheckCircle2, Circle, BookOpen, GraduationCap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { shanghaiOxfordTextbooks, type Textbook, type Lesson } from "@/lib/textbook-data"
import { useLocale } from "@/hooks/use-locale"

export function TextbookBrowser() {
  const { t } = useLocale()
  const [selectedGrade, setSelectedGrade] = useState("middle")
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // 翻译年级名称
  const translateGrade = (grade: string): string => {
    return (t.textbooks.browser.gradeNames as any)[grade] || grade
  }

  // 翻译学期
  const translateSemester = (semester: string): string => {
    if (semester === "上册") return t.textbooks.browser.semester.first
    if (semester === "下册") return t.textbooks.browser.semester.second
    return semester
  }

  const grades = [
    {
      id: "primary",
      label: t.textbooks.browser.grades.primary,
      icon: BookOpen,
      books: shanghaiOxfordTextbooks.filter((b) => b.grade.includes("小学")),
    },
    {
      id: "middle",
      label: t.textbooks.browser.grades.middle,
      icon: GraduationCap,
      books: shanghaiOxfordTextbooks.filter(
        (b) =>
          b.grade.includes("初中") ||
          b.grade.includes("6年级") ||
          b.grade.includes("7年级") ||
          b.grade.includes("8年级") ||
          b.grade.includes("9年级"),
      ),
    },
    {
      id: "high",
      label: t.textbooks.browser.grades.high,
      icon: GraduationCap,
      books: shanghaiOxfordTextbooks.filter((b) => b.grade.includes("高中")),
    },
  ]

  const currentGradeBooks = grades.find((g) => g.id === selectedGrade)?.books || []

  const playText = (text: string) => {
    // 清除之前的语音
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const playWord = (word: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "en-US"
    utterance.rate = 0.7
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      {/* Header */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">{t.textbooks.browser.title}</CardTitle>
          <CardDescription>{t.textbooks.browser.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
            <TabsList className="grid w-full grid-cols-3">
              {grades.map((g) => {
                const Icon = g.icon
                return (
                  <TabsTrigger key={g.id} value={g.id} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {g.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Textbook Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t.textbooks.browser.selectTextbook}</CardTitle>
            <CardDescription>
              {t.common.total} {currentGradeBooks.length} {t.textbooks.browser.totalBooks}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {currentGradeBooks.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t.textbooks.browser.comingSoon}</p>
                  </div>
                ) : (
                  currentGradeBooks.map((book) => (
                    <Card
                      key={book.id}
                      className={`cursor-pointer hover:shadow-md transition-all ${
                        selectedTextbook?.id === book.id ? "border-primary border-2 shadow-md bg-accent/50" : ""
                      }`}
                      onClick={() => {
                        setSelectedTextbook(book)
                        setSelectedLesson(null)
                      }}
                    >
                      <CardHeader className="p-4 space-y-2">
                        <CardTitle className="text-base leading-snug">{translateGrade(book.grade)}</CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{translateSemester(book.semester)}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {book.units.length} {t.textbooks.browser.units}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Unit and Lesson Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t.textbooks.browser.courseDirectory}</CardTitle>
            {selectedTextbook && (
              <CardDescription>
                {translateGrade(selectedTextbook.grade)} · {translateSemester(selectedTextbook.semester)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTextbook ? (
              <div className="text-center py-12 space-y-2">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.textbooks.browser.selectFirst}</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {selectedTextbook.units.map((unit) => (
                    <div key={unit.id} className="space-y-2">
                      <div className="sticky top-0 bg-background pt-2 pb-2 z-10">
                        <h3 className="font-semibold text-sm text-primary">{unit.title}</h3>
                        <p className="text-xs text-muted-foreground">{unit.theme}</p>
                      </div>
                      <div className="space-y-1 pl-2">
                        {unit.lessons.map((lesson) => (
                          <Button
                            key={lesson.id}
                            variant={selectedLesson?.id === lesson.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <div className="flex items-start gap-2 w-full">
                              {lesson.completed ? (
                                <CheckCircle2 className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-sm leading-snug text-left flex-1">{lesson.title}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card>
          <CardHeader>
            <CardTitle>{t.textbooks.browser.lessonContent}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedLesson ? (
              <div className="text-center py-12 space-y-2">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.textbooks.browser.selectLesson}</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {/* Text Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug flex-1">{selectedLesson.title}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playText(selectedLesson.content)}
                        className="flex-shrink-0"
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        {t.textbooks.browser.read}
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      {selectedLesson.content.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="leading-relaxed text-sm">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Grammar Point */}
                  {selectedLesson.grammar && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {t.textbooks.browser.grammarPoint}
                      </h3>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-3">
                          <p className="text-sm">{selectedLesson.grammar}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Vocabulary */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t.textbooks.browser.vocabulary}
                      <Badge variant="secondary">{selectedLesson.vocabulary.length}</Badge>
                    </h3>
                    <div className="space-y-2">
                      {selectedLesson.vocabulary.map((vocab, idx) => (
                        <Card key={idx} className="hover:shadow-sm transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-base">{vocab.word}</span>
                                  <code className="text-xs bg-muted px-2 py-0.5 rounded">{vocab.phonetic}</code>
                                </div>
                                <p className="text-muted-foreground text-sm">{vocab.meaning}</p>
                                {vocab.example && (
                                  <p className="text-xs text-muted-foreground italic">
                                    {t.textbooks.browser.example}: {vocab.example}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => playWord(vocab.word)}
                                className="flex-shrink-0"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t.textbooks.browser.markComplete}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      {t.textbooks.browser.practice}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
