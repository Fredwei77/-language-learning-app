// 沪语词汇数据库
export interface ShanghainesesWord {
  id: string
  shanghainese: string
  pinyin: string
  ipa?: string
  chinese: string
  english: string
  audio?: string
  category: string
  difficulty: number
  usage?: string
  example?: string
  culturalNote?: string
}

// 问候语
export const greetings: ShanghainesesWord[] = [
  {
    id: "sh001",
    shanghainese: "侬好",
    pinyin: "nóng hǎo",
    ipa: "/noŋ˩˧ hɔ˩˧/",
    chinese: "你好",
    english: "Hello",
    category: "greeting",
    difficulty: 1,
    usage: "最常用的问候语，适用于任何场合",
    example: "侬好！今朝天气老好额。"
  },
  {
    id: "sh002",
    shanghainese: "早晨好",
    pinyin: "zǎo chén hǎo",
    ipa: "/tsɔ˩˧ ʦʰən˩˧ hɔ˩˧/",
    chinese: "早上好",
    english: "Good morning",
    category: "greeting",
    difficulty: 1,
    usage: "早上见面时的问候",
    example: "早晨好！吃饭了伐？"
  },
  {
    id: "sh003",
    shanghainese: "夜快好",
    pinyin: "yè kuài hǎo",
    ipa: "/jɑ˩˧ kʰuɛ˩˧ hɔ˩˧/",
    chinese: "晚上好",
    english: "Good evening",
    category: "greeting",
    difficulty: 1,
    usage: "晚上见面时的问候",
    example: "夜快好！侬回来了？"
  },
  {
    id: "sh004",
    shanghainese: "再会",
    pinyin: "zài huì",
    ipa: "/tsɛ˩˧ ɦuɛ˩˧/",
    chinese: "再见",
    english: "Goodbye",
    category: "greeting",
    difficulty: 1,
    usage: "告别时使用",
    example: "再会！明朝见！"
  },
  {
    id: "sh005",
    shanghainese: "谢谢侬",
    pinyin: "xiè xiè nóng",
    ipa: "/ʑia˩˧ ʑia˩˧ noŋ˩˧/",
    chinese: "谢谢你",
    english: "Thank you",
    category: "greeting",
    difficulty: 1,
    usage: "表达感谢",
    example: "谢谢侬帮我忙！"
  },
  {
    id: "sh006",
    shanghainese: "勿客气",
    pinyin: "wù kè qì",
    ipa: "/vəʔ˥ kʰəʔ˥ tɕʰi˩˧/",
    chinese: "不客气",
    english: "You're welcome",
    category: "greeting",
    difficulty: 1,
    usage: "回应感谢",
    example: "勿客气，小事体。"
  },
  {
    id: "sh007",
    shanghainese: "对勿起",
    pinyin: "duì wù qǐ",
    ipa: "/tɯ˩˧ vəʔ˥ tɕʰi˩˧/",
    chinese: "对不起",
    english: "Sorry",
    category: "greeting",
    difficulty: 1,
    usage: "道歉时使用",
    example: "对勿起，我来晏了。"
  },
  {
    id: "sh008",
    shanghainese: "没关系",
    pinyin: "méi guān xì",
    ipa: "/mɛ˩˧ kuɛ˥ ɕi˩˧/",
    chinese: "没关系",
    english: "It's okay",
    category: "greeting",
    difficulty: 1,
    usage: "回应道歉",
    example: "没关系，勿要紧额。"
  }
]

// 家庭称谓
export const family: ShanghainesesWord[] = [
  {
    id: "sh101",
    shanghainese: "阿爸",
    pinyin: "ā bà",
    ipa: "/ɑ˥ bɑ˩˧/",
    chinese: "爸爸",
    english: "Father",
    category: "family",
    difficulty: 1,
    usage: "称呼父亲",
    example: "阿爸回来了。"
  },
  {
    id: "sh102",
    shanghainese: "阿妈",
    pinyin: "ā mā",
    ipa: "/ɑ˥ mɑ˥/",
    chinese: "妈妈",
    english: "Mother",
    category: "family",
    difficulty: 1,
    usage: "称呼母亲",
    example: "阿妈烧菜老好吃额。"
  },
  {
    id: "sh103",
    shanghainese: "阿哥",
    pinyin: "ā gē",
    ipa: "/ɑ˥ ku˥/",
    chinese: "哥哥",
    english: "Elder brother",
    category: "family",
    difficulty: 1,
    usage: "称呼哥哥",
    example: "阿哥带我去公园。"
  },
  {
    id: "sh104",
    shanghainese: "小弟",
    pinyin: "xiǎo dì",
    ipa: "/ɕiɔ˩˧ di˩˧/",
    chinese: "弟弟",
    english: "Younger brother",
    category: "family",
    difficulty: 1,
    usage: "称呼弟弟",
    example: "小弟还在读书。"
  },
  {
    id: "sh105",
    shanghainese: "姐姐",
    pinyin: "jiě jiě",
    ipa: "/tɕia˩˧ tɕia˩˧/",
    chinese: "姐姐",
    english: "Elder sister",
    category: "family",
    difficulty: 1,
    usage: "称呼姐姐",
    example: "姐姐上班去了。"
  },
  {
    id: "sh106",
    shanghainese: "妹妹",
    pinyin: "mèi mèi",
    ipa: "/mɛ˩˧ mɛ˩˧/",
    chinese: "妹妹",
    english: "Younger sister",
    category: "family",
    difficulty: 1,
    usage: "称呼妹妹",
    example: "妹妹还小。"
  },
  {
    id: "sh107",
    shanghainese: "爷爷",
    pinyin: "yé yé",
    ipa: "/jɑ˩˧ jɑ˩˧/",
    chinese: "爷爷",
    english: "Grandfather (paternal)",
    category: "family",
    difficulty: 1,
    usage: "称呼爷爷",
    example: "爷爷今年八十岁了。"
  },
  {
    id: "sh108",
    shanghainese: "娘娘",
    pinyin: "niáng niáng",
    ipa: "/ɲiɑ˩˧ ɲiɑ˩˧/",
    chinese: "奶奶",
    english: "Grandmother (paternal)",
    category: "family",
    difficulty: 1,
    usage: "称呼奶奶",
    example: "娘娘身体老健康额。"
  },
  {
    id: "sh109",
    shanghainese: "外公",
    pinyin: "wài gōng",
    ipa: "/ŋɛ˩˧ koŋ˥/",
    chinese: "外公",
    english: "Grandfather (maternal)",
    category: "family",
    difficulty: 1,
    usage: "称呼外公",
    example: "外公住在乡下。"
  },
  {
    id: "sh110",
    shanghainese: "外婆",
    pinyin: "wài pó",
    ipa: "/ŋɛ˩˧ bu˩˧/",
    chinese: "外婆",
    english: "Grandmother (maternal)",
    category: "family",
    difficulty: 1,
    usage: "称呼外婆",
    example: "外婆烧菜老好吃。"
  }
]

// 数字
export const numbers: ShanghainesesWord[] = [
  {
    id: "sh201",
    shanghainese: "一",
    pinyin: "yī",
    ipa: "/iɪʔ˥/",
    chinese: "一",
    english: "One",
    category: "number",
    difficulty: 1,
    example: "一只苹果"
  },
  {
    id: "sh202",
    shanghainese: "两",
    pinyin: "liǎng",
    ipa: "/liɑ˩˧/",
    chinese: "二",
    english: "Two",
    category: "number",
    difficulty: 1,
    example: "两只手"
  },
  {
    id: "sh203",
    shanghainese: "三",
    pinyin: "sān",
    ipa: "/sɛ˥/",
    chinese: "三",
    english: "Three",
    category: "number",
    difficulty: 1,
    example: "三个人"
  },
  {
    id: "sh204",
    shanghainese: "四",
    pinyin: "sì",
    ipa: "/sɿ˩˧/",
    chinese: "四",
    english: "Four",
    category: "number",
    difficulty: 1,
    example: "四点钟"
  },
  {
    id: "sh205",
    shanghainese: "五",
    pinyin: "wǔ",
    ipa: "/ŋ̍˩˧/",
    chinese: "五",
    english: "Five",
    category: "number",
    difficulty: 1,
    example: "五块钱"
  },
  {
    id: "sh206",
    shanghainese: "六",
    pinyin: "liù",
    ipa: "/loʔ˥/",
    chinese: "六",
    english: "Six",
    category: "number",
    difficulty: 1,
    example: "六月"
  },
  {
    id: "sh207",
    shanghainese: "七",
    pinyin: "qī",
    ipa: "/tɕʰiɪʔ˥/",
    chinese: "七",
    english: "Seven",
    category: "number",
    difficulty: 1,
    example: "七天"
  },
  {
    id: "sh208",
    shanghainese: "八",
    pinyin: "bā",
    ipa: "/pɑʔ˥/",
    chinese: "八",
    english: "Eight",
    category: "number",
    difficulty: 1,
    example: "八点钟"
  },
  {
    id: "sh209",
    shanghainese: "九",
    pinyin: "jiǔ",
    ipa: "/tɕiɤ˩˧/",
    chinese: "九",
    english: "Nine",
    category: "number",
    difficulty: 1,
    example: "九月"
  },
  {
    id: "sh210",
    shanghainese: "十",
    pinyin: "shí",
    ipa: "/zəʔ˥/",
    chinese: "十",
    english: "Ten",
    category: "number",
    difficulty: 1,
    example: "十块钱"
  }
]

// 食物
export const food: ShanghainesesWord[] = [
  {
    id: "sh301",
    shanghainese: "小笼包",
    pinyin: "xiǎo lóng bāo",
    ipa: "/ɕiɔ˩˧ loŋ˩˧ pɔ˥/",
    chinese: "小笼包",
    english: "Steamed soup dumplings",
    category: "food",
    difficulty: 1,
    usage: "上海最著名的小吃",
    culturalNote: "南翔小笼包最为有名，皮薄汁多",
    example: "我要吃小笼包。"
  },
  {
    id: "sh302",
    shanghainese: "生煎馒头",
    pinyin: "shēng jiān mán tou",
    ipa: "/sən˥ tɕiɛ˥ mɛ˩˧ dɤ˩˧/",
    chinese: "生煎包",
    english: "Pan-fried buns",
    category: "food",
    difficulty: 1,
    usage: "上海特色早餐",
    culturalNote: "底部金黄酥脆，上面松软多汁",
    example: "早饭吃生煎馒头。"
  },
  {
    id: "sh303",
    shanghainese: "粢饭团",
    pinyin: "cí fàn tuán",
    ipa: "/tsɿ˩˧ vɛ˩˧ duɛ˩˧/",
    chinese: "饭团",
    english: "Rice ball",
    category: "food",
    difficulty: 1,
    usage: "传统上海早餐",
    culturalNote: "糯米包油条、榨菜、肉松等",
    example: "买只粢饭团。"
  },
  {
    id: "sh304",
    shanghainese: "油条",
    pinyin: "yóu tiáo",
    ipa: "/jɤ˩˧ diɔ˩˧/",
    chinese: "油条",
    english: "Fried dough stick",
    category: "food",
    difficulty: 1,
    usage: "常见早餐食品",
    example: "油条配豆浆。"
  },
  {
    id: "sh305",
    shanghainese: "豆浆",
    pinyin: "dòu jiāng",
    ipa: "/dɤ˩˧ tɕiɑ˥/",
    chinese: "豆浆",
    english: "Soy milk",
    category: "food",
    difficulty: 1,
    usage: "传统早餐饮品",
    example: "来杯豆浆。"
  },
  {
    id: "sh306",
    shanghainese: "大饼",
    pinyin: "dà bǐng",
    ipa: "/du˩˧ pin˩˧/",
    chinese: "烧饼",
    english: "Flatbread",
    category: "food",
    difficulty: 1,
    usage: "传统早餐主食",
    example: "大饼油条。"
  },
  {
    id: "sh307",
    shanghainese: "馄饨",
    pinyin: "hún tun",
    ipa: "/ɦuən˩˧ dən˩˧/",
    chinese: "馄饨",
    english: "Wonton",
    category: "food",
    difficulty: 1,
    usage: "常见小吃",
    example: "吃碗馄饨。"
  },
  {
    id: "sh308",
    shanghainese: "面",
    pinyin: "miàn",
    ipa: "/mi˩˧/",
    chinese: "面条",
    english: "Noodles",
    category: "food",
    difficulty: 1,
    usage: "主食",
    example: "吃碗面。"
  }
]

// 日常用语
export const daily: ShanghainesesWord[] = [
  {
    id: "sh401",
    shanghainese: "吃饭了伐",
    pinyin: "chī fàn le fá",
    ipa: "/ʨʰɪʔ˥ vɛ˩˧ lɑʔ˥ vɑʔ˥/",
    chinese: "吃饭了吗",
    english: "Have you eaten?",
    category: "daily",
    difficulty: 2,
    usage: "常用问候语，关心对方",
    example: "侬吃饭了伐？"
  },
  {
    id: "sh402",
    shanghainese: "侬去哪里",
    pinyin: "nóng qù nǎ lǐ",
    ipa: "/noŋ˩˧ tɕʰi˩˧ nɑʔ˥ li˩˧/",
    chinese: "你去哪里",
    english: "Where are you going?",
    category: "daily",
    difficulty: 2,
    usage: "询问对方去向",
    example: "侬去哪里啊？"
  },
  {
    id: "sh403",
    shanghainese: "几钿",
    pinyin: "jǐ diǎn",
    ipa: "/tɕi˩˧ ti˩˧/",
    chinese: "多少钱",
    english: "How much?",
    category: "daily",
    difficulty: 2,
    usage: "购物时询问价格",
    example: "这个几钿？"
  },
  {
    id: "sh404",
    shanghainese: "勿要",
    pinyin: "wù yào",
    ipa: "/vəʔ˥ jɔ˩˧/",
    chinese: "不要",
    english: "Don't want",
    category: "daily",
    difficulty: 1,
    usage: "表示拒绝",
    example: "我勿要。"
  },
  {
    id: "sh405",
    shanghainese: "好额",
    pinyin: "hǎo é",
    ipa: "/hɔ˩˧ əʔ˥/",
    chinese: "好的",
    english: "Okay/Good",
    category: "daily",
    difficulty: 1,
    usage: "表示同意",
    example: "好额，我晓得了。"
  }
]

// 导出所有词汇
export const allVocabulary: ShanghainesesWord[] = [
  ...greetings,
  ...family,
  ...numbers,
  ...food,
  ...daily
]

// 按类别分组
export const vocabularyByCategory = {
  greeting: greetings,
  family: family,
  number: numbers,
  food: food,
  daily: daily
}

// 按难度分组
export const vocabularyByDifficulty = {
  1: allVocabulary.filter(w => w.difficulty === 1),
  2: allVocabulary.filter(w => w.difficulty === 2),
  3: allVocabulary.filter(w => w.difficulty === 3)
}
