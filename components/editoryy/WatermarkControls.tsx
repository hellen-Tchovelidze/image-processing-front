import { Input } from '@/components/ui/input';

interface Props {
  wmText: string;
  setWmText: (v: string) => void;
  wmX: number;
  setWmX: (v: number) => void;
  wmY: number;
  setWmY: (v: number) => void;
  wmFontSize: number;
  setWmFontSize: (v: number) => void;
  wmColor: string;
  setWmColor: (v: string) => void;
}

export default function WatermarkControls({
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
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input value={wmText} onChange={e => setWmText(e.target.value)} placeholder="Watermark text" />
      <Input type="number" value={wmX} onChange={e => setWmX(+e.target.value)} placeholder="X" />
      <Input type="number" value={wmY} onChange={e => setWmY(+e.target.value)} placeholder="Y" />
      <Input type="number" value={wmFontSize} onChange={e => setWmFontSize(+e.target.value)} placeholder="Font size" />
      <Input type="color" value={wmColor} onChange={e => setWmColor(e.target.value)} />
    </div>
  );
}