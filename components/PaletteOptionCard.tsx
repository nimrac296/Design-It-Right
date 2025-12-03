import React from 'react';
import { ColorPalette } from '../types';

interface PaletteOptionCardProps {
  palette: ColorPalette;
  isSelected: boolean;
  onSelect: () => void;
}

const getLuminance = (hex: string) => {
  // Handle basic hex validation
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return 0;
  
  let c = hex.substring(1);
  if (c.length === 3) {
      c = c.split('').map(char => char + char).join('');
  }
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const PaletteOptionCard: React.FC<PaletteOptionCardProps> = ({ palette, isSelected, onSelect }) => {
  const { bg, cardBg, primary, text, accent } = palette.palette;
  
  // Filter to core colors to create a clean gradient
  // We exclude secondaryText and border as they often break the visual gradient with desaturated grays
  const colors = [text, primary, accent, bg, cardBg]
    .filter((c, i, arr) => arr.indexOf(c) === i) // Deduplicate (e.g. if cardBg == bg)
    .sort((a, b) => getLuminance(a) - getLuminance(b));

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all duration-300 text-left relative overflow-hidden group
        ${isSelected 
          ? 'bg-brand-surface border-brand-accent shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
          : 'bg-brand-bg border-brand-border hover:border-brand-text-muted'
        }
      `}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className={`font-bold text-sm ${isSelected ? 'text-brand-text' : 'text-brand-text-muted group-hover:text-brand-text'}`}>
          {palette.name}
        </h4>
        {isSelected && (
          <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
        )}
      </div>
      
      {/* Continuous Color Bar */}
      <div className="flex w-full h-10 rounded-lg overflow-hidden ring-1 ring-inset ring-white/10">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 h-full transition-[width] duration-300 hover:flex-[1.5]"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default PaletteOptionCard;