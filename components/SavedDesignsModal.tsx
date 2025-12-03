import React from 'react';
import { SavedDesign, DesignChallengeData } from '../types';
import { X, Clock, Trash2, ArrowRight, FolderOpen } from 'lucide-react';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDesigns: SavedDesign[];
  currentChallengeId: number;
  onLoad: (design: SavedDesign) => void;
  onDelete: (id: string) => void;
}

const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({ 
  isOpen, 
  onClose, 
  savedDesigns, 
  currentChallengeId, 
  onLoad, 
  onDelete 
}) => {
  if (!isOpen) return null;

  // Filter designs for the current challenge
  const relevantDesigns = savedDesigns
    .filter(d => d.challengeId === currentChallengeId)
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-brand-surface border border-brand-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
                <FolderOpen className="text-brand-accent" size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-brand-text">Saved Designs</h2>
                <p className="text-sm text-brand-text-muted">Load a previous configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-text transition-colors p-2 hover:bg-brand-bg rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar bg-brand-bg">
          {relevantDesigns.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-surface rounded-full flex items-center justify-center mb-4">
                    <FolderOpen className="text-brand-text-muted" size={32} />
                </div>
                <p className="text-brand-text font-medium text-lg">No saved designs yet.</p>
                <p className="text-brand-text-muted max-w-xs mx-auto mt-2">Create a design and click the "Save" button to see it here.</p>
            </div>
          ) : (
            relevantDesigns.map((design) => (
              <div 
                key={design.id} 
                className="group bg-brand-surface border border-brand-border hover:border-brand-primary/50 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                    <h3 className="font-bold text-brand-text text-lg">{design.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-bg text-brand-text-muted border border-brand-border">
                         {new Date(design.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                     <span className="text-xs text-brand-text-muted bg-brand-bg/80 px-2 py-1 rounded border border-brand-border/50">
                        {design.choices.layoutStyle}
                     </span>
                     <span className="text-xs text-brand-text-muted bg-brand-bg/80 px-2 py-1 rounded border border-brand-border/50">
                        {design.choices.colorPalette}
                     </span>
                     <span className="text-xs text-brand-text-muted bg-brand-bg/80 px-2 py-1 rounded border border-brand-border/50">
                        {design.choices.fontPairing}
                     </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center self-end">
                   <button
                    onClick={() => onDelete(design.id)}
                    className="p-2 text-brand-text-muted hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Delete Design"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onLoad(design)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-primary/20"
                  >
                    Load <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-brand-border bg-brand-surface/50 text-center">
            <p className="text-xs text-brand-text-muted">Designs are stored locally in your browser.</p>
        </div>
      </div>
    </div>
  );
};

export default SavedDesignsModal;