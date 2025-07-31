import { Button } from '@/components/ui/button';

interface Props {
  previewUrl: string | null;
  format: string;
  onUpload: () => void;
  onDownload: () => void;
}

export default function PreviewAndActions({ previewUrl, format, onUpload, onDownload }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onUpload}>Upload</Button>
        <Button onClick={onDownload}>Download</Button>
      </div>
      {previewUrl && (
        <img src={previewUrl} alt="Live Preview" className="mt-4 max-w-lg rounded-xl shadow-md border" />
      )}
    </div>
  );
}