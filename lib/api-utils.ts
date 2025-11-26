import { NextResponse } from "next/server"
import { ZodError } from "zod"

// API 错误类型
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// 统一的错误响应格式
export interface ErrorResponse {
  error: string
  code?: string
  details?: any
}

// 统一的成功响应格式
export interface SuccessResponse<T = any> {
  data: T
  message?: string
}

// 错误处理中间件
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // 开发环境打印错误
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error)
  }

  // Zod 验证错误
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "请求参数验证失败",
        code: "VALIDATION_ERROR",
        details: error.errors,
      },
      { status: 400 },
    )
  }

  // 自定义 API 错误
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  // 未知错误
  return NextResponse.json(
    {
      error: "服务器内部错误",
      code: "INTERNAL_ERROR",
    },
    { status: 500 },
  )
}

// 成功响应包装器
export function successResponse<T>(data: T, message?: string): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({
    data,
    message,
  })
}

// 认证检查
export function requireAuth(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new ApiError(401, "未登录", "UNAUTHORIZED")
  }
}

// 参数验证
export function validateRequired<T>(value: T | undefined | null, fieldName: string): asserts value is T {
  if (value === undefined || value === null || value === "") {
    throw new ApiError(400, `缺少必需参数: ${fieldName}`, "MISSING_PARAMETER")
  }
}
