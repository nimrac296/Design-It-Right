
import React from 'react';
import { FontPairing } from '../types';

interface FontOptionCardProps {
  pairing: FontPairing;
  isSelected: boolean;
  onSelect: () => void;
}

const FontOptionCard: React.FC<FontOptionCardProps> = ({ pairing, isSelected, onSelect }) => {
  const baseClasses = "p-5 rounded-xl border cursor-pointer transition-all duration-300 text-left flex flex-col justify-between h-full group relative overflow-hidden";
  const selectedClasses = "bg-brand-surface border-brand-accent shadow-[0_0_15px_rgba(45,212,191,0.2)]";
  const unselectedClasses = "bg-brand-bg border-brand-border hover:border-brand-text-muted hover:bg-brand-bg/80";

  return (
    <div
      onClick={onSelect}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      {/* Active Indicator */}
      {isSelected && (
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
      )}

      <div>
        {/* Large Font Preview */}
        <h3 
            style={{ fontFamily: pairing.titleFont }} 
            className={`text-3xl sm:text-4xl mb-2 leading-tight ${isSelected ? 'text-brand-text' : 'text-brand-text group-hover:text-white transition-colors'}`}
        >
            {pairing.name}
        </h3>
        
        {/* Body Text Preview */}
        <p 
            style={{ fontFamily: pairing.bodyFont }} 
            className={`text-sm line-clamp-2 ${isSelected ? 'text-brand-text-muted' : 'text-brand-text-muted/70 group-hover:text-brand-text-muted'}`}
        >
            The quick brown fox jumps over the lazy dog. 1234567890
        </p>
      </div>

      <div className={`mt-4 pt-3 border-t ${isSelected ? 'border-brand-border' : 'border-brand-border/50'} flex justify-between items-end`}>
        <span className="text-xs font-mono text-brand-text-muted uppercase tracking-wider opacity-60">
            {pairing.description.split(' ')[0]} Type
        </span>
         <span className={`text-xs ${isSelected ? 'text-brand-accent' : 'text-brand-text-muted'}`}>
            {isSelected ? 'Active' : 'Select'}
         </span>
      </div>
    </div>
  );
};

export default FontOptionCard;
