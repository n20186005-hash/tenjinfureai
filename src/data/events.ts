export type EventItem = {
  date: string;
  title: string;
  category: '祭り' | '地域' | '文化' | 'スポーツ' | '季節';
  note?: string;
  featured?: boolean;
};

export const eventSchedule: EventItem[] = [
  { date: '4月26日', title: 'フレンドシップフェスティバル', category: '地域' },
  { date: '5月3日–4日', title: '博多どんたく港まつり', category: '祭り', note: 'フィナーレ会場として知られます。' },
  { date: '5月9日–10日', title: 'ふくおか建設フェスタ', category: '地域' },
  { date: '5月14日–6月14日', title: '福岡ボルドーワイン祭り', category: '季節' },
  { date: '7月13日', title: '博多祇園山笠 集団山笠見せ', category: '祭り' },
  { date: '7月17日–8月23日', title: '天神夏まつり2026', category: '祭り', note: '開催時間の目安 17:30–22:00。', featured: true },
  { date: '10月17日–18日', title: '筑後川のめぐみフェスティバル', category: '地域' },
  { date: '10月24日–25日', title: '環境フェスティバルふくおか', category: '地域' },
  { date: '10月31日', title: '防災フェア', category: '地域' },
  { date: '11月6日–8日', title: '福岡マラソン関連イベント', category: 'スポーツ' },
  { date: '11月13日–15日', title: 'ふくこいアジア祭り', category: '文化' },
  { date: '11月29日', title: '天神市', category: '地域' },
  { date: '12月6日', title: '障がい者週間記念イベント', category: '地域' },
  { date: '12月20日', title: 'クリスマス献血', category: '季節' },
];

export const eventTips = [
  {
    title: '昼と夜で表情が変わる',
    body: '昼は芝生の明るさ、夕方からは屋台や照明のにぎわいが魅力。写真を撮るなら開始直後と日没前後がおすすめです。',
  },
  {
    title: '雨天・混雑情報を確認',
    body: '屋外会場のため、開催時間や内容が変更される場合があります。来場前に主催者の最新案内をご確認ください。',
  },
  {
    title: '公共交通が便利',
    body: '天神駅、天神南駅、西鉄福岡（天神）駅から徒歩圏。大規模イベント日は公共交通の利用が安心です。',
  },
];
