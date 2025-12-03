import React from 'react';

interface OptionButtonProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isCorrect?: boolean;
  isSubmitted: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, isSelected, onClick, disabled, isCorrect, isSubmitted }) => {
  const getButtonClasses = () => {
    let classes = "w-full text-left p-4 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium";

    if (isSubmitted) {
      if (isCorrect) {
        return `${classes} bg-green-500/20 border-green-500 text-slate-100`;
      }
      if (isSelected && !isCorrect) {
        return `${classes} bg-red-500/20 border-red-500 text-slate-100`;
      }
      return `${classes} bg-slate-800 border-slate-700 text-slate-400`;
    }

    if (isSelected) {
      return `${classes} bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/50`;
    }

    return `${classes} bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-500 text-slate-200`;
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {text}
    </button>
  );
};

export default OptionButton;