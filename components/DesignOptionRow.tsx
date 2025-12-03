import React from 'react';
import { Check } from 'lucide-react';

interface DesignOptionRowProps {
  title: React.ReactNode;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const DesignOptionRow: React.FC<DesignOptionRowProps> = ({ title, description, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`group w-full p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-brand-surface border-brand-primary shadow-[0_0_10px_rgba(15,118,110,0.15)]' 
          : 'bg-brand-bg border-brand-border hover:bg-brand-bg/80 hover:border-brand-text-muted'
      }`}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <div className="flex-1 pr-4">
        <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-brand-text' : 'text-brand-text'}`}>
          {title}
        </h4>
        <p className={`text-xs sm:text-sm ${isSelected ? 'text-brand-accent' : 'text-brand-text-muted group-hover:text-brand-text'}`}>
          {description}
        </p>
      </div>
      
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
        isSelected 
          ? 'bg-brand-primary border-brand-primary' 
          : 'border-brand-text-muted bg-transparent group-hover:border-brand-text'
      }`}>
        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
    </div>
  );
};

export default DesignOptionRow;