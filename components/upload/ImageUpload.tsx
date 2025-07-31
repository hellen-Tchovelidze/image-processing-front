'use client'

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { imagesAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess?: (imageId: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setSelectedFile(imageFile);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await imagesAPI.upload(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      toast.success('Image uploaded successfully!');
      setSelectedFile(null);
      setUploadProgress(0);
      onUploadSuccess?.(response.data.id);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-accent'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileImage className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium">{selectedFile.name}</span>
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="glow"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Upload an Image</h3>
                <p className="text-muted-foreground">
                  Drag and drop your image here, or click to browse
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="glass"
              >
                Browse Files
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};