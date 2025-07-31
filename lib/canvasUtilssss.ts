export async function applyTransforms(
  image: HTMLImageElement,
  {
    flipX = false,
    flipY = false,
    rotation = 0,
    filter = "none",
    watermark,
    format = "webp",
    quality = 0.8,
  }: {
    flipX?: boolean;
    flipY?: boolean;
    rotation?: number;
    filter?: string;
    watermark?: {
      text: string;
      x?: number;
      y?: number;
      fontSize?: number;
      color?: string;
    };
    format?: "jpeg" | "png" | "webp";
    quality?: number;
  }
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const angle = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));

  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.filter = getCssFilter(filter);

  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();

  if (watermark?.text) {
    const x = watermark.x ?? 30;
    const y = watermark.y ?? canvas.height - 30;
    const fontSize = watermark.fontSize ?? 20;
    const color = watermark.color ?? "rgba(255,255,255,0.6)";

    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(watermark.text, x, y);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), `image/${format}`, quality);
  });
}

function getCssFilter(filter: string): string {
  switch (filter) {
    case "grayscale":
      return "grayscale(1)";
    case "sepia":
      return "sepia(1)";
    case "invert":
      return "invert(1)";
    case "bright":
      return "brightness(1.3)";
    case "contrast":
      return "contrast(1.5)";
    case "blur":
      return "blur(4px)";
    case "saturate":
      return "saturate(200%)";
    case "hue-rotate":
      return "hue-rotate(90deg)";
    case "drop-shadow":
      return "drop-shadow(2px 4px 6px black)";
    case "warm":
      return "sepia(20%) saturate(150%) brightness(110%)";
    case "cold":
      return "brightness(90%) contrast(120%) hue-rotate(190deg)";
    case "soft":
      return "brightness(110%) saturate(120%) blur(1px)";
    case "sharp":
      return "contrast(200%)";

    case "vintage":
      return "sepia(50%) contrast(85%) brightness(120%) saturate(70%)";

    case "vhs":
      return "contrast(80%) hue-rotate(260deg) saturate(150%) brightness(110%)";

    case "retro-tv":
      return "contrast(160%) saturate(120%) blur(1px)";

    case "gameboy":
      return "grayscale(100%) brightness(90%) hue-rotate(70deg) contrast(60%)";

    case "film":
      return "sepia(30%) brightness(105%) contrast(95%) saturate(120%)";

    case "pop-90s":
      return "saturate(300%) hue-rotate(330deg) contrast(110%)";

    case "dreamy":
      return "blur(1px) brightness(120%) saturate(180%)";
    case "neon":
      return "brightness(150%) contrast(130%) hue-rotate(180deg)";
    case "duotone":
      return "grayscale(100%) contrast(120%) brightness(110%) hue-rotate(300deg)";
    case "washed":
      return "brightness(110%) contrast(80%) saturate(60%)";

    case "pastel":
      return "saturate(80%) brightness(115%) hue-rotate(20deg)";
    case "oldpaper":
      return "sepia(40%) contrast(90%) brightness(95%)";
    case "technicolor":
      return "saturate(500%) hue-rotate(90deg)";
    case "cyberpunk":
      return "contrast(150%) brightness(130%) hue-rotate(300deg)";
    case "glitch":
      return "contrast(200%) saturate(200%) hue-rotate(45deg)";

    case "lomo":
      return "contrast(120%) saturate(130%) brightness(110%)";
    case "polaroid":
      return "sepia(30%) brightness(115%) contrast(105%)";
    case "cool-blue":
      return "hue-rotate(180deg) brightness(105%) saturate(110%)";
    case "warm-sunset":
      return "sepia(20%) brightness(110%) hue-rotate(20deg) saturate(150%)";
    case "noir":
      return "grayscale(100%) contrast(140%)";
    case "acid":
      return "hue-rotate(270deg) saturate(300%) contrast(150%)";
    case "faded":
      return "brightness(120%) contrast(80%) saturate(60%)";
    default:
      return "none";
  }
}
