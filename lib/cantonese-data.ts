// 粤语学习数据库 - 基于实际粤语教学资料整理

export interface Phrase {
  cantonese: string
  jyutping: string
  mandarin: string
  english: string
  notes?: string
}

export interface PhraseCategory {
  id: string
  category: string
  categoryEn: string
  phrases: Phrase[]
}

// 常用短语数据库
export const cantonesePhrasesData: PhraseCategory[] = [
  {
    id: "greetings",
    category: "日常问候",
    categoryEn: "Daily Greetings",
    phrases: [
      { cantonese: "你好", jyutping: "nei5 hou2", mandarin: "你好", english: "Hello" },
      { cantonese: "早晨", jyutping: "zou2 san4", mandarin: "早上好", english: "Good morning" },
      { cantonese: "午安", jyutping: "ng5 on1", mandarin: "午安", english: "Good afternoon" },
      { cantonese: "晚安", jyutping: "maan5 on1", mandarin: "晚安", english: "Good night" },
      { cantonese: "再见", jyutping: "zoi3 gin3", mandarin: "再见", english: "Goodbye" },
      { cantonese: "拜拜", jyutping: "baai1 baai3", mandarin: "拜拜", english: "Bye bye" },
      { cantonese: "多谢", jyutping: "do1 ze6", mandarin: "谢谢", english: "Thank you" },
      { cantonese: "唔该", jyutping: "m4 goi1", mandarin: "劳驾/谢谢", english: "Excuse me / Thank you" },
      { cantonese: "对唔住", jyutping: "deoi3 m4 zyu6", mandarin: "对不起", english: "Sorry" },
      { cantonese: "唔紧要", jyutping: "m4 gan2 jiu3", mandarin: "没关系", english: "It's okay" },
      { cantonese: "请问", jyutping: "cing2 man6", mandarin: "请问", english: "Excuse me (asking)" },
      { cantonese: "你好吗", jyutping: "nei5 hou2 maa3", mandarin: "你好吗", english: "How are you?" },
      { cantonese: "几好", jyutping: "gei2 hou2", mandarin: "很好", english: "Very good" },
      { cantonese: "麻麻地", jyutping: "maa4 maa4 dei2", mandarin: "一般般", english: "So-so" },
    ],
  },
  {
    id: "food",
    category: "饮食用语",
    categoryEn: "Food & Dining",
    phrases: [
      { cantonese: "食饭", jyutping: "sik6 faan6", mandarin: "吃饭", english: "Eat / Have a meal" },
      { cantonese: "饮茶", jyutping: "jam2 caa4", mandarin: "喝茶/吃早茶", english: "Drink tea / Have dim sum" },
      { cantonese: "好味", jyutping: "hou2 mei6", mandarin: "好吃", english: "Delicious" },
      { cantonese: "好食", jyutping: "hou2 sik6", mandarin: "好吃", english: "Tasty" },
      { cantonese: "埋单", jyutping: "maai4 daan1", mandarin: "买单/结账", english: "Check please" },
      { cantonese: "加水", jyutping: "gaa1 seoi2", mandarin: "加水", english: "Add water / Refill" },
      { cantonese: "唔该晒", jyutping: "m4 goi1 saai3", mandarin: "多谢", english: "Thank you very much" },
      { cantonese: "我要呢个", jyutping: "ngo5 jiu3 ni1 go3", mandarin: "我要这个", english: "I want this" },
      { cantonese: "有冇", jyutping: "jau5 mou5", mandarin: "有没有", english: "Do you have?" },
      { cantonese: "唔要辣", jyutping: "m4 jiu3 laat6", mandarin: "不要辣", english: "No spicy" },
      { cantonese: "少甜", jyutping: "siu2 tim4", mandarin: "少糖", english: "Less sugar" },
      { cantonese: "走冰", jyutping: "zau2 bing1", mandarin: "不要冰", english: "No ice" },
      { cantonese: "打包", jyutping: "daa2 baau1", mandarin: "打包", english: "Take away" },
      { cantonese: "叫外卖", jyutping: "giu3 ngoi6 maai6", mandarin: "叫外卖", english: "Order delivery" },
    ],
  },
  {
    id: "shopping",
    category: "购物交流",
    categoryEn: "Shopping",
    phrases: [
      { cantonese: "几多钱", jyutping: "gei2 do1 cin2", mandarin: "多少钱", english: "How much?" },
      { cantonese: "平啲得唔得", jyutping: "peng4 di1 dak1 m4 dak1", mandarin: "便宜点行吗", english: "Can it be cheaper?" },
      { cantonese: "太贵喇", jyutping: "taai3 gwai3 laa3", mandarin: "太贵了", english: "Too expensive" },
      { cantonese: "有冇平啲", jyutping: "jau5 mou5 peng4 di1", mandarin: "有没有便宜点的", english: "Do you have cheaper ones?" },
      { cantonese: "我睇下", jyutping: "ngo5 tai2 haa5", mandarin: "我看看", english: "Let me see" },
      { cantonese: "试下得唔得", jyutping: "si3 haa5 dak1 m4 dak1", mandarin: "可以试试吗", english: "Can I try?" },
      { cantonese: "有冇其他颜色", jyutping: "jau5 mou5 kei4 taa1 ngaan4 sik1", mandarin: "有没有其他颜色", english: "Do you have other colors?" },
      { cantonese: "包唔包", jyutping: "baau1 m4 baau1", mandarin: "包不包", english: "Is it wrapped?" },
      { cantonese: "可唔可以退", jyutping: "ho2 m4 ho2 ji5 teoi3", mandarin: "可不可以退", english: "Can I return it?" },
      { cantonese: "收唔收信用卡", jyutping: "sau1 m4 sau1 seon3 jung6 kaat1", mandarin: "收不收信用卡", english: "Do you accept credit cards?" },
    ],
  },
  {
    id: "directions",
    category: "问路指路",
    categoryEn: "Directions",
    phrases: [
      { cantonese: "去边度", jyutping: "heoi3 bin1 dou6", mandarin: "去哪里", english: "Where to go?" },
      { cantonese: "点去", jyutping: "dim2 heoi3", mandarin: "怎么去", english: "How to get there?" },
      { cantonese: "喺边度", jyutping: "hai2 bin1 dou6", mandarin: "在哪里", english: "Where is it?" },
      { cantonese: "行几耐", jyutping: "haang4 gei2 noi6", mandarin: "走多久", english: "How long to walk?" },
      { cantonese: "远唔远", jyutping: "jyun5 m4 jyun5", mandarin: "远不远", english: "Is it far?" },
      { cantonese: "转左", jyutping: "zyun3 zo2", mandarin: "左转", english: "Turn left" },
      { cantonese: "转右", jyutping: "zyun3 jau6", mandarin: "右转", english: "Turn right" },
      { cantonese: "直行", jyutping: "zik6 haang4", mandarin: "直走", english: "Go straight" },
      { cantonese: "搭地铁", jyutping: "daap3 dei6 tit3", mandarin: "坐地铁", english: "Take the MTR" },
      { cantonese: "搭巴士", jyutping: "daap3 baa1 si2", mandarin: "坐公交", english: "Take the bus" },
    ],
  },
  {
    id: "numbers",
    category: "数字时间",
    categoryEn: "Numbers & Time",
    phrases: [
      { cantonese: "一", jyutping: "jat1", mandarin: "一", english: "One" },
      { cantonese: "二", jyutping: "ji6", mandarin: "二", english: "Two" },
      { cantonese: "三", jyutping: "saam1", mandarin: "三", english: "Three" },
      { cantonese: "四", jyutping: "sei3", mandarin: "四", english: "Four" },
      { cantonese: "五", jyutping: "ng5", mandarin: "五", english: "Five" },
      { cantonese: "六", jyutping: "luk6", mandarin: "六", english: "Six" },
      { cantonese: "七", jyutping: "cat1", mandarin: "七", english: "Seven" },
      { cantonese: "八", jyutping: "baat3", mandarin: "八", english: "Eight" },
      { cantonese: "九", jyutping: "gau2", mandarin: "九", english: "Nine" },
      { cantonese: "十", jyutping: "sap6", mandarin: "十", english: "Ten" },
      { cantonese: "几点", jyutping: "gei2 dim2", mandarin: "几点", english: "What time?" },
      { cantonese: "而家", jyutping: "ji4 gaa1", mandarin: "现在", english: "Now" },
      { cantonese: "听日", jyutping: "ting1 jat6", mandarin: "明天", english: "Tomorrow" },
      { cantonese: "琴日", jyutping: "kam4 jat6", mandarin: "昨天", english: "Yesterday" },
    ],
  },
  {
    id: "feelings",
    category: "情感表达",
    categoryEn: "Feelings & Emotions",
    phrases: [
      { cantonese: "开心", jyutping: "hoi1 sam1", mandarin: "开心", english: "Happy" },
      { cantonese: "唔开心", jyutping: "m4 hoi1 sam1", mandarin: "不开心", english: "Unhappy" },
      { cantonese: "好攰", jyutping: "hou2 gui6", mandarin: "很累", english: "Very tired" },
      { cantonese: "肚饿", jyutping: "tou5 ngo6", mandarin: "饿了", english: "Hungry" },
      { cantonese: "口渴", jyutping: "hau2 hot3", mandarin: "口渴", english: "Thirsty" },
      { cantonese: "好热", jyutping: "hou2 jit6", mandarin: "很热", english: "Very hot" },
      { cantonese: "好冻", jyutping: "hou2 dung3", mandarin: "很冷", english: "Very cold" },
      { cantonese: "唔舒服", jyutping: "m4 syu1 fuk6", mandarin: "不舒服", english: "Not feeling well" },
      { cantonese: "好钟意", jyutping: "hou2 zung1 ji3", mandarin: "很喜欢", english: "Really like" },
      { cantonese: "唔钟意", jyutping: "m4 zung1 ji3", mandarin: "不喜欢", english: "Don't like" },
    ],
  },
]

// 粤语俗语和常用表达
export const cantoneseIdioms = [
  {
    cantonese: "得闲饮茶",
    jyutping: "dak1 haan4 jam2 caa4",
    mandarin: "有空喝茶",
    english: "Let's have tea when free",
    meaning: "粤语中常用的社交用语，表示改天再聚",
  },
  {
    cantonese: "食饱未",
    jyutping: "sik6 baau2 mei6",
    mandarin: "吃饱了吗",
    english: "Have you eaten?",
    meaning: "粤语中常见的问候语，类似于'你好'",
  },
  {
    cantonese: "冇问题",
    jyutping: "mou5 man6 tai4",
    mandarin: "没问题",
    english: "No problem",
    meaning: "表示同意或确认，非常常用",
  },
  {
    cantonese: "唔使客气",
    jyutping: "m4 sai2 haak3 hei3",
    mandarin: "不用客气",
    english: "You're welcome",
    meaning: "回应别人的感谢",
  },
  {
    cantonese: "慢慢行",
    jyutping: "maan6 maan6 haang4",
    mandarin: "慢走",
    english: "Take care / Walk slowly",
    meaning: "送别时的礼貌用语",
  },
]

// 粤语学习小贴士
export const learningTips = [
  {
    title: "声调练习",
    titleEn: "Tone Practice",
    content: "粤语有9个声调，建议每天练习10-15分钟，从简单的单字开始，逐步过渡到词组和句子。",
    contentEn: "Cantonese has 9 tones. Practice 10-15 minutes daily, starting with simple characters, then progressing to phrases and sentences.",
  },
  {
    title: "听力训练",
    titleEn: "Listening Training",
    content: "多看粤语电影、电视剧和新闻，培养语感。推荐从有字幕的内容开始。",
    contentEn: "Watch Cantonese movies, TV shows, and news to develop language sense. Start with subtitled content.",
  },
  {
    title: "日常应用",
    titleEn: "Daily Practice",
    content: "尝试在日常生活中使用粤语，即使只是简单的问候语，也能帮助记忆。",
    contentEn: "Try using Cantonese in daily life, even simple greetings help with memorization.",
  },
  {
    title: "粤拼学习",
    titleEn: "Jyutping Learning",
    content: "掌握粤拼（Jyutping）系统，这是学习粤语发音的重要工具。",
    contentEn: "Master the Jyutping system, an important tool for learning Cantonese pronunciation.",
  },
]

// 粤语文化知识扩展
export const culturalKnowledge = [
  {
    id: "tea-culture",
    icon: "🍵",
    title: "饮茶文化",
    titleEn: "Tea Culture",
    content: "在广东，'饮茶'不只是喝茶，而是指吃早茶或下午茶，通常会点各种点心如虾饺、烧卖、叉烧包等。这是广东人重要的社交活动，也是家人朋友聚会的好方式。",
    contentEn: "In Guangdong, 'yum cha' (drinking tea) is not just about tea, but refers to having dim sum for breakfast or afternoon tea, usually ordering various dishes like shrimp dumplings, siu mai, and char siu bao. This is an important social activity for Cantonese people and a great way for family and friends to gather.",
    tips: [
      "常见点心：虾饺、烧卖、叉烧包、肠粉、凤爪",
      "饮茶礼仪：用手指轻敲桌面表示感谢",
      "最佳时间：早上7点到中午12点",
    ],
    tipsEn: [
      "Common dim sum: Har gow, siu mai, char siu bao, cheung fun, phoenix claws",
      "Tea etiquette: Tap fingers on table to show thanks",
      "Best time: 7 AM to 12 PM",
    ],
  },
  {
    id: "cantonese-opera",
    icon: "🎭",
    title: "粤剧文化",
    titleEn: "Cantonese Opera",
    content: "粤剧是广东传统戏曲，被列入联合国非物质文化遗产。其唱腔优美动听，是了解粤语声调和韵律的好方法。著名的粤剧有《帝女花》、《紫钗记》等。",
    contentEn: "Cantonese opera is a traditional Guangdong opera art form, listed as UNESCO Intangible Cultural Heritage. Its beautiful singing is a great way to understand Cantonese tones and rhythm. Famous operas include 'Princess Chang Ping' and 'The Purple Hairpin'.",
    tips: [
      "特点：唱腔婉转、表演细腻",
      "著名演员：红线女、任剑辉、白雪仙",
      "学习价值：帮助理解粤语声调变化",
    ],
    tipsEn: [
      "Features: Melodious singing, delicate performance",
      "Famous performers: Hung Sin-nui, Yam Kim-fai, Pak Suet-sin",
      "Learning value: Helps understand Cantonese tone changes",
    ],
  },
  {
    id: "festivals",
    icon: "🏮",
    title: "节日习俗",
    titleEn: "Festival Customs",
    content: "广东地区保留了许多传统节日习俗，如舞狮、行花街、吃盆菜等。春节期间的'行花街'是广州特有的习俗，人们会到花市买年花，寓意新年好运。",
    contentEn: "The Guangdong region preserves many traditional festival customs, such as lion dances, flower markets, and poon choi. The 'flower market' during Spring Festival is a unique Guangzhou custom where people buy flowers for good luck in the new year.",
    tips: [
      "春节：派利是（红包）、行花街",
      "端午节：扒龙舟、吃粽子",
      "中秋节：赏月、吃月饼",
    ],
    tipsEn: [
      "Spring Festival: Give lai see (red envelopes), visit flower markets",
      "Dragon Boat Festival: Dragon boat racing, eat zongzi",
      "Mid-Autumn Festival: Moon gazing, eat mooncakes",
    ],
  },
  {
    id: "hongkong-culture",
    icon: "🌃",
    title: "香港文化",
    titleEn: "Hong Kong Culture",
    content: "香港是粤语流行文化的中心，粤语流行歌曲（粤语歌）和香港电影对全球华人产生了深远影响。从70年代的许冠杰到90年代的四大天王，粤语歌曲创造了辉煌的时代。",
    contentEn: "Hong Kong is the center of Cantonese pop culture. Cantonese pop songs (Cantopop) and Hong Kong films have had a profound impact on Chinese people worldwide. From Sam Hui in the 70s to the Four Heavenly Kings in the 90s, Cantopop created a glorious era.",
    tips: [
      "经典歌手：张学友、刘德华、Beyond乐队",
      "经典电影：《英雄本色》、《无间道》",
      "学习方法：通过歌曲和电影学习地道粤语",
    ],
    tipsEn: [
      "Classic singers: Jacky Cheung, Andy Lau, Beyond",
      "Classic films: A Better Tomorrow, Infernal Affairs",
      "Learning method: Learn authentic Cantonese through songs and movies",
    ],
  },
]
