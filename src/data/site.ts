export const site = {
  name: '天神ふれあい広場ガイド',
  shortName: 'TENJIN FUREAI',
  description: '福岡市役所西側ふれあい広場を、イベント・アクセス・周辺グルメ・まち歩きと一緒に楽しむ非公式ガイド。',
  address: '〒810-0001 福岡県福岡市中央区天神1丁目8-1',
  hours: '8:00–21:00',
  coordinates: {
    latitude: 33.5900083,
    longitude: 130.4011491,
  },
  mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=33.5900083%2C130.4011491',
  googleMapsUrl: 'https://maps.app.goo.gl/V5Cvs5Ht76AtTr7x8',
  rating: {
    value: 4.0,
    count: 1675,
    category: '公園',
    source: 'Google マップ',
    sourceUrl: 'https://maps.app.goo.gl/V5Cvs5Ht76AtTr7x8',
    syncedAt: '2026年10月',
  },
  ga4: 'G-HXM22WWPKP',
};

export const navigation = [
  { href: '/', label: 'ホーム' },
  { href: '/about', label: '広場を知る' },
  { href: '/events', label: 'イベント' },
  { href: '/access', label: 'アクセス' },
  { href: '/guide', label: '楽しみ方' },
  { href: '/food', label: '周辺グルメ' },
  { href: '/nearby', label: '周辺スポット' },
];

export const quickFacts = [
  { label: '場所', value: '福岡・天神の中心' },
  { label: '施設利用時間（目安）', value: '8:00–21:00' },
  { label: '最寄り', value: '地下鉄・西鉄から徒歩約4分' },
  { label: '特徴', value: '芝生とステージの都市広場' },
];
