import { type NextRequest } from "next/server"
import { env } from "@/lib/env"
import { handleApiError, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { dictionaryRequestSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    await checkRateLimit(request, "dictionary")

    // 验证请求数据
    const body = await request.json()
    const { word, language } = dictionaryRequestSchema.parse(body)

    const prompt =
      language === "english"
        ? `请提供单词 "${word}" 的详细信息。
要求：
1. examples 必须是纯字符串数组，每个例句包含英文和中文翻译，格式："英文句子 (中文翻译)"
2. 返回严格的JSON格式

返回格式：
{"word":"","phonetic":"","partOfSpeech":"","definitions":[],"examples":["Example sentence (例句翻译)"],"synonyms":[],"oxfordLevel":""}`
        : language === "chinese"
          ? `请提供中文词语 "${word}" 的详细信息。
要求：
1. examples 必须是纯字符串数组
2. 返回严格的JSON格式

返回格式：
{"word":"","phoneticCN":"","partOfSpeech":"","definitions":[],"examples":["例句文本"],"synonyms":[]}`
          : `请提供粤语词语 "${word}" 的详细信息。
要求：
1. examples 必须是纯字符串数组，格式："粤语例句（普通话翻译）"
2. 返回严格的JSON格式

返回格式：
{"word":"","phoneticCantonese":"","phoneticCN":"","partOfSpeech":"","definitions":[],"examples":["粤语例句（普通话翻译）"]}`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "你是一个专业的语言词典助手，精通英语、中文和粤语。必须严格按照要求的JSON格式返回数据。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    })

    const data = await response.json()

    const content = data.choices[0]?.message?.content || "{}"

    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

      result = {
        word: parsed.word || word,
        phonetic: parsed.phonetic || "",
        phoneticCN: parsed.phoneticCN || "",
        phoneticCantonese: parsed.phoneticCantonese || "",
        partOfSpeech: parsed.partOfSpeech || "Unknown",
        definitions: Array.isArray(parsed.definitions) ? parsed.definitions : [],
        examples: Array.isArray(parsed.examples)
          ? parsed.examples.map((ex: any) => {
              if (typeof ex === "object" && ex !== null) {
                return ex.sentence && ex.translation
                  ? `${ex.sentence} (${ex.translation})`
                  : ex.sentence || JSON.stringify(ex)
              }
              return String(ex)
            })
          : [],
        synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms : [],
        oxfordLevel: parsed.oxfordLevel || "",
      }
    } catch (parseError) {
      if (process.env.NODE_ENV === "development") {
        console.error("JSON parse error:", parseError)
      }
      result = {
        word: word,
        phonetic: "N/A",
        partOfSpeech: "Unknown",
        definitions: ["查询出错，请重试"],
        examples: [],
        synonyms: [],
      }
    }

    return successResponse({ result })
  } catch (error) {
    return handleApiError(error)
  }
}
