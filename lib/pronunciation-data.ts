// 发音练习数据库
export interface PracticeItem {
  id: string
  text: string
  phonetic: string
  translation: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  type: "word" | "phrase" | "sentence" | "passage"
  audioUrl?: string
  tips?: string[]
}

// 单词练习
export const wordPractice: PracticeItem[] = [
  {
    id: "w1",
    text: "Hello",
    phonetic: "/həˈləʊ/",
    translation: "你好",
    difficulty: "easy",
    category: "greeting",
    type: "word",
    tips: ["注意 'h' 的发音要清晰", "元音 'o' 发长音"],
  },
  {
    id: "w2",
    text: "Beautiful",
    phonetic: "/ˈbjuːtɪfl/",
    translation: "美丽的",
    difficulty: "medium",
    category: "adjective",
    type: "word",
    tips: ["重音在第一个音节", "注意 'eau' 的发音"],
  },
  {
    id: "w3",
    text: "Pronunciation",
    phonetic: "/prəˌnʌnsiˈeɪʃn/",
    translation: "发音",
    difficulty: "hard",
    category: "academic",
    type: "word",
    tips: ["注意 'nun' 的发音", "重音在倒数第二个音节"],
  },
  {
    id: "w4",
    text: "Thank",
    phonetic: "/θæŋk/",
    translation: "感谢",
    difficulty: "easy",
    category: "greeting",
    type: "word",
    tips: ["'th' 发咬舌音", "注意鼻音 'ng'"],
  },
  {
    id: "w5",
    text: "Restaurant",
    phonetic: "/ˈrestrɒnt/",
    translation: "餐厅",
    difficulty: "medium",
    category: "daily",
    type: "word",
    tips: ["重音在第一个音节", "注意 'au' 的发音"],
  },
  {
    id: "w6",
    text: "Comfortable",
    phonetic: "/ˈkʌmftəbl/",
    translation: "舒适的",
    difficulty: "medium",
    category: "adjective",
    type: "word",
    tips: ["注意 'or' 弱化为 /ə/", "最后的 'able' 发音要清晰"],
  },
  {
    id: "w7",
    text: "Extraordinary",
    phonetic: "/ɪkˈstrɔːdnri/",
    translation: "非凡的",
    difficulty: "hard",
    category: "adjective",
    type: "word",
    tips: ["重音在第二个音节", "注意 'extra' 的连读"],
  },
  {
    id: "w8",
    text: "Schedule",
    phonetic: "/ˈʃedjuːl/",
    translation: "时间表",
    difficulty: "medium",
    category: "academic",
    type: "word",
    tips: ["英式发音 'sh' 开头", "美式发音 'sk' 开头"],
  },
]

// 短语练习
export const phrasePractice: PracticeItem[] = [
  {
    id: "p1",
    text: "Good morning",
    phonetic: "/ɡʊd ˈmɔːnɪŋ/",
    translation: "早上好",
    difficulty: "easy",
    category: "greeting",
    type: "phrase",
    tips: ["注意连读", "'morning' 的 'r' 要卷舌"],
  },
  {
    id: "p2",
    text: "Nice to meet you",
    phonetic: "/naɪs tə miːt juː/",
    translation: "很高兴见到你",
    difficulty: "easy",
    category: "greeting",
    type: "phrase",
    tips: ["'to' 弱读为 /tə/", "注意整体语调上扬"],
  },
  {
    id: "p3",
    text: "How much is it",
    phonetic: "/haʊ mʌtʃ ɪz ɪt/",
    translation: "多少钱",
    difficulty: "medium",
    category: "shopping",
    type: "phrase",
    tips: ["'is it' 连读", "语调在 'much' 处上扬"],
  },
  {
    id: "p4",
    text: "Could you help me",
    phonetic: "/kʊd juː help miː/",
    translation: "你能帮我吗",
    difficulty: "medium",
    category: "daily",
    type: "phrase",
    tips: ["'could you' 连读", "礼貌的请求语气"],
  },
  {
    id: "p5",
    text: "I'm looking forward to",
    phonetic: "/aɪm ˈlʊkɪŋ ˈfɔːwəd tuː/",
    translation: "我期待",
    difficulty: "hard",
    category: "business",
    type: "phrase",
    tips: ["注意 'looking' 的 'ng' 发音", "'to' 在句尾要完整发音"],
  },
  {
    id: "p6",
    text: "Take your time",
    phonetic: "/teɪk jɔː taɪm/",
    translation: "慢慢来",
    difficulty: "easy",
    category: "daily",
    type: "phrase",
    tips: ["'your' 连读", "语气要轻松友好"],
  },
  {
    id: "p7",
    text: "What do you think",
    phonetic: "/wɒt duː juː θɪŋk/",
    translation: "你觉得怎么样",
    difficulty: "medium",
    category: "daily",
    type: "phrase",
    tips: ["'do you' 连读", "'think' 的 'th' 要咬舌"],
  },
  {
    id: "p8",
    text: "As a matter of fact",
    phonetic: "/æz ə ˈmætər əv fækt/",
    translation: "事实上",
    difficulty: "hard",
    category: "business",
    type: "phrase",
    tips: ["注意多个弱读", "'matter' 重读"],
  },
]

// 句子练习
export const sentencePractice: PracticeItem[] = [
  {
    id: "s1",
    text: "Hello, how are you today?",
    phonetic: "/həˈləʊ haʊ ɑː juː təˈdeɪ/",
    translation: "你好，你今天怎么样？",
    difficulty: "easy",
    category: "greeting",
    type: "sentence",
    tips: ["语调自然上扬", "注意停顿和节奏"],
  },
  {
    id: "s2",
    text: "I enjoy learning English very much.",
    phonetic: "/aɪ ɪnˈdʒɔɪ ˈlɜːnɪŋ ˈɪŋɡlɪʃ ˈveri mʌtʃ/",
    translation: "我非常喜欢学英语。",
    difficulty: "medium",
    category: "daily",
    type: "sentence",
    tips: ["'enjoy' 和 'learning' 之间要连读", "强调 'very much'"],
  },
  {
    id: "s3",
    text: "The weather is beautiful this morning.",
    phonetic: "/ðə ˈweðə ɪz ˈbjuːtɪfl ðɪs ˈmɔːnɪŋ/",
    translation: "今天早上天气很好。",
    difficulty: "medium",
    category: "daily",
    type: "sentence",
    tips: ["'the' 在元音前发 /ðə/", "'beautiful' 重音在第一音节"],
  },
  {
    id: "s4",
    text: "Could you please tell me where the nearest subway station is?",
    phonetic: "/kʊd juː pliːz tel miː weə ðə ˈnɪərɪst ˈsʌbweɪ ˈsteɪʃn ɪz/",
    translation: "请问最近的地铁站在哪里？",
    difficulty: "hard",
    category: "travel",
    type: "sentence",
    tips: ["礼貌用语要温和", "注意问句的语调"],
  },
  {
    id: "s5",
    text: "I would like to order a cup of coffee, please.",
    phonetic: "/aɪ wʊd laɪk tə ˈɔːdə ə kʌp əv ˈkɒfi pliːz/",
    translation: "我想要一杯咖啡，谢谢。",
    difficulty: "medium",
    category: "shopping",
    type: "sentence",
    tips: ["'would like to' 连读", "'please' 在句尾语调下降"],
  },
  {
    id: "s6",
    text: "Practice makes perfect, so keep trying your best.",
    phonetic: "/ˈpræktɪs meɪks ˈpɜːfɪkt səʊ kiːp ˈtraɪɪŋ jɔː best/",
    translation: "熟能生巧，所以要继续努力。",
    difficulty: "hard",
    category: "academic",
    type: "sentence",
    tips: ["注意 'makes' 的 's' 发音", "'so' 后要有停顿"],
  },
  {
    id: "s7",
    text: "What time does the meeting start tomorrow?",
    phonetic: "/wɒt taɪm dʌz ðə ˈmiːtɪŋ stɑːt təˈmɒrəʊ/",
    translation: "明天的会议几点开始？",
    difficulty: "medium",
    category: "business",
    type: "sentence",
    tips: ["疑问句语调上扬", "'does' 要清晰发音"],
  },
  {
    id: "s8",
    text: "I'm really excited about the upcoming trip to London.",
    phonetic: "/aɪm ˈrɪəli ɪkˈsaɪtɪd əˈbaʊt ði ˈʌpkʌmɪŋ trɪp tə ˈlʌndən/",
    translation: "我对即将到来的伦敦之旅感到非常兴奋。",
    difficulty: "hard",
    category: "travel",
    type: "sentence",
    tips: ["'excited' 重音在第二音节", "注意情感表达"],
  },
  {
    id: "s9",
    text: "Can you recommend a good restaurant nearby?",
    phonetic: "/kæn juː ˌrekəˈmend ə ɡʊd ˈrestrɒnt ˈnɪəbaɪ/",
    translation: "你能推荐附近一家好餐厅吗？",
    difficulty: "medium",
    category: "travel",
    type: "sentence",
    tips: ["'recommend' 重音在第三音节", "友好的询问语气"],
  },
  {
    id: "s10",
    text: "The presentation was informative and well-organized.",
    phonetic: "/ðə ˌprezənˈteɪʃn wɒz ɪnˈfɔːmətɪv ənd wel ˈɔːɡənaɪzd/",
    translation: "这个演讲内容丰富且组织良好。",
    difficulty: "hard",
    category: "business",
    type: "sentence",
    tips: ["注意多音节词的重音", "'and' 要连读"],
  },
]

// 段落练习
export const passagePractice: PracticeItem[] = [
  {
    id: "pa1",
    text: "Good morning, everyone. Welcome to our English learning class. Today we will practice pronunciation together. Please listen carefully and repeat after me.",
    phonetic: "/ɡʊd ˈmɔːnɪŋ ˈevriwʌn. ˈwelkəm tə ˈaʊə ˈɪŋɡlɪʃ ˈlɜːnɪŋ klɑːs. təˈdeɪ wiː wɪl ˈpræktɪs prəˌnʌnsiˈeɪʃn təˈɡeðə. pliːz ˈlɪsn ˈkeəfli ənd rɪˈpiːt ˈɑːftə miː/",
    translation: "大家早上好。欢迎来到我们的英语学习课堂。今天我们将一起练习发音。请仔细听并跟我重复。",
    difficulty: "medium",
    category: "academic",
    type: "passage",
    tips: ["注意句子之间的停顿", "保持自然的语速", "强调关键词"],
  },
  {
    id: "pa2",
    text: "Learning a new language takes time and effort. Don't be afraid to make mistakes. Every mistake is an opportunity to learn and improve. Keep practicing and you will see progress.",
    phonetic: "/ˈlɜːnɪŋ ə njuː ˈlæŋɡwɪdʒ teɪks taɪm ənd ˈefət. dəʊnt biː əˈfreɪd tə meɪk mɪˈsteɪks. ˈevri mɪˈsteɪk ɪz ən ˌɒpəˈtjuːnəti tə lɜːn ənd ɪmˈpruːv. kiːp ˈpræktɪsɪŋ ənd juː wɪl siː ˈprəʊɡres/",
    translation: "学习一门新语言需要时间和努力。不要害怕犯错。每个错误都是学习和进步的机会。坚持练习，你会看到进步。",
    difficulty: "hard",
    category: "academic",
    type: "passage",
    tips: ["注意鼓励性的语气", "每句话要完整", "保持积极的语调"],
  },
  {
    id: "pa3",
    text: "Hello, I'd like to book a table for two at seven o'clock this evening. Do you have any tables available by the window? We're celebrating a special occasion.",
    phonetic: "/həˈləʊ aɪd laɪk tə bʊk ə ˈteɪbl fɔː tuː ət ˈsevn əˈklɒk ðɪs ˈiːvnɪŋ. duː juː hæv ˈeni ˈteɪblz əˈveɪləbl baɪ ðə ˈwɪndəʊ. wɪə ˈselɪbreɪtɪŋ ə ˈspeʃl əˈkeɪʒn/",
    translation: "你好，我想预订今晚七点两个人的桌位。你们有靠窗的桌子吗？我们要庆祝一个特殊的日子。",
    difficulty: "hard",
    category: "daily",
    type: "passage",
    tips: ["礼貌的请求语气", "注意时间的表达", "保持友好的语调"],
  },
]

// 主题分类
export const categories = {
  greeting: { name: "问候", icon: "👋", color: "bg-blue-500" },
  daily: { name: "日常", icon: "🏠", color: "bg-green-500" },
  shopping: { name: "购物", icon: "🛍️", color: "bg-purple-500" },
  travel: { name: "旅游", icon: "✈️", color: "bg-orange-500" },
  business: { name: "商务", icon: "💼", color: "bg-gray-500" },
  academic: { name: "学术", icon: "📚", color: "bg-indigo-500" },
  adjective: { name: "形容词", icon: "✨", color: "bg-pink-500" },
}

// 获取所有练习材料
export function getAllPracticeItems(): PracticeItem[] {
  return [...wordPractice, ...phrasePractice, ...sentencePractice, ...passagePractice]
}

// 根据类型获取练习材料
export function getPracticeItemsByType(type: PracticeItem["type"]): PracticeItem[] {
  const allItems = getAllPracticeItems()
  return allItems.filter((item) => item.type === type)
}

// 根据难度获取练习材料
export function getPracticeItemsByDifficulty(difficulty: PracticeItem["difficulty"]): PracticeItem[] {
  const allItems = getAllPracticeItems()
  return allItems.filter((item) => item.difficulty === difficulty)
}

// 根据分类获取练习材料
export function getPracticeItemsByCategory(category: string): PracticeItem[] {
  const allItems = getAllPracticeItems()
  return allItems.filter((item) => item.category === category)
}

// 随机获取练习材料
export function getRandomPracticeItem(filters?: {
  type?: PracticeItem["type"]
  difficulty?: PracticeItem["difficulty"]
  category?: string
}): PracticeItem {
  let items = getAllPracticeItems()

  if (filters?.type) {
    items = items.filter((item) => item.type === filters.type)
  }
  if (filters?.difficulty) {
    items = items.filter((item) => item.difficulty === filters.difficulty)
  }
  if (filters?.category) {
    items = items.filter((item) => item.category === filters.category)
  }

  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex] || getAllPracticeItems()[0]
}
