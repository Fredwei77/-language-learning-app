# Textbooks 页面国际化完整修复

## 问题描述

Textbooks 页面在切换到英文后，教材列表中的年级名称（如"初中一年级（6年级）"）和学期（如"上册"、"下册"）仍然显示中文。

## 根本原因

教材数据（`lib/textbook-data.ts`）中的 `grade` 和 `semester` 字段是硬编码的中文字符串，没有进行国际化处理。

## 修复方案

采用**翻译映射**方案，在翻译文件中添加年级和学期的映射表，然后在组件中使用翻译函数进行转换。

### 1. 更新翻译文件

#### 中文翻译 (`lib/i18n/translations/zh.ts`)

添加了以下翻译映射：

```typescript
textbooks: {
  browser: {
    // ... 其他翻译
    semester: {
      first: "上册",
      second: "下册",
    },
    gradeNames: {
      "初中一年级（6年级）": "初中一年级（6年级）",
      "初中二年级（7年级）": "初中二年级（7年级）",
      "初中三年级（8年级）": "初中三年级（8年级）",
      "初中四年级（9年级）": "初中四年级（9年级）",
    },
  },
}
```

#### 英文翻译 (`lib/i18n/translations/en.ts`)

添加了以下翻译映射：

```typescript
textbooks: {
  browser: {
    // ... 其他翻译
    semester: {
      first: "Volume 1",
      second: "Volume 2",
    },
    gradeNames: {
      "初中一年级（6年级）": "Grade 6 (Middle School Year 1)",
      "初中二年级（7年级）": "Grade 7 (Middle School Year 2)",
      "初中三年级（8年级）": "Grade 8 (Middle School Year 3)",
      "初中四年级（9年级）": "Grade 9 (Middle School Year 4)",
    },
  },
}
```

### 2. 更新 TextbookBrowser 组件

#### 添加翻译函数

在组件中添加了两个翻译辅助函数：

```typescript
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
```

#### 应用翻译

在显示教材信息的地方使用翻译函数：

**教材列表卡片：**
```typescript
<CardTitle className="text-base leading-snug">
  {translateGrade(book.grade)}
</CardTitle>
<Badge variant="secondary">
  {translateSemester(book.semester)}
</Badge>
```

**课程目录描述：**
```typescript
<CardDescription>
  {translateGrade(selectedTextbook.grade)} · {translateSemester(selectedTextbook.semester)}
</CardDescription>
```

## 修复效果

### 中文界面
- 年级：初中一年级（6年级）
- 学期：上册、下册

### 英文界面
- 年级：Grade 6 (Middle School Year 1)
- 学期：Volume 1、Volume 2

## 翻译对照表

| 中文 | 英文 |
|------|------|
| 初中一年级（6年级） | Grade 6 (Middle School Year 1) |
| 初中二年级（7年级） | Grade 7 (Middle School Year 2) |
| 初中三年级（8年级） | Grade 8 (Middle School Year 3) |
| 初中四年级（9年级） | Grade 9 (Middle School Year 4) |
| 上册 | Volume 1 |
| 下册 | Volume 2 |

## 技术细节

### 为什么不直接修改数据文件？

1. **数据完整性**：教材数据文件包含大量内容（课文、词汇、语法等），全部改为多语言结构会大幅增加文件大小和复杂度
2. **维护成本**：翻译映射方案更容易维护，只需在翻译文件中添加新的映射即可
3. **灵活性**：可以轻松添加更多语言支持，无需修改数据文件

### 翻译函数的容错处理

两个翻译函数都包含了容错逻辑：
- `translateGrade`：如果找不到映射，返回原始值
- `translateSemester`：如果不是"上册"或"下册"，返回原始值

这确保了即使添加新的教材数据，也不会导致显示错误。

## 扩展性

### 添加新年级

如果需要添加新的年级（如高中），只需在翻译文件中添加映射：

```typescript
gradeNames: {
  // ... 现有映射
  "高中一年级": "Grade 10 (High School Year 1)",
  "高中二年级": "Grade 11 (High School Year 2)",
  "高中三年级": "Grade 12 (High School Year 3)",
}
```

### 添加新语言

如果需要支持其他语言（如日语、韩语），只需：
1. 创建新的翻译文件（如 `ja.ts`、`ko.ts`）
2. 添加相应的年级和学期映射
3. 翻译函数会自动使用新语言的映射

## 测试建议

1. **中文测试**
   - 访问 `/textbooks` 页面
   - 验证所有年级名称显示为中文
   - 验证学期显示为"上册"、"下册"

2. **英文测试**
   - 切换语言到英文
   - 访问 `/textbooks` 页面
   - 验证年级名称显示为 "Grade X (Middle School Year Y)"
   - 验证学期显示为 "Volume 1"、"Volume 2"

3. **切换测试**
   - 在页面上切换语言
   - 验证教材列表和课程目录描述立即更新

4. **边界测试**
   - 选择不同年级的教材
   - 验证所有年级和学期都正确翻译

## 相关文件

- `lib/i18n/translations/zh.ts` - 中文翻译（添加了年级和学期映射）
- `lib/i18n/translations/en.ts` - 英文翻译（添加了年级和学期映射）
- `components/textbook-browser.tsx` - 教材浏览器组件（添加了翻译函数）
- `lib/textbook-data.ts` - 教材数据文件（保持不变）

## 注意事项

1. **数据一致性**
   - 确保翻译映射中的 key 与数据文件中的值完全匹配
   - 注意中文标点符号（如括号）

2. **性能考虑**
   - 翻译函数在每次渲染时都会被调用
   - 由于是简单的对象查找，性能影响可以忽略不计

3. **未来改进**
   - 如果教材数据大幅增加，可以考虑将数据结构改为多语言格式
   - 可以考虑使用 i18n 库的插值功能来简化翻译

## 完成状态

✅ 年级名称国际化
✅ 学期国际化
✅ 教材列表显示
✅ 课程目录描述
✅ 翻译函数容错处理
✅ 中英文翻译完整

所有 Textbooks 页面的国际化问题已完全修复！
