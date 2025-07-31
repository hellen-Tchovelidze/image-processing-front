export async function applyTransforms(
  img: HTMLImageElement,
  options: {
    flipX: boolean;
    flipY: boolean;
    filter: 'none' | 'grayscale' | 'sepia' | 'invert';
    format: 'webp' | 'jpeg' | 'png';
    quality: number;
    watermark?: { text: string };
    blur?: number;
    brightness?: number;
    contrast?: number;
  }
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.save();
  ctx.translate(
    options.flipX ? canvas.width : 0,
    options.flipY ? canvas.height : 0
  );
  ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);

  ctx.drawImage(img, 0, 0);
  ctx.restore();


  const filterParts = [];

  if (options.filter && options.filter !== 'none') {
    filterParts.push(options.filter);
  }

  if (options.blur) {
    filterParts.push(`blur(${options.blur}px)`);
  }

  if (options.brightness && options.brightness !== 1) {
    filterParts.push(`brightness(${options.brightness})`);
  }

  if (options.contrast && options.contrast !== 1) {
    filterParts.push(`contrast(${options.contrast})`);
  }

  if (filterParts.length > 0) {
    ctx.filter = filterParts.join(' ');
    ctx.drawImage(canvas, 0, 0); 
    ctx.filter = 'none'; 
  }


  if (options.watermark?.text) {
    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(options.watermark.text, canvas.width - 10, canvas.height - 10);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      `image/${options.format}`,
      options.quality
    );
  });
}
