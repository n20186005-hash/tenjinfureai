// 天気データと「访客向けアドバイス」のロジック。
// サーバー側（ビルド時）とクライアント側（ライブ更新）の両方から利用するため、
// DOM に依存しない純粋な関数として実装する。

const API = 'https://api.open-meteo.com/v1/forecast';
// 天神ふれあい広場（福岡市役所西側）の座標
const LAT = 33.5904;
const LON = 130.4017;

export interface Wx {
  current: { temp: number; apparent: number; humidity: number; code: number; wind: number; isDay: boolean };
  today: { code: number; tmax: number; tmin: number; prob: number; windMax: number; uv: number; precipSum: number };
  forecast: { date: string; label: string; code: number; tmax: number; tmin: number; prob: number }[];
}

export interface Advice {
  wear: string[];
  play: string[];
  items: string[];
  risks: string[];
}

// Open-Meteo の生 JSON を正規化する
export function normalize(j: any): Wx | null {
  const c = j?.current;
  const d = j?.daily;
  if (!c || !d) return null;
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const forecast = (d.time as string[]).map((date: string, i: number) => {
    const day = new Date(`${date}T12:00:00`).getDay();
    const label = i === 0 ? '今日' : i === 1 ? '明日' : i === 2 ? '明後日' : weekdays[day];
    return {
      date,
      label,
      code: d.weather_code[i],
      tmax: Math.round(d.temperature_2m_max[i]),
      tmin: Math.round(d.temperature_2m_min[i]),
      prob: d.precipitation_probability_max?.[i] ?? 0,
    };
  });
  return {
    current: {
      temp: Math.round(c.temperature_2m),
      apparent: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      code: c.weather_code,
      wind: c.wind_speed_10m,
      isDay: c.is_day === 1,
    },
    today: {
      code: d.weather_code[0],
      tmax: Math.round(d.temperature_2m_max[0]),
      tmin: Math.round(d.temperature_2m_min[0]),
      prob: d.precipitation_probability_max?.[0] ?? 0,
      windMax: d.wind_speed_10m_max?.[0] ?? 0,
      uv: d.uv_index_max?.[0] ?? 0,
      precipSum: d.precipitation_sum?.[0] ?? 0,
    },
    forecast,
  };
}

// ビルド時 / クライアント双方で呼び出す取得関数
export async function fetchWeather(): Promise<Wx | null> {
  const url =
    `${API}?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,precipitation_sum` +
    `&timezone=auto&forecast_days=7&wind_speed_unit=kmh`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4500);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// WMO 天候コード → 日本語テキスト
export function wmoText(code: number): string {
  const m: Record<number, string> = {
    0: '晴れ', 1: '大体晴れ', 2: 'ところにより曇り', 3: '曇り',
    45: '霧', 48: '霧氷の霧',
    51: '弱い霧雨', 53: '霧雨', 55: '強い霧雨',
    56: '着氷性の霧雨', 57: '強い着氷性の霧雨',
    61: '弱い雨', 63: '雨', 65: '強い雨',
    66: '着氷性の雨', 67: '強い着氷性の雨',
    71: '弱い雪', 73: '雪', 75: '強い雪', 77: '雪あられ',
    80: 'にわか雨', 81: 'にわか雨', 82: '激しいにわか雨',
    85: '雪のにわか', 86: '強い雪のにわか',
    95: '雷雨', 96: 'ひょうを伴う雷雨', 99: '強いひょうを伴う雷雨',
  };
  return m[code] ?? 'その他';
}

export function wmoEmoji(code: number): string {
  const m: Record<number, string> = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️', 56: '🌧️', 57: '🌧️',
    61: '🌦️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '❄️', 77: '🌨️',
    80: '🌦️', 81: '🌧️', 82: '⛈️', 85: '🌨️', 86: '❄️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
  };
  return m[code] ?? '🌡️';
}

// 風速(km/h) → ビューフォート風力階級（概略）
export function beaufort(kmh: number): number {
  const upper = [1, 6, 12, 20, 29, 39, 50, 62];
  let level = 0;
  for (let i = 0; i < upper.length; i++) if (kmh >= upper[i]) level = i + 1;
  return level;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}

// 天候データから、访客がそのまま行動にできるアドバイスを組み立てる
export function buildAdvice(wx: Wx): Advice {
  const wear: string[] = [];
  const play: string[] = [];
  const items: string[] = [];
  const risks: string[] = [];

  const code = wx.current.code;
  const t = wx.today;
  const lvl = beaufort(wx.current.wind);
  const diff = t.tmax - t.tmin;

  const isThunder = code >= 95;
  const heavyRain = code === 55 || code === 65 || code === 81 || code === 82;
  const lightRain = code === 51 || code === 53 || code === 61 || code === 80;
  const isSnow = (code >= 71 && code <= 77) || code === 85 || code === 86;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isFog = code === 45 || code === 48;

  // ── 降水 ──
  if (isThunder) {
    risks.push('雷にご注意。山登りや海辺の水遊び、木の下での避雨は避けてください。');
    play.push('水上の催しは休止の可能性が高いです。');
  } else if (heavyRain) {
    risks.push('雨が強いので、谷や低い土地を避けて行動してください。');
    play.push('屋外でのんびりは難しく、遊覧船やロープウェイが運休の場合があります。');
    items.push('レインコート（風が強いので長傘は避えて）');
  } else if (isRain || isSnow) {
    if (isSnow) {
      wear.push('雪が降っています。足元にご注意ください（路面の凍結にも注意）。');
      items.push('滑りにくい靴');
    } else {
      wear.push('小雨です。足元が滑りやすいので歩行にご注意を。');
      play.push('屋外の催しは体感が悪くなります。');
      items.push('折りたたみ傘');
    }
  } else if (t.prob >= 60) {
    wear.push('今日は雨が降る可能性が高いです。雨具をお持ちください。');
    play.push('屋内施設を優先し、山や海辺の散策は別の日がおすすめです。');
    items.push('傘またはレインコート');
  } else if (t.prob >= 30) {
    items.push('念のため折りたたみ傘があると安心です。');
  }

  // ── 高温・紫外線 ──
  if (t.tmax >= 32) {
    wear.push('気温が高いので、涼しい時間帯の行動と軽装で。');
    play.push('屋外の滞在時間を短くし、こまめに休憩を。');
    items.push('日焼け止め、十分な飲み物、熱中症対策');
  }
  if (t.uv >= 5) {
    wear.push('紫外線が強いので日焼け止めを。');
    items.push('日焼け止め、サングラス、帽子');
  }

  // ── 低温・寒暖差 ──
  if (diff > 8) {
    wear.push('朝晩の温差が大きいので、羽織るものがあると便利です。');
  }
  if (t.tmax <= 10) {
    wear.push('気温が低いのでしっかり防寒を。');
    items.push('厚手のコート、マフラー');
  }

  // ── 風 ──
  if (lvl >= 7) {
    risks.push('強風です。看板や海辺の岩場から離れてください。');
    play.push('海上の屋外催しは休止の可能性が高いです。');
  } else if (lvl >= 5) {
    wear.push('風がやや強いです。');
    play.push('海辺の遊覧船や一部の屋外施設が運休の場合があります。');
    items.push('帽子は飛びやすいので、ゆったりした服装は避えて');
  }

  // ── 晴れ・曇り ──
  if (code === 0 || code === 1) {
    wear.push('天気が良く、屋外散策にぴったりです。');
    play.push('朝焼けや夕焼けの景色もおすすめです。');
    items.push('日焼け止めを忘れずに');
  } else if (code === 2 || code === 3) {
    wear.push('光が柔らかく、写真撮影に良い日です。');
    play.push('日差しがなく、長時間の屋外散策に向いています。');
  }

  // ── 霧 ──
  if (isFog) {
    risks.push('視界が悪いので、フェリーや便の遅れにご注意ください。');
    play.push('山や海の眺望には向きません。');
    items.push('マスク');
  }

  // 重複排除（挿入順を維持）
  const dedup = (a: string[]) => [...new Set(a)];
  const w = dedup(wear), p = dedup(play), it = dedup(items), r = dedup(risks);

  // 特段の注意がない穏やかな日は、やさしい案内を
  if (w.length === 0 && p.length === 0) {
    w.push('気温も落ち着いており、散策にちょうどよい日です。');
    p.push('屋外でのんびり過ごせます。');
  }

  return { wear: w, play: p, items: it, risks: r };
}

// 現在の天気カード（ベース）
export function renderBase(wx: Wx): string {
  const c = wx.current;
  const t = wx.today;
  const lvl = beaufort(c.wind);
  const windText = lvl <= 3 ? '微風' : lvl <= 5 ? 'やや強い風' : '強風';
  const uv = t.uv >= 5 ? `<span class="wx-chip wx-uv">紫外線 やや強め</span>` : '';
  return `
    <div class="wx-now">
      <div class="wx-temp">${c.temp}<span>℃</span></div>
      <div class="wx-cond">${wmoText(c.code)} ・ 体感 ${c.apparent}℃</div>
      <div class="wx-meta">降水 ${t.prob}% ・ 風 ${Math.round(c.wind)}km/h（${windText}）</div>
      <div class="wx-chips">${uv}</div>
    </div>`;
}

// 7日間予報
export function renderForecast(wx: Wx): string {
  const days = wx.forecast
    .map((f) => {
      const prob = f.prob >= 30 ? `<p class="wx-fc-prob">${f.prob}%</p>` : `<p class="wx-fc-prob">&nbsp;</p>`;
      return `
      <div class="wx-fc-day">
        <p class="wx-fc-label">${esc(f.label)}</p>
        <p class="wx-fc-emoji">${wmoEmoji(f.code)}</p>
        <p class="wx-fc-hi">${f.tmax}°</p>
        <p class="wx-fc-lo">${f.tmin}°</p>
        ${prob}
      </div>`;
    })
    .join('');
  return `<div class="wx-fc">${days}</div>`;
}

// アドバイスブロック（リスク + 3ブロック）
export function renderAdvice(a: Advice): string {
  const block = (title: string, arr: string[]) =>
    arr.length
      ? `<div class="wx-block"><h4>${title}</h4><ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`
      : '';
  const risk = a.risks.length
    ? `<div class="wx-risk">${a.risks.map((x) => `<p>⚠️ ${esc(x)}</p>`).join('')}</div>`
    : '';
  return `${risk}<div class="wx-blocks">${block('今日の服装', a.wear)}${block('おすすめの過ごし方', a.play)}${block('持ち物', a.items)}</div>`;
}
