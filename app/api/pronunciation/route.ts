import { type NextRequest } from "next/server"
import { env } from "@/lib/env"
import { handleApiError, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { pronunciationRequestSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    await checkRateLimit(request, "pronunciation")

    // 验证请求数据
    const body = await request.json()
    const { original, spoken } = pronunciationRequestSchema.parse(body)

    const prompt = `作为英语发音评测专家，请对比以下两段文本：

标准文本：${original}
学生朗读（语音识别结果）：${spoken}

请从以下维度评分（0-100分）：
1. 准确度（accuracy）：单词识别的准确程度
2. 流畅度（fluency）：朗读的流畅程度
3. 发音（pronunciation）：发音的标准程度

请给出：
- 综合得分（score，0-100）
- 做得好的地方（feedback，数组）
- 需要改进的地方（improvements，数组）

以JSON格式返回：
{
  "score": 85,
  "accuracy": 90,
  "fluency": 85,
  "pronunciation": 80,
  "feedback": ["语速适中", "词汇发音清晰"],
  "improvements": ["注意th的发音", "句子重音可以更明显"]
}`

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
            content: "你是一个专业的英语发音评测专家。",
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

    // 提取JSON
    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      result = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            score: 75,
            accuracy: 75,
            fluency: 75,
            pronunciation: 75,
            feedback: ["继续保持练习"],
            improvements: ["多注意发音细节"],
          }
    } catch {
      result = {
        score: 75,
        accuracy: 75,
        fluency: 75,
        pronunciation: 75,
        feedback: ["继续保持练习"],
        improvements: ["多注意发音细节"],
      }
    }

    return successResponse({ result })
  } catch (error) {
    return handleApiError(error)
  }
}
