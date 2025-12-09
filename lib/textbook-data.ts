// 上海牛津版初中英语教材数据库
export interface VocabularyItem {
  word: string
  phonetic: string
  meaning: string
  example?: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  vocabulary: VocabularyItem[]
  grammar?: string
  completed?: boolean
}

export interface Unit {
  id: string
  title: string
  theme: string
  lessons: Lesson[]
}

export interface Textbook {
  id: string
  grade: string
  semester: string
  units: Unit[]
}

// 初中一年级（6年级）上册
const grade6FirstSemester: Textbook = {
  id: "grade6-1",
  grade: "初中一年级（6年级）",
  semester: "上册",
  units: [
    {
      id: "u1",
      title: "Unit 1: Making Friends",
      theme: "结交朋友",
      lessons: [
        {
          id: "l1",
          title: "Reading: My First Day at School",
          content: `Hello! My name is Li Ming. Today is my first day at Garden City International School. I am very excited but also a little nervous.

In the morning, I met my new classmates. There are thirty students in my class. They come from different countries - China, Japan, Korea, and America. Everyone is very friendly.

My English teacher is Miss Wang. She is tall and has long black hair. She speaks English very well. She told us, "Welcome to our English class! This year, we will learn many interesting things together."

During the lunch break, I made a new friend. His name is Tom. He is from Canada. He likes playing basketball. I like basketball too! We decided to play together after school.

I think I will enjoy my new school life. I am looking forward to learning more and making more friends.`,
          vocabulary: [
            { word: "excited", phonetic: "/ɪkˈsaɪtɪd/", meaning: "兴奋的", example: "I am excited about the trip." },
            { word: "nervous", phonetic: "/ˈnɜːvəs/", meaning: "紧张的", example: "She felt nervous before the exam." },
            { word: "classmate", phonetic: "/ˈklɑːsmeɪt/", meaning: "同学", example: "He is my classmate." },
            {
              word: "friendly",
              phonetic: "/ˈfrendli/",
              meaning: "友好的",
              example: "The people here are very friendly.",
            },
            {
              word: "international",
              phonetic: "/ˌɪntəˈnæʃnəl/",
              meaning: "国际的",
              example: "This is an international school.",
            },
            { word: "forward", phonetic: "/ˈfɔːwəd/", meaning: "向前，盼望", example: "I look forward to seeing you." },
          ],
          grammar: "一般现在时 (Simple Present Tense): 用于描述经常发生的动作或状态",
        },
        {
          id: "l2",
          title: "Listening and Speaking: Introducing Yourself",
          content: `When you meet someone new, it's important to introduce yourself properly. Here are some useful expressions:

Basic Introductions:
- Hello! My name is...
- Nice to meet you!
- I'm from...
- I'm ... years old.

Talking About Hobbies:
- I like/love/enjoy...
- My hobby is...
- In my free time, I...

Example Dialogue:
A: Hi! I'm Sarah. What's your name?
B: Hello, Sarah! My name is David. Nice to meet you!
A: Nice to meet you too! Where are you from?
B: I'm from Beijing. How about you?
A: I'm from Shanghai. What do you like to do in your free time?
B: I enjoy playing the piano and reading books. What about you?
A: I love swimming and drawing!`,
          vocabulary: [
            { word: "introduce", phonetic: "/ˌɪntrəˈdjuːs/", meaning: "介绍", example: "Let me introduce myself." },
            { word: "properly", phonetic: "/ˈprɒpəli/", meaning: "正确地", example: "Please do it properly." },
            { word: "expression", phonetic: "/ɪkˈspreʃn/", meaning: "表达", example: "Learn useful expressions." },
            { word: "hobby", phonetic: "/ˈhɒbi/", meaning: "爱好", example: "Reading is my hobby." },
            { word: "dialogue", phonetic: "/ˈdaɪəlɒɡ/", meaning: "对话", example: "Practice this dialogue." },
          ],
        },
      ],
    },
    {
      id: "u2",
      title: "Unit 2: Our Animal Friends",
      theme: "动物朋友",
      lessons: [
        {
          id: "l3",
          title: "Reading: Animals Around Us",
          content: `Animals are our friends. They live with us on this beautiful planet. Different animals have different characteristics.

Dogs are loyal companions. They are friendly and intelligent. Many families keep dogs as pets. Dogs can help people in many ways. Some dogs help blind people walk safely. Some dogs help police officers catch criminals.

Cats are independent animals. They are clean and quiet. Cats spend a lot of time sleeping and grooming themselves. They are good at catching mice.

Pandas are rare animals from China. They have black and white fur. They love eating bamboo. Pandas are very cute and many people around the world love them.

Birds can fly in the sky. They sing beautiful songs. Some birds, like parrots, can even learn to speak human words!

We should protect animals and be kind to them. They make our world more wonderful.`,
          vocabulary: [
            { word: "loyal", phonetic: "/ˈlɔɪəl/", meaning: "忠诚的", example: "Dogs are loyal animals." },
            { word: "companion", phonetic: "/kəmˈpænjən/", meaning: "伙伴", example: "A dog is a good companion." },
            {
              word: "intelligent",
              phonetic: "/ɪnˈtelɪdʒənt/",
              meaning: "聪明的",
              example: "Dolphins are intelligent animals.",
            },
            {
              word: "independent",
              phonetic: "/ˌɪndɪˈpendənt/",
              meaning: "独立的",
              example: "Cats are independent animals.",
            },
            {
              word: "characteristic",
              phonetic: "/ˌkærəktəˈrɪstɪk/",
              meaning: "特征",
              example: "Each animal has its own characteristics.",
            },
            { word: "protect", phonetic: "/prəˈtekt/", meaning: "保护", example: "We should protect animals." },
          ],
          grammar: "形容词的用法 (Adjectives): 用于描述名词的特征",
        },
      ],
    },
    {
      id: "u3",
      title: "Unit 3: A Healthy Life",
      theme: "健康生活",
      lessons: [
        {
          id: "l4",
          title: "Reading: Good Habits for Health",
          content: `Health is very important for everyone. If we want to stay healthy, we need to develop good habits.

First, we should eat healthy food. Eat more vegetables and fruits. They are full of vitamins. Drink plenty of water every day. Try to eat less junk food like hamburgers and French fries.

Second, exercise is necessary. Do some sports every day. You can run, swim, play basketball, or ride a bike. Exercise makes our bodies strong.

Third, get enough sleep. Students need about 9-10 hours of sleep every night. Go to bed early and get up early. Don't stay up late playing computer games.

Fourth, keep clean. Wash your hands before meals. Brush your teeth twice a day. Take a shower regularly.

Finally, stay happy! Smile every day and think positive. Talk to your friends and family when you feel worried or sad.

Remember: A healthy body helps us study better and enjoy life more!`,
          vocabulary: [
            { word: "healthy", phonetic: "/ˈhelθi/", meaning: "健康的", example: "Eat healthy food." },
            { word: "develop", phonetic: "/dɪˈveləp/", meaning: "养成，发展", example: "Develop good habits." },
            { word: "vitamin", phonetic: "/ˈvɪtəmɪn/", meaning: "维生素", example: "Fruits have many vitamins." },
            { word: "plenty", phonetic: "/ˈplenti/", meaning: "大量", example: "Drink plenty of water." },
            { word: "exercise", phonetic: "/ˈeksəsaɪz/", meaning: "锻炼", example: "Exercise every day." },
            {
              word: "necessary",
              phonetic: "/ˈnesəsəri/",
              meaning: "必要的",
              example: "Sleep is necessary for health.",
            },
            { word: "positive", phonetic: "/ˈpɒzətɪv/", meaning: "积极的", example: "Think positive!" },
          ],
          grammar: "情态动词 should (Modal Verb 'should'): 表示建议或义务",
        },
      ],
    },
  ],
}

// 初中一年级（6年级）下册
const grade6SecondSemester: Textbook = {
  id: "grade6-2",
  grade: "初中一年级（6年级）",
  semester: "下册",
  units: [
    {
      id: "u4",
      title: "Unit 4: Seasons and Weather",
      theme: "季节与天气",
      lessons: [
        {
          id: "l5",
          title: "Reading: Four Seasons",
          content: `There are four seasons in a year: spring, summer, autumn, and winter. Each season is beautiful in its own way.

Spring comes after winter. The weather becomes warm. Trees turn green and flowers bloom everywhere. Birds sing happily. Spring is the season of new life. Many people go for picnics in spring.

Summer is the hottest season. The sun shines brightly. Children enjoy swimming in the pool or at the beach. They eat ice cream and drink cold juice. Summer vacation is the happiest time for students!

Autumn arrives when summer ends. The weather gets cool. Leaves turn yellow, orange, and red. Farmers harvest crops. Autumn is also called fall because leaves fall from trees.

Winter is cold. In some places, it snows. Children make snowmen and have snowball fights. People wear warm clothes like coats, scarves, and gloves. We celebrate Chinese New Year in winter.

Each season has its beauty. Which season do you like best?`,
          vocabulary: [
            { word: "season", phonetic: "/ˈsiːzn/", meaning: "季节", example: "Spring is my favorite season." },
            { word: "bloom", phonetic: "/bluːm/", meaning: "开花", example: "Flowers bloom in spring." },
            { word: "harvest", phonetic: "/ˈhɑːvɪst/", meaning: "收获", example: "Farmers harvest crops in autumn." },
            { word: "celebrate", phonetic: "/ˈselɪbreɪt/", meaning: "庆祝", example: "We celebrate festivals." },
            {
              word: "temperature",
              phonetic: "/ˈtemprətʃə/",
              meaning: "温度",
              example: "The temperature is high in summer.",
            },
          ],
        },
      ],
    },
    {
      id: "u5",
      title: "Unit 5: My Family",
      theme: "我的家庭",
      lessons: [
        {
          id: "l6",
          title: "Reading: A Happy Family",
          content: `I have a happy family. There are four people in my family: my father, my mother, my younger sister, and me.

My father is a doctor. He works in a big hospital. He is very busy, but he always finds time to play with us. He is tall and strong. He likes reading newspapers and watching sports programs on TV.

My mother is a teacher. She teaches Chinese in a primary school. She is kind and patient. She cooks delicious meals for us every day. Her hobby is gardening. Our balcony is full of beautiful flowers.

My sister is eight years old. She is in Grade 2. She is cute and active. She likes dancing and singing. Sometimes she is naughty, but I still love her very much.

I am a middle school student. I study hard and help my parents with housework. In my free time, I enjoy playing computer games and reading comic books.

We often spend weekends together. Sometimes we go to the park, sometimes we visit grandparents, and sometimes we just stay at home and watch movies. I love my family!`,
          vocabulary: [
            { word: "patient", phonetic: "/ˈpeɪʃnt/", meaning: "耐心的", example: "Teachers should be patient." },
            { word: "delicious", phonetic: "/dɪˈlɪʃəs/", meaning: "美味的", example: "This food is delicious." },
            { word: "gardening", phonetic: "/ˈɡɑːdnɪŋ/", meaning: "园艺", example: "She enjoys gardening." },
            { word: "naughty", phonetic: "/ˈnɔːti/", meaning: "淘气的", example: "My brother is sometimes naughty." },
            { word: "housework", phonetic: "/ˈhaʊswɜːk/", meaning: "家务", example: "I help with housework." },
          ],
        },
      ],
    },
  ],
}

// 初中二年级（7年级）上册
const grade7FirstSemester: Textbook = {
  id: "grade7-1",
  grade: "初中二年级（7年级）",
  semester: "上册",
  units: [
    {
      id: "u6",
      title: "Unit 6: Travelling Around",
      theme: "环游世界",
      lessons: [
        {
          id: "l7",
          title: "Reading: A Trip to Beijing",
          content: `Last summer holiday, my family and I went to Beijing. It was an amazing trip!

We took the high-speed train from Shanghai to Beijing. The journey took about five hours. I was very excited because it was my first time visiting the capital city of China.

On the first day, we visited Tian'anmen Square and the Forbidden City. Tian'anmen Square is enormous! The Forbidden City has a history of over 600 years. The ancient buildings are magnificent. Our tour guide told us many interesting stories about the emperors who lived there.

The next day, we climbed the Great Wall. It was tiring but worthwhile. Standing on the Great Wall, I felt so proud. The Great Wall is really one of the greatest wonders in the world!

We also visited the Summer Palace, the Temple of Heaven, and the Beijing Zoo. At the zoo, we saw giant pandas eating bamboo. They were so adorable!

The food in Beijing was delicious too. We tried Peking Duck, which was crispy and tasty. We also ate jiaozi and zhajiangmian.

This trip was unforgettable. I learned a lot about Chinese history and culture. I hope I can visit more places in China in the future!`,
          vocabulary: [
            {
              word: "amazing",
              phonetic: "/əˈmeɪzɪŋ/",
              meaning: "令人惊奇的",
              example: "It was an amazing experience.",
            },
            { word: "capital", phonetic: "/ˈkæpɪtl/", meaning: "首都", example: "Beijing is the capital of China." },
            { word: "enormous", phonetic: "/ɪˈnɔːməs/", meaning: "巨大的", example: "The square is enormous." },
            {
              word: "magnificent",
              phonetic: "/mæɡˈnɪfɪsnt/",
              meaning: "壮丽的",
              example: "The building is magnificent.",
            },
            { word: "ancient", phonetic: "/ˈeɪnʃənt/", meaning: "古代的", example: "This is an ancient city." },
            { word: "worthwhile", phonetic: "/ˌwɜːθˈwaɪl/", meaning: "值得的", example: "The trip was worthwhile." },
            {
              word: "unforgettable",
              phonetic: "/ˌʌnfəˈɡetəbl/",
              meaning: "难忘的",
              example: "It was an unforgettable journey.",
            },
          ],
          grammar: "一般过去时 (Simple Past Tense): 用于描述过去发生的动作",
        },
      ],
    },
    {
      id: "u7",
      title: "Unit 7: School Clubs",
      theme: "学校社团",
      lessons: [
        {
          id: "l8",
          title: "Reading: Join Our Clubs!",
          content: `Welcome to the new school year! Our school has many interesting clubs. Join one and make your school life more colorful!

Art Club:
Do you love drawing and painting? The Art Club is perfect for you! We meet every Wednesday afternoon. Members will learn different art techniques and create wonderful artworks. We also organize art exhibitions every semester.

Music Club:
Are you good at singing or playing instruments? Come to the Music Club! We practice together on Fridays. Whether you play the piano, guitar, violin, or drums, you're welcome! We perform at school concerts.

Sports Club:
If you're energetic and like sports, join the Sports Club! We have basketball, football, volleyball, and table tennis teams. Training is on Tuesday and Thursday afternoons. We compete with other schools.

Reading Club:
For book lovers! We meet every Monday to discuss the books we've read. We share our thoughts and recommend good books to each other. Sometimes we invite authors to give talks.

Science Club:
Interested in science experiments? The Science Club does exciting experiments every week. We explore physics, chemistry, and biology. Last year, we won first prize in the Science Fair!

Drama Club:
Do you want to be an actor? The Drama Club performs plays throughout the year. We learn acting skills, stage design, and scriptwriting. It's lots of fun!

Choose the club that interests you most and sign up today! Remember: clubs help you develop new skills and make friends!`,
          vocabulary: [
            { word: "club", phonetic: "/klʌb/", meaning: "俱乐部，社团", example: "I joined the music club." },
            { word: "technique", phonetic: "/tekˈniːk/", meaning: "技巧", example: "Learn art techniques." },
            { word: "exhibition", phonetic: "/ˌeksɪˈbɪʃn/", meaning: "展览", example: "We hold an art exhibition." },
            {
              word: "instrument",
              phonetic: "/ˈɪnstrəmənt/",
              meaning: "乐器",
              example: "He plays musical instruments.",
            },
            { word: "compete", phonetic: "/kəmˈpiːt/", meaning: "竞争", example: "We compete with other teams." },
            { word: "experiment", phonetic: "/ɪkˈsperɪmənt/", meaning: "实验", example: "Do science experiments." },
            { word: "develop", phonetic: "/dɪˈveləp/", meaning: "发展", example: "Develop new skills." },
          ],
        },
      ],
    },
  ],
}

// 初中二年级（7年级）下册
const grade7SecondSemester: Textbook = {
  id: "grade7-2",
  grade: "初中二年级（7年级）",
  semester: "下册",
  units: [
    {
      id: "u8",
      title: "Unit 8: Protecting Our Environment",
      theme: "保护环境",
      lessons: [
        {
          id: "l9",
          title: "Reading: Save Our Planet",
          content: `Our planet Earth is in danger. We are facing serious environmental problems. It's time for everyone to take action!

Air Pollution:
Cars and factories produce harmful gases. The air in many cities is polluted. Air pollution causes health problems and global warming. We should use public transportation more and plant more trees.

Water Pollution:
People throw rubbish into rivers and oceans. Factories pour waste water into rivers. This kills fish and other sea creatures. We must stop polluting water and keep it clean.

Plastic Problem:
We use too much plastic. Plastic bags and bottles don't decompose easily. They stay in the environment for hundreds of years. Animals sometimes eat plastic and die. We should use less plastic and recycle more.

Deforestation:
People cut down too many trees. Forests are homes for animals. Without forests, many animals will lose their homes. Trees also produce oxygen for us to breathe. We must protect forests.

What Can We Do?
Everyone can help! Here are some simple actions:
- Turn off lights when leaving a room
- Use reusable bags when shopping
- Don't waste water
- Recycle paper, plastic, and glass
- Walk or ride bikes for short distances
- Plant trees

If everyone does a little, together we can make a big difference! Let's work together to save our beautiful planet!`,
          vocabulary: [
            { word: "environment", phonetic: "/ɪnˈvaɪrənmənt/", meaning: "环境", example: "Protect the environment." },
            { word: "pollution", phonetic: "/pəˈluːʃn/", meaning: "污染", example: "Air pollution is serious." },
            { word: "harmful", phonetic: "/ˈhɑːmfl/", meaning: "有害的", example: "These gases are harmful." },
            { word: "recycle", phonetic: "/ˌriːˈsaɪkl/", meaning: "回收利用", example: "We should recycle plastic." },
            {
              word: "decompose",
              phonetic: "/ˌdiːkəmˈpəʊz/",
              meaning: "分解",
              example: "Plastic doesn't decompose easily.",
            },
            { word: "reusable", phonetic: "/ˌriːˈjuːzəbl/", meaning: "可重复使用的", example: "Use reusable bags." },
            {
              word: "deforestation",
              phonetic: "/diːˌfɒrɪˈsteɪʃn/",
              meaning: "砍伐森林",
              example: "Stop deforestation.",
            },
          ],
          grammar: "情态动词 must/should (Modal Verbs): 表示必须和应该",
        },
      ],
    },
  ],
}

// 初中三年级（8年级）上册
const grade8FirstSemester: Textbook = {
  id: "grade8-1",
  grade: "初中三年级（8年级）",
  semester: "上册",
  units: [
    {
      id: "u9",
      title: "Unit 9: Modern Technology",
      theme: "现代科技",
      lessons: [
        {
          id: "l10",
          title: "Reading: How Technology Changes Our Lives",
          content: `Technology has changed the way we live dramatically. Let's explore how modern technology affects our daily lives.

Communication:
In the past, people wrote letters that took days or weeks to arrive. Now, we can communicate instantly through smartphones and the internet. We send messages, make video calls, and share photos with people around the world in seconds. Social media platforms like WeChat and Instagram keep us connected with friends and family.

Education:
Technology has revolutionized education. Students can access online courses and learn from the best teachers globally. E-books are lighter and cheaper than traditional textbooks. Interactive learning apps make studying more engaging and fun. During the COVID-19 pandemic, online classes allowed students to continue learning from home.

Transportation:
Transportation has become faster and more convenient. High-speed trains travel at over 300 km/h. Electric cars are becoming popular as they're environmentally friendly. In some cities, people can rent shared bikes using apps on their phones. Scientists are even developing self-driving cars!

Medicine:
Medical technology saves countless lives. Advanced machines can detect diseases early. Surgeons use robots to perform precise operations. Telemedicine allows doctors to diagnose and treat patients remotely.

Entertainment:
We have endless entertainment options now. Streaming services provide movies and TV shows anytime. Virtual reality (VR) creates immersive gaming experiences. Artificial intelligence recommends music and videos based on our preferences.

However, technology also brings challenges. People spend too much time on screens. Privacy and security are concerns. We must use technology wisely and maintain a balance between online and offline life.

Technology will continue to advance. What innovations will the future bring? Only time will tell!`,
          vocabulary: [
            {
              word: "dramatically",
              phonetic: "/drəˈmætɪkli/",
              meaning: "戏剧性地",
              example: "Life has changed dramatically.",
            },
            { word: "instantly", phonetic: "/ˈɪnstəntli/", meaning: "立即", example: "Send messages instantly." },
            {
              word: "revolutionize",
              phonetic: "/ˌrevəˈluːʃənaɪz/",
              meaning: "彻底改革",
              example: "Technology revolutionized education.",
            },
            {
              word: "interactive",
              phonetic: "/ˌɪntərˈæktɪv/",
              meaning: "互动的",
              example: "Interactive learning is fun.",
            },
            {
              word: "convenient",
              phonetic: "/kənˈviːniənt/",
              meaning: "方便的",
              example: "Online shopping is convenient.",
            },
            {
              word: "immersive",
              phonetic: "/ɪˈmɜːsɪv/",
              meaning: "沉浸式的",
              example: "VR provides immersive experiences.",
            },
            {
              word: "innovation",
              phonetic: "/ˌɪnəˈveɪʃn/",
              meaning: "创新",
              example: "Technology brings innovations.",
            },
          ],
          grammar: "现在完成时 (Present Perfect Tense): 描述过去的动作对现在的影响",
        },
      ],
    },
  ],
}

// 初中三年级（8年级）下册
const grade8SecondSemester: Textbook = {
  id: "grade8-2",
  grade: "初中三年级（8年级）",
  semester: "下册",
  units: [
    {
      id: "u10",
      title: "Unit 10: Dreams and Future",
      theme: "梦想与未来",
      lessons: [
        {
          id: "l11",
          title: "Reading: Chasing Your Dreams",
          content: `Everyone has dreams. Dreams give us hope and motivation. They make life meaningful and exciting. But how can we turn our dreams into reality?

First, identify your passion. What do you love doing? What makes you happy? Your dream should be something that truly interests you, not what others expect from you. Some people dream of becoming doctors, teachers, or engineers. Others want to be artists, athletes, or entrepreneurs. Whatever your dream is, make sure it comes from your heart.

Second, set clear goals. A dream without a plan is just a wish. Break your big dream into smaller, achievable goals. For example, if you want to study at a top university, your goals might include: get good grades, improve English, participate in competitions, and develop leadership skills. Write down your goals and make a timeline.

Third, work hard and stay persistent. Success rarely comes easily. You will face obstacles and failures. When things get difficult, don't give up! Learn from your mistakes and keep trying. Remember: "Success is not final, failure is not fatal. It is the courage to continue that counts."

Fourth, never stop learning. The world changes fast. New knowledge and skills are always needed. Read books, take courses, and learn from successful people. Stay curious and open-minded.

Fifth, believe in yourself. Confidence is important. There will be people who doubt you. There will be times when you doubt yourself. But you must have faith in your abilities. As Walt Disney said, "If you can dream it, you can do it."

Finally, help others along the way. True success includes making a positive impact on others. Share your knowledge, inspire people, and make the world a better place.

Your dreams are worth fighting for. Start today, stay focused, and never give up. The future belongs to those who believe in the beauty of their dreams!`,
          vocabulary: [
            { word: "motivation", phonetic: "/ˌməʊtɪˈveɪʃn/", meaning: "动力", example: "Dreams give us motivation." },
            { word: "identify", phonetic: "/aɪˈdentɪfaɪ/", meaning: "识别，确定", example: "Identify your passion." },
            {
              word: "entrepreneur",
              phonetic: "/ˌɒntrəprəˈnɜː/",
              meaning: "企业家",
              example: "She wants to be an entrepreneur.",
            },
            { word: "achievable", phonetic: "/əˈtʃiːvəbl/", meaning: "可实现的", example: "Set achievable goals." },
            {
              word: "persistent",
              phonetic: "/pəˈsɪstənt/",
              meaning: "坚持不懈的",
              example: "Be persistent in pursuing dreams.",
            },
            { word: "obstacle", phonetic: "/ˈɒbstəkl/", meaning: "障碍", example: "Overcome obstacles." },
            { word: "confidence", phonetic: "/ˈkɒnfɪdəns/", meaning: "信心", example: "Have confidence in yourself." },
          ],
          grammar: "条件句 (Conditional Sentences): If引导的条件状语从句",
        },
      ],
    },
  ],
}

// 初中四年级（9年级）上册
const grade9FirstSemester: Textbook = {
  id: "grade9-1",
  grade: "初中四年级（9年级）",
  semester: "上册",
  units: [
    {
      id: "u11",
      title: "Unit 11: Cultural Exchange",
      theme: "文化交流",
      lessons: [
        {
          id: "l12",
          title: "Reading: Bridging Cultures",
          content: `In today's globalized world, cultural exchange has become increasingly important. Understanding and appreciating different cultures helps us build a more harmonious world.

Chinese Culture in the World:
Chinese culture has a history of over 5,000 years. Traditional Chinese festivals like Spring Festival, Mid-Autumn Festival, and Dragon Boat Festival are celebrated by Chinese communities worldwide. Chinese cuisine is popular globally - people enjoy dumplings, noodles, and hot pot. Chinese martial arts, such as kung fu and tai chi, attract students from many countries. Traditional Chinese Medicine provides alternative healthcare options. Chinese philosophy, including Confucianism and Taoism, influences thinking worldwide.

Western Influence in China:
Western culture has also influenced China significantly. Christmas and Valentine's Day are celebrated in Chinese cities. Western fast food chains are everywhere. Hollywood movies are popular among Chinese audiences. Many Chinese students study abroad in Western countries. Western music, from classical to rock, has many Chinese fans.

Benefits of Cultural Exchange:
Cultural exchange brings numerous benefits. It promotes mutual understanding and reduces prejudice. When people learn about other cultures, they realize that despite differences, humans share common values like love, friendship, and justice. Cultural exchange also stimulates creativity. When different cultures meet, new ideas and innovations emerge.

Challenges:
However, cultural exchange also presents challenges. Sometimes, cultural differences cause misunderstandings. Language barriers can make communication difficult. Some people worry about losing their cultural identity. It's important to appreciate other cultures while preserving our own.

Being a Global Citizen:
As young people in the 21st century, we should embrace cultural diversity. Learn foreign languages, travel to different countries, make international friends, and be open-minded. Remember: diversity makes the world beautiful, just as different flowers make a garden colorful.

Cultural exchange is not about one culture dominating another. It's about mutual respect, learning, and growth. Let's be bridges between cultures and contribute to a more connected and peaceful world!`,
          vocabulary: [
            {
              word: "globalized",
              phonetic: "/ˈɡləʊbəlaɪzd/",
              meaning: "全球化的",
              example: "We live in a globalized world.",
            },
            {
              word: "harmonious",
              phonetic: "/hɑːˈməʊniəs/",
              meaning: "和谐的",
              example: "Build a harmonious society.",
            },
            {
              word: "cuisine",
              phonetic: "/kwɪˈziːn/",
              meaning: "烹饪，菜肴",
              example: "Chinese cuisine is delicious.",
            },
            { word: "philosophy", phonetic: "/fəˈlɒsəfi/", meaning: "哲学", example: "Study Chinese philosophy." },
            {
              word: "mutual",
              phonetic: "/ˈmjuːtʃuəl/",
              meaning: "相互的",
              example: "Mutual understanding is important.",
            },
            { word: "prejudice", phonetic: "/ˈpredʒudɪs/", meaning: "偏见", example: "Reduce prejudice." },
            { word: "embrace", phonetic: "/ɪmˈbreɪs/", meaning: "拥抱，接受", example: "Embrace diversity." },
          ],
          grammar: "被动语态 (Passive Voice): 强调动作的承受者",
        },
      ],
    },
  ],
}

// 初中四年级（9年级）下册
const grade9SecondSemester: Textbook = {
  id: "grade9-2",
  grade: "初中四年级（9年级）",
  semester: "下册",
  units: [
    {
      id: "u12",
      title: "Unit 12: Preparation for High School",
      theme: "高中准备",
      lessons: [
        {
          id: "l13",
          title: "Reading: Ready for the Next Chapter",
          content: `As you approach the end of middle school, it's time to prepare for high school. This transition is an important milestone in your life. Here's how to get ready for this exciting new chapter.

Academic Preparation:
High school courses are more challenging than middle school. Review what you've learned and identify your weak areas. Strengthen your foundation in core subjects like mathematics, English, and science. Develop good study habits now - manage your time effectively, take organized notes, and ask questions when you don't understand something. These skills will serve you well in high school and beyond.

Mental Preparation:
High school brings new responsibilities and pressures. You'll have more homework, tougher exams, and greater expectations. It's normal to feel anxious, but don't let fear overwhelm you. Build your confidence by setting realistic goals and celebrating small achievements. Learn stress management techniques like deep breathing, exercise, or talking to friends. Remember: it's okay to ask for help when you need it.

Social Preparation:
You'll meet many new people in high school. Some of your middle school friends might go to different schools. Be open to making new friendships while maintaining old ones. Join clubs and activities to meet people with similar interests. Develop good communication skills - learn to express yourself clearly and listen to others respectfully.

Goal Setting:
Think about what you want to achieve in high school. Do you want to excel academically? Develop a particular skill? Participate in sports or arts? Having clear goals gives you direction and motivation. Write down your goals and review them regularly.

Life Skills:
High school is a good time to develop independence. Learn to manage your own schedule, pack your bag, and take responsibility for your belongings. Practice problem-solving skills - when you face difficulties, try to find solutions yourself before asking for help. These life skills will prepare you not just for high school, but for adulthood.

Looking Ahead:
High school is just the beginning. After high school comes university, career, and adult life. The habits and skills you develop now will shape your future. Embrace challenges, stay curious, and never stop learning.

The transition from middle school to high school is a significant step. Approach it with confidence, enthusiasm, and an open mind. You've learned so much in middle school - now it's time to apply that knowledge and grow even more. Good luck on your journey!`,
          vocabulary: [
            { word: "transition", phonetic: "/trænˈzɪʃn/", meaning: "过渡", example: "The transition to high school." },
            { word: "milestone", phonetic: "/ˈmaɪlstəʊn/", meaning: "里程碑", example: "Graduation is a milestone." },
            {
              word: "challenging",
              phonetic: "/ˈtʃælɪndʒɪŋ/",
              meaning: "有挑战性的",
              example: "High school is challenging.",
            },
            { word: "foundation", phonetic: "/faʊnˈdeɪʃn/", meaning: "基础", example: "Build a strong foundation." },
            {
              word: "overwhelm",
              phonetic: "/ˌəʊvəˈwelm/",
              meaning: "压倒",
              example: "Don't let stress overwhelm you.",
            },
            { word: "independence", phonetic: "/ˌɪndɪˈpendəns/", meaning: "独立", example: "Develop independence." },
            {
              word: "enthusiasm",
              phonetic: "/ɪnˈθjuːziæzəm/",
              meaning: "热情",
              example: "Approach life with enthusiasm.",
            },
          ],
          grammar: "复习总结: 综合运用各种时态和句型",
        },
      ],
    },
  ],
}

// 导出所有教材数据
export const shanghaiOxfordTextbooks: Textbook[] = [
  grade6FirstSemester,
  grade6SecondSemester,
  grade7FirstSemester,
  grade7SecondSemester,
  grade8FirstSemester,
  grade8SecondSemester,
  grade9FirstSemester,
  grade9SecondSemester,
]

// 辅助函数：根据年级获取教材
export function getTextbooksByGrade(gradeLevel: string): Textbook[] {
  return shanghaiOxfordTextbooks.filter((book) => book.grade.includes(gradeLevel))
}

// 辅助函数：根据ID获取教材
export function getTextbookById(id: string): Textbook | undefined {
  return shanghaiOxfordTextbooks.find((book) => book.id === id)
}
