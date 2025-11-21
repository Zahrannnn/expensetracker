'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CHART_COLORS } from '@/lib/constants';

interface CategoryColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

// Additional color palette matching Sage Garden theme
const THEME_COLORS = [
  '#6ab187', // Sage Green (primary)
  '#5e7a66', // Dark Sage
  '#d3c5a3', // Beige
  '#8b9d83', // Muted Green
  '#c9b896', // Warm Beige
  '#7a9b88', // Sea Green
  '#b8a88a', // Sand
  '#91a88f', // Moss
] as const;

const ALL_COLORS = [...THEME_COLORS, ...CHART_COLORS];

export function CategoryColorPicker({ value, onChange }: CategoryColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label>Color</Label>
      <div className="grid grid-cols-8 gap-2">
        {ALL_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`
              h-10 w-10 rounded-md border-2 transition-all
              hover:scale-110
              ${value === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'}
            `}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="custom-color" className="text-sm">
          Custom:
        </Label>
        <div className="flex items-center gap-2 flex-1">
          <Input
            id="custom-color"
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-20 cursor-pointer"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 font-mono text-sm"
            maxLength={7}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
        <div
          className="h-8 w-8 rounded-md border"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
