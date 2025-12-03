import React from 'react';

interface DesignOptionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const DesignOptionCard: React.FC<DesignOptionCardProps> = ({ title, description, isSelected, onSelect }) => {
  const baseClasses = "p-4 rounded-lg border cursor-pointer transition-all duration-200 text-left";
  // Restored: Selection uses Indigo (#4F46E5), unselected uses Slate (#1E293B)
  const selectedClasses = "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105";
  const unselectedClasses = "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-500";

  return (
    <div
      onClick={onSelect}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <h4 className="font-bold text-base">{title}</h4>
      <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{description}</p>
    </div>
  );
};

export default DesignOptionCard;