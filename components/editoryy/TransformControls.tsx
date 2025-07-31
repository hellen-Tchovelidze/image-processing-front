import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

interface Props {
  zoom: number;
  setZoom: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
  flipX: boolean;
  setFlipX: (b: boolean) => void;
  flipY: boolean;
  setFlipY: (b: boolean) => void;
  filter: string;
  setFilter: (f: string) => void;
}

export default function TransformControls({
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
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setFlipX(!flipX)}>
          Flip X
        </Button>
        <Button variant="outline" onClick={() => setFlipY(!flipY)}>
          Flip Y
        </Button>
        <Button variant="outline" onClick={() => setRotation(rotation + 90)}>
          Rotate
        </Button>
      </div>
      <div>
        <label>Zoom ({zoom})</label>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={[zoom]}
          onValueChange={([v]) => setZoom(v)}
        />
      </div>
      <div>
        <label>Filter</label>
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="grayscale">Grayscale</SelectItem>
            <SelectItem value="sepia">Sepia</SelectItem>
            <SelectItem value="invert">Invert</SelectItem>
            <SelectItem value="bright">Bright</SelectItem>
            <SelectItem value="contrast">Contrast</SelectItem>
            <SelectItem value="blur">Blur</SelectItem>
            <SelectItem value="saturate">Saturate</SelectItem>
            <SelectItem value="hue-rotate">Hue Rotate</SelectItem>
            <SelectItem value="drop-shadow">Drop Shadow</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
            <SelectItem value="soft">Soft</SelectItem>
            <SelectItem value="sharp">Sharp</SelectItem>
            <SelectItem value="vintage">Vintage</SelectItem>
            <SelectItem value="vhs">VHS</SelectItem>
            <SelectItem value="retro-tv">Retro TV</SelectItem>
            <SelectItem value="gameboy">GameBoy</SelectItem>
            <SelectItem value="film">Film</SelectItem>
            <SelectItem value="pop-90s">90s Pop</SelectItem>
            <SelectItem value="dreamy">Dreamy</SelectItem>
            <SelectItem value="neon">Neon</SelectItem>
            <SelectItem value="duotone">Duotone</SelectItem>
            <SelectItem value="washed">Washed</SelectItem>
            <SelectItem value="pastel">Pastel</SelectItem>
            <SelectItem value="oldpaper">Old Paper</SelectItem>
            <SelectItem value="technicolor">Technicolor</SelectItem>
            <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
            <SelectItem value="glitch">Glitch</SelectItem>
            <SelectItem value="lomo">Lomo</SelectItem>
            <SelectItem value="polaroid">Polaroid</SelectItem>
            <SelectItem value="cool-blue">Cool Blue</SelectItem>
            <SelectItem value="warm-sunset">Warm Sunset</SelectItem>
            <SelectItem value="noir">Noir</SelectItem>
            <SelectItem value="acid">Acid Pop</SelectItem>
            <SelectItem value="faded">Faded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
