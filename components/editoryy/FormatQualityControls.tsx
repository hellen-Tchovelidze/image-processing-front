import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface Props {
  format: 'png' | 'jpeg' | 'webp';
  setFormat: (f: 'png' | 'jpeg' | 'webp') => void;
  quality: number;
  setQuality: (q: number) => void;
}

export default function FormatQualityControls({ format, setFormat, quality, setQuality }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label>Format</label>
        <Select onValueChange={val => setFormat(val as any)} defaultValue={format}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
            <SelectItem value="webp">WEBP</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Compres ({Math.round(quality * 100)}%)</label>
        <Slider min={0.1} max={1} step={0.05} value={[quality]} onValueChange={([v]) => setQuality(v)} />
      </div>
    </div>
  );
}