
export const UI_STRINGS = {
  en: {
    brand: "NT Explorer",
    welcomeTitle: "Explore Northern Taiwan",
    welcomeSubtitle: "Personalized AI Travel Guide",
    welcomeDesc: "Answer a few questions to find your perfect spots in Taipei, New Taipei, Keelung, and Taoyuan.",
    startBtn: "Start Discovery",
    question: "Question",
    refineTitle: "Refine Your Trip",
    refineSubtitle: "How would you like to travel today?",
    transport: "Transport",
    price: "Price Range",
    duration: "Duration",
    timeOfDay: "Time of Day",
    findBtn: "Find My Places",
    loadingTitle: "Curating your adventure...",
    loadingSubtitle: "We're matching the best 4+ star spots to your profile...",
    resultsTitle: "Your Matches",
    restartBtn: "Start Over",
    viewOnMaps: "Maps",
    tipsTitle: "Travel Tips",
    footerDesc: "AI-powered travel recommendations for Northern Taiwan.",
    destinations: "Cities",
    about: "Info"
  },
  zh: {
    brand: "北台探索",
    welcomeTitle: "探索北台灣",
    welcomeSubtitle: "您的 AI 專屬旅遊顧問",
    welcomeDesc: "回答幾個簡單問題，我們將為您推薦台北、新北、基隆及桃園的最優質去處。",
    startBtn: "開始探索",
    question: "問題",
    refineTitle: "完善您的行程",
    refineSubtitle: "您今天偏好什麼樣的旅遊方式？",
    transport: "交通方式",
    price: "價位預算",
    duration: "停留時程",
    timeOfDay: "白天/晚上",
    findBtn: "尋找景點與美食",
    loadingTitle: "正在為您規劃行程...",
    loadingSubtitle: "正在挑選最符合您偏好的 4 星以上優質地點...",
    resultsTitle: "為您精選的地點",
    restartBtn: "重新開始",
    viewOnMaps: "地圖",
    tipsTitle: "旅遊小撇步",
    footerDesc: "利用 AI 技術為您推薦北台灣最道地的旅遊體驗。",
    destinations: "城市範圍",
    about: "關於資訊"
  }
};

export const QUIZ_QUESTIONS = [
  {
    id: "activity",
    questionEn: "What's your preferred activity level?",
    questionZh: "您偏好的活動強度是？",
    options: [
      { value: "relaxed", labelEn: "Relaxed (Cafes, museums)", labelZh: "輕鬆閒適 (咖啡廳、博物館)" },
      { value: "active", labelEn: "Active (Hiking, walking)", labelZh: "活力十足 (登山、漫步)" }
    ]
  },
  {
    id: "interest",
    questionEn: "What's your main interest?",
    questionZh: "您主要的興趣是？",
    options: [
      { value: "nature", labelEn: "Nature & Scenery", labelZh: "自然景觀" },
      { value: "urban", labelEn: "Urban & Cultural", labelZh: "城市文化" }
    ]
  },
  {
    id: "food",
    questionEn: "What's your food style?",
    questionZh: "您偏好的美食風格？",
    options: [
      { value: "street", labelEn: "Local Street Food", labelZh: "在地小吃" },
      { value: "restaurant", labelEn: "Fine Dining", labelZh: "精緻餐廳" }
    ]
  },
  {
    id: "social",
    questionEn: "Who are you traveling with?",
    questionZh: "您這次是跟誰一起旅行？",
    options: [
      { value: "solo", labelEn: "Solo Traveler", labelZh: "獨自旅行" },
      { value: "group", labelEn: "Friends or Family", labelZh: "朋友或家人" }
    ]
  }
];

export const BRANCH_QUESTIONS = {
  solo: {
    id: "solo_exp",
    questionEn: "Is this your first time in Northern Taiwan?",
    questionZh: "這是您第一次來北台灣嗎？",
    options: [
      { value: "first", labelEn: "Yes, first time!", labelZh: "是的，第一次來！" },
      { value: "repeater", labelEn: "I've been here before.", labelZh: "我之前來過幾次。" }
    ]
  },
  group: {
    id: "group_type",
    questionEn: "What's your group composition?",
    questionZh: "您的成員組成主要是？",
    options: [
      { value: "friends", labelEn: "Young Friends / Energetic", labelZh: "年輕好友 / 充滿活力" },
      { value: "family_kids", labelEn: "Family with Kids", labelZh: "帶著小孩的家庭" },
      { value: "family_seniors", labelEn: "Family with Seniors", labelZh: "帶著長輩的家庭" }
    ]
  }
};

export const TRANSPORT_OPTIONS = ['MRT', 'Bus', 'Walking', 'Car'];
export const PRICE_OPTIONS = ['$', '$$', '$$$'];
export const DURATION_OPTIONS = ['1-2h', '3-5h', 'Full Day'];
export const TIME_OPTIONS = ['Daytime', 'Nightlife', 'Anytime'];
