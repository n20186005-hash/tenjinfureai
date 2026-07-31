export type NearbySpot = {
  name: string;
  image: string;
  imageAlt: string;
  walk: string;
  stay: string;
  description: string;
  highlight: string;
};

export const nearbySpots: NearbySpot[] = [
  {
    name: '天神中央公園',
    image: '/images/nearby/tenjin-central-park.webp',
    imageAlt: '緑に包まれた天神中央公園',
    walk: '徒歩約3分',
    stay: '滞在 15–30分',
    description: '約3.1ヘクタールの都心のオアシス。芝生と水辺をつなぎ、広場のにぎわいから少し離れて休憩できます。',
    highlight: '芝生・川辺・休憩',
  },
  {
    name: 'アクロス福岡 ステップガーデン',
    image: '/images/nearby/acros-fukuoka.webp',
    imageAlt: '緑の階段状庭園を備えたアクロス福岡',
    walk: '徒歩約4分',
    stay: '滞在 30–45分',
    description: '建物南側を覆う段状の緑が、天神の象徴的な風景をつくります。都市建築と自然を一緒に楽しめる場所です。',
    highlight: '都市建築・緑・眺望',
  },
  {
    name: '水鏡天満宮',
    image: '/images/nearby/mizukagami-tenmangu.webp',
    imageAlt: '水鏡天満宮の社殿',
    walk: '徒歩約5分',
    stay: '滞在 15分',
    description: '菅原道真公を祀る小さな天満宮。「天神」という地名の由来をたどる、街歩きの大切な一地点です。',
    highlight: '天神の地名・歴史',
  },
  {
    name: '旧福岡県公会堂貴賓館',
    image: '/images/nearby/kihinkan.webp',
    imageAlt: 'フレンチ・ルネサンス様式の旧福岡県公会堂貴賓館',
    walk: '徒歩約8分',
    stay: '滞在 30–45分',
    description: '1910年竣工のフレンチ・ルネサンス様式の洋館。国の重要文化財で、天神・西中洲の近代史に触れられます。',
    highlight: '重要文化財・洋館',
  },
];

export const walkingRoute = [
  { time: '0分', place: '福岡市役所西側ふれあい広場', note: 'イベントと広場の空気を楽しむ' },
  { time: '3分', place: '天神中央公園', note: '芝生と川辺でひと休み' },
  { time: '7分', place: 'アクロス福岡', note: 'ステップガーデンを眺める' },
  { time: '15分', place: '水鏡天満宮', note: '「天神」の由来に触れる' },
  { time: '25分', place: '旧福岡県公会堂貴賓館', note: '洋館建築で締めくくる' },
];
