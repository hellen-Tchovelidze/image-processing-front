import React from "react";
import Cropper from "react-easy-crop";

interface Props {
  imageUrl: string;
  crop: { x: number; y: number };
  setCrop: (crop: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (z: number) => void;
  rotation: number;
  setRotation: (r: number) => void;
  onCropComplete: (croppedAreaPixels: any) => void;
  aspect?: number;
}

export default function ImageCropper({
  imageUrl,
  crop,
  setCrop,
  zoom,
  setZoom,
  rotation,
  setRotation,
  onCropComplete,
  aspect,
}: Props) {
  return (
    <div className="relative w-full h-[400px] bg-black">
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
        onCropComplete={(_, croppedAreaPixels) =>
          onCropComplete(croppedAreaPixels)
        }
        objectFit="contain"
        cropShape="rect"
        showGrid={true}
      />
    </div>
  );
}
