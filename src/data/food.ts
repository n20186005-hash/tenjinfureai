export type FoodSpot = {
  name: string;
  reading: string;
  image: string;
  imageAlt: string;
  walk: string;
  genre: string;
  description: string;
  signature: string;
  address: string;
  hours: string;
};

export const foodSpots: FoodSpot[] = [
  {
    name: '元祖博多めんたい重',
    reading: 'がんそ はかた めんたいじゅう',
    image: '/images/food/mentaiju.webp',
    imageAlt: '元祖博多めんたい重の店舗外観',
    walk: '徒歩約8分',
    genre: '明太子料理',
    description: '西中洲で味わう、明太子を主役にした福岡らしい一膳。朝から夜まで使いやすく、初めての博多グルメにも。',
    signature: '元祖博多めんたい重',
    address: '中央区西中洲6-15',
    hours: '7:00–22:30（目安）',
  },
  {
    name: '天神ホルモン 総本店',
    reading: 'てんじんホルモン そうほんてん',
    image: '/images/food/tenjin-horumon.jpg',
    imageAlt: '天神ホルモン総本店の店頭',
    walk: '徒歩約6分',
    genre: '鉄板焼・ホルモン',
    description: '目の前の鉄板で焼き上げるライブ感が魅力。買い物やイベントの前後に、しっかり食べたい日に向きます。',
    signature: 'ホルモン鉄板定食',
    address: '中央区天神2-11-3 ソラリアステージB2F',
    hours: '平日11:00–22:00／土日祝10:00–22:00（目安）',
  },
  {
    name: '博多もつ鍋 一藤 天神西通り店',
    reading: 'はかたもつなべ いちふじ',
    image: '/images/food/ichifuji.webp',
    imageAlt: '博多もつ鍋一藤のもつ鍋と料理',
    walk: '徒歩約12分',
    genre: 'もつ鍋',
    description: '夜の天神散策を、福岡名物のもつ鍋で締めくくる一軒。複数人でゆっくり食事をしたい日におすすめです。',
    signature: '味噌もつ鍋',
    address: '中央区大名2-6-4 プラスゲート天神ビル2F',
    hours: '17:00–23:00頃（曜日により変動）',
  },
];
