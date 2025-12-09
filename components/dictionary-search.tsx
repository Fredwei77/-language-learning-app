"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Volume2, BookOpen, Loader2 } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

interface DictionaryResult {
  word: string
  phonetic: string
  phoneticCN?: string
  phoneticCantonese?: string
  partOfSpeech: string
  definitions: string[]
  examples: string[]
  synonyms?: string[]
  oxfordLevel?: string
}

export function DictionarySearch() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DictionaryResult | null>(null)
  const [activeTab, setActiveTab] = useState("english")
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: searchTerm, language: activeTab }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      // API 返回格式是 { data: { result } }
      if (data.error) {
        setError(data.error)
        setResult(null)
      } else if (data.data && data.data.result) {
        setResult(data.data.result)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Dictionary search error:", error)
      }
      setError(t.dictionary.queryFailed)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const playPronunciation = (text: string, lang = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t.dictionary.searchTitle}</CardTitle>
          <CardDescription>{t.dictionary.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="english">{t.dictionary.english}</TabsTrigger>
              <TabsTrigger value="chinese">{t.dictionary.chinese}</TabsTrigger>
              <TabsTrigger value="cantonese">{t.dictionary.cantonese}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Input
              placeholder={t.dictionary.placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="text-lg"
            />
            <Button onClick={handleSearch} disabled={loading} size="lg">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">{error}</div>}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl">{result.word}</CardTitle>
                  {result.oxfordLevel && <Badge variant="secondary">{result.oxfordLevel}</Badge>}
                </div>
                <div className="flex flex-col gap-2">
                  {result.phonetic && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{t.dictionary.britishPhonetic}:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{result.phonetic}</code>
                      <Button size="sm" variant="ghost" onClick={() => playPronunciation(result.word, "en-GB")}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {result.phoneticCN && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{t.dictionary.chinesePhonetic}:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{result.phoneticCN}</code>
                      <Button size="sm" variant="ghost" onClick={() => playPronunciation(result.word, "zh-CN")}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {result.phoneticCantonese && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{t.dictionary.cantonesePhonetic}:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{result.phoneticCantonese}</code>
                      <Button size="sm" variant="ghost" onClick={() => playPronunciation(result.word, "zh-HK")}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Part of Speech */}
            <div>
              <Badge className="mb-3">{result.partOfSpeech}</Badge>
            </div>

            {/* Definitions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{t.dictionary.definition}</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {result.definitions.map((def, idx) => (
                  <li key={idx} className="text-foreground leading-relaxed">
                    {String(def)}
                  </li>
                ))}
              </ol>
            </div>

            {/* Examples */}
            {result.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t.dictionary.examples}
                </h3>
                <div className="space-y-3">
                  {result.examples.map((example, idx) => (
                    <div key={idx} className="border-l-4 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r">
                      <p className="text-foreground leading-relaxed">{String(example)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {result.synonyms && result.synonyms.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{t.dictionary.synonyms}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((syn, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {String(syn)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Access */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">{t.dictionary.quickAccess.common}</CardTitle>
            <CardDescription>{t.dictionary.quickAccess.commonDesc}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">{t.dictionary.quickAccess.professional}</CardTitle>
            <CardDescription>{t.dictionary.quickAccess.professionalDesc}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">{t.dictionary.quickAccess.notebook}</CardTitle>
            <CardDescription>{t.dictionary.quickAccess.notebookDesc}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
