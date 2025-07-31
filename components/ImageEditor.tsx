"use client";
import { useCallback, useEffect, useState } from "react";
import ImageCropper from "@/components/editoryy/ImageCropper";
import TransformControls from "@/components/editoryy/TransformControls";
import WatermarkControls from "@/components/editoryy/WatermarkControls";
import FormatQualityControls from "@/components/editoryy/FormatQualityControls";
import PreviewAndActions from "@/components/editoryy/PreviewAndActions";

import { applyTransforms } from "@/lib/canvasUtilssss";
import { getCroppedImg } from "@/lib/cropImage";
import { api } from "@/lib/api";

export default function ImageEditor() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [filter, setFilter] = useState("none");
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("webp");
  const [quality, setQuality] = useState(0.9);
  const [wmText, setWmText] = useState("");
  const [wmX, setWmX] = useState(30);
  const [wmY, setWmY] = useState(30);
  const [wmFontSize, setWmFontSize] = useState(24);
  const [wmColor, setWmColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");


  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
    }
  }, [image]);

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  const updatePreview = useCallback(async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    const originalBlob = await fetch(imageUrl).then((res) => res.blob());
    const croppedBlob = await getCroppedImg(
      originalBlob,
      croppedAreaPixels,
      rotation
    );
    const imgEl = await createImage(URL.createObjectURL(croppedBlob));
    const transformed = await applyTransforms(imgEl, {
      flipX,
      flipY,
      rotation,
      filter,
      watermark: {
        text: wmText,
        x: wmX,
        y: wmY,
        fontSize: wmFontSize,
        color: wmColor,
      },
      format,
      quality,
    });
    const url = URL.createObjectURL(transformed);
    setPreviewUrl(url);
  }, [
    imageUrl,
    croppedAreaPixels,
    flipX,
    flipY,
    rotation,
    filter,
    wmText,
    wmX,
    wmY,
    wmFontSize,
    wmColor,
    format,
    quality,
  ]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);





  const handleUpload = async () => {
    if (!previewUrl) return;
  
    try {
      const blob = await fetch(previewUrl).then(res => res.blob());
      const file = new File([blob], `edited.${format}`, { type: `image/${format}` });
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", "My Title");
      formData.append("desc", "My description");
  
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setUploadStatus("success");
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
    }
  };
  
  const handleDownload = async () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `edited.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])}
        className="mb-4"
      />

      {imageUrl && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <ImageCropper
              imageUrl={imageUrl}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              rotation={rotation}
              setRotation={setRotation}
              onCropComplete={setCroppedAreaPixels}
            />

            <TransformControls
              {...{
                zoom,
                setZoom,
                rotation,
                setRotation,
                flipX,
                setFlipX,
                flipY,
                setFlipY,
                filter,
                setFilter,
              }}
            />

            <WatermarkControls
              {...{
                wmText,
                setWmText,
                wmX,
                setWmX,
                wmY,
                setWmY,
                wmFontSize,
                setWmFontSize,
                wmColor,
                setWmColor,
              }}
            />

            <FormatQualityControls
              {...{
                format,
                setFormat,
                quality,
                setQuality,
              }}
            />

            <PreviewAndActions
              {...{
                previewUrl,
                format,
                onUpload: handleUpload,
                onDownload: handleDownload,
              }}
            />
          </div>

         
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Original</h2>
              <img
                src={imageUrl}
                alt="Original"
                className="rounded shadow max-w-full"
              />
            </div>

            {previewUrl && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Edited Preview</h2>
                <img
                  src={previewUrl}
                  alt="Edited"
                  className="rounded shadow max-w-full"
                />
              </div>

            )}

{uploadStatus === "success" && (
  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-4">
    ✅ Uploaded successfully!
  </div>
)}

{uploadStatus === "error" && (
  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg mt-4">
    ❌ Upload failed. Try again.
  </div>
)}

          </div>
        </div>
      )}
    </div>
  );
}
