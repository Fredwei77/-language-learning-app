// 沪语课程数据
export interface ShanghainesesLesson {
  id: string
  number: number
  title: string
  titleEn: string
  difficulty: number
  objectives: string[]
  vocabularyIds: string[]
  dialogues: Dialogue[]
  culturalNotes: CulturalNote[]
  grammar?: GrammarPoint[]
}

export interface Dialogue {
  context: string
  lines: DialogueLine[]
}

export interface DialogueLine {
  speaker: string
  shanghainese: string
  chinese: string
  english: string
}

export interface CulturalNote {
  title: string
  content: string
}

export interface GrammarPoint {
  title: string
  explanation: string
  examples: string[]
}

export const lessons: ShanghainesesLesson[] = [
  {
    id: "lesson01",
    number: 1,
    title: "基础问候",
    titleEn: "Basic Greetings",
    difficulty: 1,
    objectives: [
      "学会基本问候语",
      "了解上海人的问候习惯",
      "掌握5个核心词汇"
    ],
    vocabularyIds: ["sh001", "sh002", "sh003", "sh004", "sh005"],
    dialogues: [
      {
        context: "早上在路上遇到邻居",
        lines: [
          {
            speaker: "张先生",
            shanghainese: "早晨好！",
            chinese: "早上好！",
            english: "Good morning!"
          },
          {
            speaker: "李太太",
            shanghainese: "早晨好！吃饭了伐？",
            chinese: "早上好！吃饭了吗？",
            english: "Good morning! Have you eaten?"
          },
          {
            speaker: "张先生",
            shanghainese: "吃过了，侬呢？",
            chinese: "吃过了，你呢？",
            english: "Yes, and you?"
          },
          {
            speaker: "李太太",
            shanghainese: "我也吃过了。",
            chinese: "我也吃过了。",
            english: "I've eaten too."
          }
        ]
      }
    ],
    culturalNotes: [
      {
        title: "问候习惯",
        content: "上海人见面常问'吃饭了伐'，这是关心对方的表现，不一定真的要知道对方是否吃饭。这是中国传统文化中以食为天的体现。"
      },
      {
        title: "称呼习惯",
        content: "上海人习惯用'侬'来称呼对方，相当于普通话的'你'。这是吴语方言的特色之一。"
      }
    ],
    grammar: [
      {
        title: "疑问句 - 伐",
        explanation: "'伐'相当于普通话的'吗'，用于一般疑问句末尾",
        examples: [
          "侬好伐？（你好吗？）",
          "吃饭了伐？（吃饭了吗？）",
          "侬去伐？（你去吗？）"
        ]
      }
    ]
  },
  {
    id: "lesson02",
    number: 2,
    title: "自我介绍",
    titleEn: "Self Introduction",
    difficulty: 1,
    objectives: [
      "学会自我介绍",
      "掌握姓名、年龄的表达",
      "了解上海人的自我介绍方式"
    ],
    vocabularyIds: ["sh001", "sh101", "sh102"],
    dialogues: [
      {
        context: "第一次见面",
        lines: [
          {
            speaker: "小王",
            shanghainese: "侬好，我叫小王。",
            chinese: "你好，我叫小王。",
            english: "Hello, I'm Xiao Wang."
          },
          {
            speaker: "小李",
            shanghainese: "侬好，我叫小李。侬是上海人伐？",
            chinese: "你好，我叫小李。你是上海人吗？",
            english: "Hello, I'm Xiao Li. Are you from Shanghai?"
          },
          {
            speaker: "小王",
            shanghainese: "是额，我是上海人。",
            chinese: "是的，我是上海人。",
            english: "Yes, I'm from Shanghai."
          }
        ]
      }
    ],
    culturalNotes: [
      {
        title: "自我介绍",
        content: "上海人自我介绍时通常比较简洁，直接说名字即可。在正式场合可能会加上职业或单位。"
      }
    ],
    grammar: [
      {
        title: "是字句",
        explanation: "'是'用于判断句，表示等同关系",
        examples: [
          "我是上海人。",
          "伊是我朋友。",
          "这是我阿爸。"
        ]
      }
    ]
  },
  {
    id: "lesson03",
    number: 3,
    title: "家庭成员",
    titleEn: "Family Members",
    difficulty: 1,
    objectives: [
      "学会家庭成员的称呼",
      "能够介绍自己的家人",
      "了解上海家庭文化"
    ],
    vocabularyIds: ["sh101", "sh102", "sh103", "sh104", "sh105", "sh106"],
    dialogues: [
      {
        context: "介绍家人",
        lines: [
          {
            speaker: "小明",
            shanghainese: "这是我阿爸阿妈。",
            chinese: "这是我爸爸妈妈。",
            english: "These are my parents."
          },
          {
            speaker: "朋友",
            shanghainese: "侬还有兄弟姐妹伐？",
            chinese: "你还有兄弟姐妹吗？",
            english: "Do you have siblings?"
          },
          {
            speaker: "小明",
            shanghainese: "有额，我有一个阿哥。",
            chinese: "有的，我有一个哥哥。",
            english: "Yes, I have an elder brother."
          }
        ]
      }
    ],
    culturalNotes: [
      {
        title: "家庭称谓",
        content: "上海话中的家庭称谓保留了很多传统特色，如'阿爸'、'阿妈'、'娘娘'等，体现了上海方言的独特魅力。"
      }
    ]
  },
  {
    id: "lesson04",
    number: 4,
    title: "上海美食",
    titleEn: "Shanghai Cuisine",
    difficulty: 2,
    objectives: [
      "学会常见上海小吃的说法",
      "能够在餐厅点餐",
      "了解上海饮食文化"
    ],
    vocabularyIds: ["sh301", "sh302", "sh303", "sh304", "sh305"],
    dialogues: [
      {
        context: "在早餐店",
        lines: [
          {
            speaker: "顾客",
            shanghainese: "我要两只小笼包，一碗豆浆。",
            chinese: "我要两笼小笼包，一碗豆浆。",
            english: "I want two baskets of xiaolongbao and a bowl of soy milk."
          },
          {
            speaker: "老板",
            shanghainese: "好额，还要啥？",
            chinese: "好的，还要什么？",
            english: "Okay, anything else?"
          },
          {
            speaker: "顾客",
            shanghainese: "再来两根油条。",
            chinese: "再来两根油条。",
            english: "Two more fried dough sticks."
          }
        ]
      }
    ],
    culturalNotes: [
      {
        title: "上海早餐文化",
        content: "上海人的早餐非常丰富，小笼包、生煎包、粢饭团、油条豆浆都是经典选择。早餐店通常从早上5点开始营业。"
      },
      {
        title: "小笼包的吃法",
        content: "吃小笼包要'轻轻提，慢慢移，先开窗，后喝汤'，这样才能品尝到最美味的小笼包。"
      }
    ]
  }
]

// 获取课程
export function getLessonById(id: string): ShanghainesesLesson | undefined {
  return lessons.find(lesson => lesson.id === id)
}

// 获取指定难度的课程
export function getLessonsByDifficulty(difficulty: number): ShanghainesesLesson[] {
  return lessons.filter(lesson => lesson.difficulty === difficulty)
}
