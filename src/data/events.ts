export type EventItem = {
  date: string;
  start: string; // ISO (YYYY-MM-DD) 予定開始日
  end: string; // ISO (YYYY-MM-DD) 予定終了日
  title: string;
  category: '祭り' | '地域' | '文化' | 'スポーツ' | '季節';
  note?: string;
  featured?: boolean;
};

// 2026年度の年間予定（参考）。実際の開催日は主催者発表をご確認ください。
export const eventSchedule: EventItem[] = [
  { date: '4月26日', start: '2026-04-26', end: '2026-04-26', title: 'フレンドシップフェスティバル', category: '地域' },
  { date: '5月3日–4日', start: '2026-05-03', end: '2026-05-04', title: '博多どんたく港まつり', category: '祭り', note: 'フィナーレ会場として知られます。' },
  { date: '5月9日–10日', start: '2026-05-09', end: '2026-05-10', title: 'ふくおか建設フェスタ', category: '地域' },
  { date: '5月14日–6月14日', start: '2026-05-14', end: '2026-06-14', title: '福岡ボルドーワイン祭り', category: '季節' },
  { date: '7月13日', start: '2026-07-13', end: '2026-07-13', title: '博多祇園山笠 集団山笠見せ', category: '祭り' },
  { date: '7月17日–8月23日', start: '2026-07-17', end: '2026-08-23', title: '天神夏まつり2026', category: '祭り', note: '開催時間の目安 17:30–22:00。', featured: true },
  { date: '10月17日–18日', start: '2026-10-17', end: '2026-10-18', title: '筑後川のめぐみフェスティバル', category: '地域' },
  { date: '10月24日–25日', start: '2026-10-24', end: '2026-10-25', title: '環境フェスティバルふくおか', category: '地域' },
  { date: '10月31日', start: '2026-10-31', end: '2026-10-31', title: '防災フェア', category: '地域' },
  { date: '11月6日–8日', start: '2026-11-06', end: '2026-11-08', title: '福岡マラソン関連イベント', category: 'スポーツ' },
  { date: '11月13日–15日', start: '2026-11-13', end: '2026-11-15', title: 'ふくこいアジア祭り', category: '文化' },
  { date: '11月29日', start: '2026-11-29', end: '2026-11-29', title: '天神市', category: '地域' },
  { date: '12月6日', start: '2026-12-06', end: '2026-12-06', title: '障がい者週間記念イベント', category: '地域' },
  { date: '12月20日', start: '2026-12-20', end: '2026-12-20', title: 'クリスマス献血', category: '季節' },
];

const toDate = (d: string) => new Date(`${d}T00:00:00`);

// 今週末（土〜日）に開催されるイベント
export function getThisWeekendEvents(now: Date = new Date()): EventItem[] {
  const dow = now.getDay(); // 0=日
  const sat = new Date(now);
  sat.setDate(now.getDate() + ((6 - dow) % 7));
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return eventSchedule.filter((e) => toDate(e.end) >= sat && toDate(e.start) <= sun);
}

// 直近の開催予定（本日以降、limimt 件）
export function getUpcomingEvents(limit = 3, now: Date = new Date()): EventItem[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return eventSchedule
    .filter((e) => toDate(e.end) >= today)
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())
    .slice(0, limit);
}

// 検索意図（「今日・今週末のイベント」）に答えるモジュール用データ
export function getEventNowModule(now: Date = new Date()): { heading: string; events: EventItem[] } {
  const weekend = getThisWeekendEvents(now);
  if (weekend.length) return { heading: '今週末のイベント', events: weekend };
  return { heading: '今後の開催予定', events: getUpcomingEvents(3, now) };
}

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
