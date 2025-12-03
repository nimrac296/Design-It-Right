import React from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isLocked?: boolean;
  icon?: LucideIcon;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  isLocked = false,
  icon: Icon
}) => {
  return (
    <div className={`border border-brand-border rounded-xl bg-brand-surface overflow-hidden mb-4 transition-all duration-300 ${isLocked ? 'opacity-60 grayscale' : ''}`}>
      <button
        type="button"
        onClick={isLocked ? undefined : onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-brand-bg/50' : 'hover:bg-brand-bg/30'}`}
        disabled={isLocked}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'text-brand-accent' : 'text-brand-text-muted'}`} />}
          <span className={`text-lg font-bold ${isOpen ? 'text-brand-text' : 'text-brand-text-muted'}`}>{title}</span>
        </div>
        
        <div className="flex items-center gap-3">
            {isLocked ? (
            <span className="text-xs text-brand-accent font-medium px-2 py-1 bg-brand-primary/10 rounded">Locked by Build Mode</span>
            ) : (
            isOpen ? <ChevronUp className="text-brand-accent" size={20} /> : <ChevronDown className="text-brand-text-muted" size={20} />
            )}
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 border-t border-brand-border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;