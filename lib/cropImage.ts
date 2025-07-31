export async function getCroppedImg(
  blob: Blob,
  croppedAreaPixels: { width: number; height: number; x: number; y: number },
  rotation = 0
): Promise<Blob> {
  const image = await createImage(URL.createObjectURL(blob));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);
  ctx.drawImage(
    image,
    (safeArea - image.width) / 2,
    (safeArea - image.height) / 2
  );

  const data = ctx.getImageData(
    croppedAreaPixels.x + (safeArea - image.width) / 2,
    croppedAreaPixels.y + (safeArea - image.height) / 2,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  ctx.putImageData(data, 0, 0);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
