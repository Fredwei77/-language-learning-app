import { type NextRequest } from "next/server"
import { env } from "@/lib/env"
import { handleApiError, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { aiChatRequestSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    await checkRateLimit(request, "aiChat")

    // 验证请求数据
    const body = await request.json()
    const { messages, scenario } = aiChatRequestSchema.parse(body)

    // 检查 API key
    if (!env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured")
      throw new Error("AI service is not configured. Please contact administrator.")
    }

    const systemPrompt = `你是一个专业的英语学习AI助手。你的任务是：
1. 根据场景"${scenario}"与用户进行自然对话
2. 如果用户的英语有语法或表达错误，在回复后单独指出（以"【纠正】"开头）
3. 使用适合学习者水平的词汇和句式
4. 保持对话自然流畅，鼓励用户多说
5. 回复要简洁明了，不要过长

注意：直接用英语对话，纠正部分用中文说明。`

    console.log("Calling OpenRouter API...")
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
            content: systemPrompt,
          },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter API error:", response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("OpenRouter response:", data)

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Invalid OpenRouter response:", data)
      throw new Error("Invalid response from AI service")
    }

    const content = data.choices[0].message.content

    // 提取纠正内容
    const corrections: string[] = []
    let message = content

    const correctionMatch = content.match(/【纠正】(.+?)(?=\n|$)/g)
    if (correctionMatch) {
      correctionMatch.forEach((match: string) => {
        const correction = match.replace("【纠正】", "").trim()
        corrections.push(correction)
      })
      message = content.replace(/【纠正】.+?(?=\n|$)/g, "").trim()
    }

    return successResponse({
      message,
      corrections: corrections.length > 0 ? corrections : undefined,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
