type CardSize = 'square' | 'postcard' | 'story';
type CardStyle = 'green' | 'festival' | 'night';

type SizeConfig = {
  width: number;
  height: number;
  label: string;
};

const sizeConfigs: Record<CardSize, SizeConfig> = {
  square: { width: 1200, height: 1200, label: '1:1 · 1200 × 1200 px' },
  postcard: { width: 1000, height: 1480, label: 'ポストカード縦 · 1000 × 1480 px' },
  story: { width: 1080, height: 1920, label: '9:16 · 1080 × 1920 px' },
};

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`必要な要素が見つかりません: ${selector}`);
  return element;
}

function getContext2D(target: HTMLCanvasElement): CanvasRenderingContext2D {
  const value = target.getContext('2d');
  if (!value) throw new Error('Canvas 2Dコンテキストの初期化に失敗しました。');
  return value;
}

const canvas = getElement<HTMLCanvasElement>('#card-canvas');
const context = getContext2D(canvas);

const cameraInput = document.querySelector<HTMLInputElement>('#camera-input');
const selfieInput = document.querySelector<HTMLInputElement>('#selfie-input');
const albumInput = document.querySelector<HTMLInputElement>('#album-input');
const fileStatus = document.querySelector<HTMLElement>('#file-status');
const titleInput = getElement<HTMLInputElement>('#title-input');
const dateInput = getElement<HTMLInputElement>('#date-input');
const messageInput = getElement<HTMLInputElement>('#message-input');
const zoomControl = getElement<HTMLInputElement>('#zoom-control');
const zoomValue = document.querySelector<HTMLElement>('#zoom-value');
const xControl = getElement<HTMLInputElement>('#x-control');
const yControl = getElement<HTMLInputElement>('#y-control');
const sizeLabel = document.querySelector<HTMLElement>('#size-label');
const downloadButton = document.querySelector<HTMLButtonElement>('#download-button');
const resetButton = document.querySelector<HTMLButtonElement>('#reset-button');
const downloadStatus = document.querySelector<HTMLElement>('#download-status');

const today = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date()).replaceAll('/', '.');

dateInput.value = today;

let selectedSize: CardSize = 'square';
let selectedStyle: CardStyle = 'green';
let sourceImage = new Image();
let imageReady = false;
let currentObjectUrl: string | null = null;

sourceImage.decoding = 'async';
sourceImage.onload = () => {
  imageReady = true;
  renderCard();
};
sourceImage.onerror = () => {
  imageReady = false;
  fileStatus && (fileStatus.textContent = '画像を読み込めませんでした。別の画像をお試しください。');
  renderCard();
};
sourceImage.src = '/images/plaza/night-aerial.webp';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
  const zoom = Number(zoomControl.value) / 100;
  const panX = Number(xControl.value) / 100;
  const panY = Number(yControl.value) / 100;
  const baseScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const scale = baseScale * zoom;
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const overflowX = Math.max(0, drawWidth - width);
  const overflowY = Math.max(0, drawHeight - height);
  const drawX = x - overflowX / 2 + (overflowX / 2) * panX;
  const drawY = y - overflowY / 2 + (overflowY / 2) * panY;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function setFontToFit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, initialSize: number, minSize: number, weight = 700): number {
  let size = initialSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawGreenStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const margin = Math.round(width * 0.045);
  const footerHeight = Math.round(height * 0.255);

  ctx.fillStyle = '#f3efe2';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  roundedRect(ctx, margin, margin, width - margin * 2, height - margin * 2, Math.round(width * 0.03));
  ctx.clip();
  if (imageReady) drawCoverImage(ctx, sourceImage, margin, margin, width - margin * 2, height - margin * 2);
  ctx.restore();

  const gradient = ctx.createLinearGradient(0, height - footerHeight * 1.45, 0, height);
  gradient.addColorStop(0, 'rgba(23,33,27,0)');
  gradient.addColorStop(0.34, 'rgba(23,33,27,0.7)');
  gradient.addColorStop(1, 'rgba(23,33,27,0.97)');
  ctx.fillStyle = gradient;
  ctx.fillRect(margin, height - footerHeight * 1.45, width - margin * 2, footerHeight * 1.45 - margin);

  ctx.fillStyle = '#e5a73a';
  ctx.beginPath();
  ctx.arc(width - margin * 1.7, margin * 1.7, width * 0.052, 0, Math.PI * 2);
  ctx.fill();

  const textX = margin * 1.65;
  const titleY = height - footerHeight * 0.62;
  const title = titleInput.value.trim() || '福岡市役所西側ふれあい広場';
  const titleSize = setFontToFit(ctx, title, width - textX * 2, width * 0.058, width * 0.031, 700);
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${titleSize}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
  ctx.fillText(title, textX, titleY);

  ctx.fillStyle = '#e5a73a';
  ctx.font = `800 ${Math.round(width * 0.021)}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  ctx.fillText((messageInput.value.trim() || 'TENJIN, FUKUOKA').toUpperCase(), textX, titleY + width * 0.05);

  ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.font = `700 ${Math.round(width * 0.022)}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(dateInput.value.trim(), width - textX, titleY + width * 0.05);
  ctx.textAlign = 'left';
}

function drawFestivalStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const band = Math.round(height * 0.22);
  ctx.fillStyle = '#d94a32';
  ctx.fillRect(0, 0, width, height);
  if (imageReady) drawCoverImage(ctx, sourceImage, 0, 0, width, height - band);

  const topShade = ctx.createLinearGradient(0, 0, 0, height - band);
  topShade.addColorStop(0, 'rgba(217,74,50,.12)');
  topShade.addColorStop(1, 'rgba(23,33,27,.36)');
  ctx.fillStyle = topShade;
  ctx.fillRect(0, 0, width, height - band);

  ctx.fillStyle = '#d94a32';
  ctx.fillRect(0, height - band, width, band);
  ctx.fillStyle = '#e5a73a';
  ctx.fillRect(0, height - band, width, Math.max(10, Math.round(height * 0.012)));

  const dotRadius = Math.max(6, Math.round(width * 0.009));
  ctx.fillStyle = 'rgba(229,167,58,.65)';
  for (let x = dotRadius * 2; x < width; x += dotRadius * 5) {
    ctx.beginPath();
    ctx.arc(x, height - band * 0.21, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const pad = width * 0.065;
  const title = titleInput.value.trim() || '福岡市役所西側ふれあい広場';
  const titleSize = setFontToFit(ctx, title, width - pad * 2, width * 0.061, width * 0.032, 700);
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${titleSize}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
  ctx.fillText(title, pad, height - band * 0.55);

  ctx.font = `800 ${Math.round(width * 0.021)}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,.76)';
  ctx.fillText((messageInput.value.trim() || 'TENJIN, FUKUOKA').toUpperCase(), pad, height - band * 0.30);
  ctx.textAlign = 'right';
  ctx.fillText(dateInput.value.trim(), width - pad, height - band * 0.30);
  ctx.textAlign = 'left';

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(4, width * 0.005);
  ctx.strokeRect(width * 0.025, width * 0.025, width * 0.95, height - width * 0.05);
}

function drawNightStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(0, 0, width, height);
  if (imageReady) drawCoverImage(ctx, sourceImage, 0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, height * 0.4, 0, height);
  gradient.addColorStop(0, 'rgba(7,13,26,0)');
  gradient.addColorStop(0.5, 'rgba(7,13,26,.62)');
  gradient.addColorStop(1, 'rgba(7,13,26,.98)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const pad = width * 0.07;
  ctx.strokeStyle = 'rgba(229,167,58,.9)';
  ctx.lineWidth = Math.max(2, width * 0.003);
  ctx.beginPath();
  ctx.moveTo(pad, height * 0.76);
  ctx.lineTo(width - pad, height * 0.76);
  ctx.stroke();

  ctx.fillStyle = '#e5a73a';
  ctx.font = `800 ${Math.round(width * 0.019)}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  ctx.fillText((messageInput.value.trim() || 'TENJIN, FUKUOKA').toUpperCase(), pad, height * 0.81);

  const title = titleInput.value.trim() || '福岡市役所西側ふれあい広場';
  const titleSize = setFontToFit(ctx, title, width - pad * 2, width * 0.065, width * 0.032, 700);
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${titleSize}px "Yu Mincho", "Hiragino Mincho ProN", serif`;
  ctx.fillText(title, pad, height * 0.89);

  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.font = `700 ${Math.round(width * 0.022)}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(dateInput.value.trim(), width - pad, height * 0.95);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = Math.max(2, width * 0.002);
  ctx.strokeRect(width * 0.028, width * 0.028, width * 0.944, height - width * 0.056);
}

function renderCard(): void {
  const config = sizeConfigs[selectedSize];
  canvas.width = config.width;
  canvas.height = config.height;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (selectedStyle === 'green') drawGreenStyle(context, canvas.width, canvas.height);
  if (selectedStyle === 'festival') drawFestivalStyle(context, canvas.width, canvas.height);
  if (selectedStyle === 'night') drawNightStyle(context, canvas.width, canvas.height);

  if (sizeLabel) sizeLabel.textContent = config.label;
  if (zoomValue) zoomValue.textContent = `${zoomControl.value}%`;
}

function loadSelectedFile(file: File | undefined): void {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    fileStatus && (fileStatus.textContent = '画像ファイルを選択してください。');
    return;
  }
  if (file.size > 25 * 1024 * 1024) {
    fileStatus && (fileStatus.textContent = '25MB以下の画像を選択してください。');
    return;
  }
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = URL.createObjectURL(file);
  imageReady = false;
  sourceImage = new Image();
  sourceImage.decoding = 'async';
  sourceImage.onload = () => {
    imageReady = true;
    fileStatus && (fileStatus.textContent = `${file.name} を端末内で読み込みました。`);
    renderCard();
  };
  sourceImage.onerror = () => {
    imageReady = false;
    fileStatus && (fileStatus.textContent = '画像を読み込めませんでした。別の画像をお試しください。');
  };
  sourceImage.src = currentObjectUrl;
}

[cameraInput, selfieInput, albumInput].forEach((input) => {
  input?.addEventListener('change', () => loadSelectedFile(input.files?.[0]));
});

document.querySelectorAll<HTMLInputElement>('input[name="card-size"]').forEach((input) => {
  input.addEventListener('change', () => {
    selectedSize = input.value as CardSize;
    renderCard();
  });
});

document.querySelectorAll<HTMLInputElement>('input[name="card-style"]').forEach((input) => {
  input.addEventListener('change', () => {
    selectedStyle = input.value as CardStyle;
    renderCard();
  });
});

[titleInput, dateInput, messageInput, zoomControl, xControl, yControl].forEach((input) => {
  input.addEventListener('input', renderCard);
});

downloadButton?.addEventListener('click', () => {
  renderCard();
  canvas.toBlob((blob) => {
    if (!blob) {
      downloadStatus && (downloadStatus.textContent = '画像の生成に失敗しました。');
      return;
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `tenjin-fureai-${dateInput.value.trim().replaceAll('.', '-') || 'memory'}.jpg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    downloadStatus && (downloadStatus.textContent = '記念カードを端末に保存しました。');
  }, 'image/jpeg', 0.94);
});

resetButton?.addEventListener('click', () => {
  selectedSize = 'square';
  selectedStyle = 'green';
  document.querySelector<HTMLInputElement>('input[name="card-size"][value="square"]')!.checked = true;
  document.querySelector<HTMLInputElement>('input[name="card-style"][value="green"]')!.checked = true;
  titleInput.value = '福岡市役所西側ふれあい広場';
  dateInput.value = today;
  messageInput.value = 'TENJIN, FUKUOKA';
  zoomControl.value = '100';
  xControl.value = '0';
  yControl.value = '0';
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  imageReady = false;
  sourceImage = new Image();
  sourceImage.decoding = 'async';
  sourceImage.onload = () => {
    imageReady = true;
    renderCard();
  };
  sourceImage.src = '/images/plaza/night-aerial.webp';
  fileStatus && (fileStatus.textContent = 'サンプル写真に戻しました。');
  downloadStatus && (downloadStatus.textContent = '');
  renderCard();
});

renderCard();
