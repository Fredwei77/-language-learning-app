import { describe, it, expect } from "vitest"
import {
  aiChatRequestSchema,
  dictionaryRequestSchema,
  pronunciationRequestSchema,
  practiceTimeRequestSchema,
  redeemGiftRequestSchema,
  validateEmail,
  validatePassword,
  sanitizeInput,
} from "@/lib/validations"

describe("Validation Schemas", () => {
  describe("aiChatRequestSchema", () => {
    it("should validate correct AI chat request", () => {
      const validRequest = {
        messages: [
          { role: "user" as const, content: "Hello" },
          { role: "assistant" as const, content: "Hi there!" },
        ],
        scenario: "daily",
      }

      const result = aiChatRequestSchema.parse(validRequest)
      expect(result).toEqual(validRequest)
    })

    it("should reject empty messages", () => {
      const invalidRequest = {
        messages: [],
      }

      expect(() => aiChatRequestSchema.parse(invalidRequest)).toThrow()
    })

    it("should reject messages with empty content", () => {
      const invalidRequest = {
        messages: [{ role: "user" as const, content: "" }],
      }

      expect(() => aiChatRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe("dictionaryRequestSchema", () => {
    it("should validate correct dictionary request", () => {
      const validRequest = {
        word: "hello",
        language: "english" as const,
      }

      const result = dictionaryRequestSchema.parse(validRequest)
      expect(result).toEqual(validRequest)
    })

    it("should reject empty word", () => {
      const invalidRequest = {
        word: "",
        language: "english" as const,
      }

      expect(() => dictionaryRequestSchema.parse(invalidRequest)).toThrow()
    })

    it("should reject invalid language", () => {
      const invalidRequest = {
        word: "hello",
        language: "spanish",
      }

      expect(() => dictionaryRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe("practiceTimeRequestSchema", () => {
    it("should validate correct practice time", () => {
      const validRequest = { seconds: 1800 } // 30 minutes

      const result = practiceTimeRequestSchema.parse(validRequest)
      expect(result).toEqual(validRequest)
    })

    it("should reject negative seconds", () => {
      const invalidRequest = { seconds: -10 }

      expect(() => practiceTimeRequestSchema.parse(invalidRequest)).toThrow()
    })

    it("should reject too long practice time", () => {
      const invalidRequest = { seconds: 10000 } // > 2 hours

      expect(() => practiceTimeRequestSchema.parse(invalidRequest)).toThrow()
    })
  })

  describe("redeemGiftRequestSchema", () => {
    it("should validate correct gift redemption", () => {
      const validRequest = {
        giftId: "gift-1",
        giftName: "Test Gift",
        giftCoins: 100,
      }

      const result = redeemGiftRequestSchema.parse(validRequest)
      expect(result).toEqual(validRequest)
    })

    it("should reject negative coins", () => {
      const invalidRequest = {
        giftId: "gift-1",
        giftName: "Test Gift",
        giftCoins: -100,
      }

      expect(() => redeemGiftRequestSchema.parse(invalidRequest)).toThrow()
    })
  })
})

describe("Validation Functions", () => {
  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name@domain.co.uk")).toBe(true)
    })

    it("should reject invalid email", () => {
      expect(validateEmail("invalid")).toBe(false)
      expect(validateEmail("@example.com")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
    })
  })

  describe("validatePassword", () => {
    it("should validate strong password", () => {
      const result = validatePassword("StrongPass123")
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject weak password", () => {
      const result = validatePassword("weak")
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it("should require uppercase letter", () => {
      const result = validatePassword("lowercase123")
      expect(result.valid).toBe(false)
      expect(result.errors).toContain("密码需要包含至少一个大写字母")
    })

    it("should require lowercase letter", () => {
      const result = validatePassword("UPPERCASE123")
      expect(result.valid).toBe(false)
      expect(result.errors).toContain("密码需要包含至少一个小写字母")
    })

    it("should require number", () => {
      const result = validatePassword("NoNumbers")
      expect(result.valid).toBe(false)
      expect(result.errors).toContain("密码需要包含至少一个数字")
    })
  })

  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('xss')</script>Hello"
      const result = sanitizeInput(input)
      expect(result).not.toContain("<")
      expect(result).not.toContain(">")
    })

    it("should remove javascript: protocol", () => {
      const input = "javascript:alert('xss')"
      const result = sanitizeInput(input)
      expect(result.toLowerCase()).not.toContain("javascript:")
    })

    it("should trim whitespace", () => {
      const input = "  hello  "
      const result = sanitizeInput(input)
      expect(result).toBe("hello")
    })
  })
})
