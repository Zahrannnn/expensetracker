'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// Common icons for expense categories
const COMMON_ICONS = [
  'UtensilsCrossed',
  'Coffee',
  'Car',
  'Shirt',
  'Gamepad2',
  'Receipt',
  'Heart',
  'MoreHorizontal',
  'ShoppingCart',
  'Home',
  'Plane',
  'Book',
  'Music',
  'Film',
  'Dumbbell',
  'Gift',
  'Smartphone',
  'Laptop',
  'Wifi',
  'Zap',
  'Droplet',
  'Fuel',
  'Bus',
  'Train',
  'Bike',
  'Pizza',
  'IceCream',
  'Wine',
  'Stethoscope',
  'Pill',
  'Scissors',
  'Wrench',
  'Hammer',
  'PaintBucket',
  'Palette',
  'Camera',
  'Headphones',
  'Tv',
  'Watch',
  'Glasses',
  'Umbrella',
  'Briefcase',
  'GraduationCap',
  'Baby',
  'Dog',
  'Cat',
  'Trees',
  'Flower',
] as const;

interface CategoryIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function CategoryIconPicker({ value, onChange }: CategoryIconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = COMMON_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <Label>Icon</Label>
      <Input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
            
            if (!IconComponent) return null;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`
                  flex items-center justify-center p-3 rounded-md border-2 transition-all
                  hover:bg-accent hover:border-primary
                  ${value === iconName ? 'bg-primary/10 border-primary' : 'border-border'}
                `}
                title={iconName}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </ScrollArea>
      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <span className="font-medium">{value}</span>
        </div>
      )}
    </div>
  );
}
