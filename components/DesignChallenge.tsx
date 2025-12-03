
import React, { useState, useRef, useEffect } from 'react';
import { AIFeedback, DesignChallengeData, DesignChoices, FontPairing, UIComponent, SavedDesign, TargetAudience, CustomPaletteColors } from '../types';
import { getDesignFeedback, analyzeMockup } from '../services/geminiService';
import FeedbackDisplay from './FeedbackDisplay';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';
import { 
    HIERARCHY_OPTIONS, 
    CONTRAST_OPTIONS,
    ALIGNMENT_OPTIONS,
    REPETITION_OPTIONS, 
    LAYOUT_STYLE_OPTIONS,
    COMPONENT_STYLE_OPTIONS,
    COLOR_PALETTES,
    FONT_PAIRINGS,
    SPACING_OPTIONS,
    DESIGN_CHALLENGES
} from '../constants';
import PaletteOptionCard from './PaletteOptionCard';
import FontOptionCard from './FontOptionCard';
import DesignOptionRow from './DesignOptionRow';
import LivePreview from './LivePreview';
import SavedDesignsModal from './SavedDesignsModal';
import { exportComponentAsPNG } from '../utils/export';
import { 
  X, CheckCircle, Wand2, Check, Save, Download, RotateCw,
  Type, LayoutTemplate, Palette, Maximize, ListOrdered, AlignLeft, FolderOpen, AlertCircle, Contrast, ChevronDown, Users, Sun, Moon, ClipboardList, ImagePlus, ArrowRight
} from 'lucide-react';
import { GOOGLE_FONTS_LIST, loadGoogleFont } from '../utils/fonts';
import CollapsibleSection from './CollapsibleSection';

interface DesignChallengeProps {
  challenge: DesignChallengeData;
  onSelectChallenge: (id: number) => void;
}

// Helper component for Side Buttons with Tooltips
const SideActionButton: React.FC<{
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    colorClass?: string;
}> = ({ onClick, icon: Icon, label, isActive, colorClass }) => {
    return (
        <button 
            onClick={onClick} 
            className={`p-4 rounded-full border transition-all shadow-lg group relative flex items-center justify-center ${
                isActive 
                ? 'bg-green-600 text-white border-green-500' 
                : colorClass || 'bg-brand-surface border-brand-border text-brand-text hover:bg-brand-primary hover:text-white hover:border-brand-primary'
            }`}
            aria-label={label}
        >
            <Icon size={24} />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-brand-surface border border-brand-border text-brand-text text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                {label}
            </span>
        </button>
    );
};

const DesignChallenge: React.FC<DesignChallengeProps> = ({ challenge, onSelectChallenge }) => {
  const [designChoices, setDesignChoices] = useState<DesignChoices>({
    layoutStyle: LAYOUT_STYLE_OPTIONS[0].name,
    componentStyle: COMPONENT_STYLE_OPTIONS[0].name,
    hierarchy: HIERARCHY_OPTIONS[0].name,
    contrast: CONTRAST_OPTIONS[0].name,
    alignment: ALIGNMENT_OPTIONS[0].name,
    repetition: REPETITION_OPTIONS[0].name,
    colorPalette: COLOR_PALETTES[0].name,
    fontPairing: FONT_PAIRINGS[0].name,
    spacing: SPACING_OPTIONS[1].name, // Default to Standard
  });
  
  // New State for Target Audience
  const [targetAudience, setTargetAudience] = useState<TargetAudience>({
      gender: '',
      age: '',
      job: '',
      income: '',
      lifestyle: '',
      buyingHabits: '',
      goals: ''
  });
  const [isAudienceOpen, setIsAudienceOpen] = useState(true);

  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Custom Palette Object
  const [customPaletteColors, setCustomPaletteColors] = useState<CustomPaletteColors>({
      primary: '#3B82F6',
      accent: '#60A5FA',
      bg: '#FFFFFF',
      cardBg: '#F8FAFC',
      text: '#0F172A'
  });

  const [fontSearch, setFontSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  
  // Navigation State - Tabs
  const [activeTab, setActiveTab] = useState('colorPalette');
  
  // State for mockup-to-code feature
  const [uploadedMockupUrl, setUploadedMockupUrl] = useState<string | null>(null);
  const [analyzedUI, setAnalyzedUI] = useState<UIComponent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [customFontPairing, setCustomFontPairing] = useState<{ title: string | null, body: string | null }>({ title: null, body: null });
  
  // Saved Designs State
  const [isSavedDesignsOpen, setIsSavedDesignsOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newDesignName, setNewDesignName] = useState('');

  // Scroll / Animation States
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const livePreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Hero Section (controls Phone Animation)
  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            // If hero is more than 30% visible, we consider it "active" for the phone animation
            setIsHeroVisible(entry.isIntersecting);
        },
        { threshold: 0.3 } 
    );
    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
        observer.disconnect();
    }
  }, []);

  // Scroll Listener for Logo Morphing
  useEffect(() => {
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const scrollTop = scrollContainerRef.current.scrollTop;
        const maxScroll = 400; // Distance over which the animation completes
        const progress = Math.min(scrollTop / maxScroll, 1);
        setScrollProgress(progress);
    };

    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();
    }
    return () => {
        if (container) container.removeEventListener('scroll', handleScroll);
    }
  }, []);


  // Reset Build Mode when switching challenges
  useEffect(() => {
      if (analyzedUI || uploadedMockupUrl) {
          setAnalyzedUI(null);
          setUploadedMockupUrl(null);
          setFeedback(null);
          setError('');
      }
  }, [challenge.id]);

  // Load Saved Designs from localStorage on mount
  useEffect(() => {
    const storedDesigns = localStorage.getItem('design_it_right_saves');
    if (storedDesigns) {
      try {
        setSavedDesigns(JSON.parse(storedDesigns));
      } catch (e) {
        console.error("Failed to parse saved designs", e);
      }
    }
    
    // Legacy support
    if (!storedDesigns) {
       const legacySave = localStorage.getItem(`saved_design_${challenge.id}`);
       if (legacySave) {
         try {
           const parsed = JSON.parse(legacySave);
           if (parsed) setDesignChoices(prev => ({ ...prev, ...parsed }));
         } catch (e) {}
       }
    }
  }, [challenge.id]);

  useEffect(() => {
    if (customFontPairing.title && customFontPairing.body) {
      handleSelect('fontPairing', 'Custom Pairing');
    }
  }, [customFontPairing]);


  const handleSelect = (category: keyof DesignChoices, value: string) => {
    if (feedback) setFeedback(null);
    if (error) setError('');
    setDesignChoices(prev => ({ ...prev, [category]: value }));
    setSaveStatus('idle');
  };

  const handleAudienceChange = (field: keyof TargetAudience, value: string) => {
      setTargetAudience(prev => ({ ...prev, [field]: value }));
  };

  const setBaseTheme = (mode: 'light' | 'dark') => {
      if (mode === 'light') {
          setCustomPaletteColors(prev => ({
              ...prev,
              bg: '#FFFFFF',
              cardBg: '#F8FAFC',
              text: '#0F172A'
          }));
      } else {
          setCustomPaletteColors(prev => ({
              ...prev,
              bg: '#0F172A',
              cardBg: '#1E293B',
              text: '#F8FAFC'
          }));
      }
  };

  const handleCustomColorChange = (key: keyof CustomPaletteColors, value: string) => {
      setCustomPaletteColors(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveClick = () => {
      setNewDesignName(`Design ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
      setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!newDesignName.trim()) return;

    try {
        const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
        const newSave: SavedDesign = {
            id: generateId(),
            challengeId: challenge.id,
            name: newDesignName,
            timestamp: Date.now(),
            choices: designChoices,
            customPaletteColors: designChoices.colorPalette === 'Custom' ? customPaletteColors : undefined,
            customFontPairing: designChoices.fontPairing === 'Custom Pairing' ? customFontPairing : undefined,
            targetAudience: targetAudience
        };

        const updatedSaves = [newSave, ...savedDesigns];
        setSavedDesigns(updatedSaves);
        localStorage.setItem('design_it_right_saves', JSON.stringify(updatedSaves));
        localStorage.setItem(`saved_design_${challenge.id}`, JSON.stringify(designChoices));
        localStorage.setItem('last_challenge_id', challenge.id.toString());

        setSaveStatus('saved');
        setIsSaveModalOpen(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
        console.error("Failed to save design:", err);
        alert("An error occurred while saving. Please check your browser storage settings.");
    }
  };

  const handleLoadDesign = (design: SavedDesign) => {
    // If the saved design is for a different challenge, switch to it
    if (design.challengeId !== challenge.id) {
        onSelectChallenge(design.challengeId);
        // We delay setting the choices slightly to allow the challenge switch to happen
        setTimeout(() => {
             loadDesignChoices(design);
        }, 100);
    } else {
        loadDesignChoices(design);
    }
    setIsSavedDesignsOpen(false);
  };

  const loadDesignChoices = (design: SavedDesign) => {
      setDesignChoices(design.choices);
      if (design.customPaletteColors) setCustomPaletteColors(design.customPaletteColors);
      
      if (design.customFontPairing) {
         setCustomFontPairing(design.customFontPairing);
         if(design.customFontPairing.title) loadGoogleFont(design.customFontPairing.title);
         if(design.customFontPairing.body) loadGoogleFont(design.customFontPairing.body);
      }
      if (design.targetAudience) {
          setTargetAudience(design.targetAudience);
      }
      setFeedback(null);
  }

  const handleDeleteDesign = (id: string) => {
    if(confirm("Are you sure you want to delete this design?")) {
        const updatedSaves = savedDesigns.filter(d => d.id !== id);
        setSavedDesigns(updatedSaves);
        localStorage.setItem('design_it_right_saves', JSON.stringify(updatedSaves));
    }
  };

  const handleResetClick = () => {
      setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
      setDesignChoices({
          layoutStyle: LAYOUT_STYLE_OPTIONS[0].name,
          componentStyle: COMPONENT_STYLE_OPTIONS[0].name,
          hierarchy: HIERARCHY_OPTIONS[0].name,
          contrast: CONTRAST_OPTIONS[0].name,
          alignment: ALIGNMENT_OPTIONS[0].name,
          repetition: REPETITION_OPTIONS[0].name,
          colorPalette: COLOR_PALETTES[0].name,
          fontPairing: FONT_PAIRINGS[0].name,
          spacing: SPACING_OPTIONS[1].name,
      });
      setCustomPaletteColors({
          primary: '#3B82F6',
          accent: '#60A5FA',
          bg: '#FFFFFF',
          cardBg: '#F8FAFC',
          text: '#0F172A'
      });
      setCustomFontPairing({ title: null, body: null });
      setTargetAudience({
          gender: '', age: '', job: '', income: '', lifestyle: '', buyingHabits: '', goals: ''
      });
      setFeedback(null);
      setAnalyzedUI(null);
      setUploadedMockupUrl(null);
      setIsResetModalOpen(false);
  };

  const handleGetFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const allOptionsSelected = Object.values(designChoices).every(choice => choice !== '');
    if (!allOptionsSelected) {
      setError('Please select an option for each category to get feedback.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFeedback(null);
    try {
      const scenarioForAI = analyzedUI
        ? "A user has uploaded a UI mockup which has been converted to a live component. They have now applied a new set of design styles (colors, fonts, etc.). Your feedback should analyze how well these chosen styles complement or clash with the structure of the original mockup."
        : challenge.scenario;
        
      const feedbackResult = await getDesignFeedback(
        scenarioForAI,
        designChoices,
        designChoices.colorPalette === 'Custom' ? customPaletteColors.primary : undefined,
        targetAudience
      );
      setFeedback(feedbackResult);
    } catch (err) {
      setError('An error occurred while getting feedback. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
              const result = e.target?.result as string;
              
              // RESIZE LOGIC: Resize image to reduce payload size and prevent API errors
              const img = new Image();
              img.onload = async () => {
                  const canvas = document.createElement('canvas');
                  // Max width of 800px is sufficient for UI analysis
                  const MAX_WIDTH = 800; 
                  const scaleSize = MAX_WIDTH / img.width;
                  if (scaleSize < 1) {
                      canvas.width = MAX_WIDTH;
                      canvas.height = img.height * scaleSize;
                  } else {
                      canvas.width = img.width;
                      canvas.height = img.height;
                  }
                  
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      // Export as JPEG with 0.8 quality to compress
                      const resizedBase64Url = canvas.toDataURL('image/jpeg', 0.8);
                      
                      setUploadedMockupUrl(resizedBase64Url);
                      setFeedback(null);
                      setAnalyzedUI(null);
                      setError('');
        
                      setIsAnalyzing(true);
                      try {
                          const base64 = resizedBase64Url.split(',')[1];
                          // Send as jpeg for consistent MIME type handling
                          const uiStructure = await analyzeMockup(base64, 'image/jpeg');
                          setAnalyzedUI(uiStructure);
                      } catch (err) {
                          setError('Failed to analyze the mockup. Please try a smaller image or check your connection.');
                          console.error(err);
                          setUploadedMockupUrl(null);
                      } finally {
                          setIsAnalyzing(false);
                      }
                  }
              };
              img.onerror = () => {
                  setError("Failed to process image.");
                  setUploadedMockupUrl(null);
              }
              img.src = result;
          };
          reader.readAsDataURL(file);
      }
      event.target.value = '';
  };

  const handleClearMockup = () => {
    setUploadedMockupUrl(null);
    setFeedback(null);
    setAnalyzedUI(null);
    setError('');
  }

  const handleExportClick = () => {
    if (livePreviewRef.current) {
        exportComponentAsPNG(livePreviewRef.current);
    } else {
        alert("Could not export image. Reference to preview not found.");
    }
  };

  const handleSetCustomFont = (type: 'title' | 'body', fontName: string) => {
      loadGoogleFont(fontName);
      setCustomFontPairing(prev => ({ ...prev, [type]: fontName }));
  };

  const getFontPairingForPreview = (): FontPairing => {
      if (designChoices.fontPairing === 'Custom Pairing' && customFontPairing.title && customFontPairing.body) {
          return {
              name: 'Custom Pairing',
              titleFont: `'${customFontPairing.title}', sans-serif`,
              bodyFont: `'${customFontPairing.body}', sans-serif`,
              description: 'Your personally selected font combination.'
          };
      }
      return FONT_PAIRINGS.find(p => p.name === designChoices.fontPairing) || FONT_PAIRINGS[0];
  };

  const filteredPresetFonts = FONT_PAIRINGS.filter(p =>
    p.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const filteredGoogleFonts = fontSearch.length > 1
    ? GOOGLE_FONTS_LIST.filter(font => font.toLowerCase().includes(fontSearch.toLowerCase()))
    : [];

  const isColorPaletteDisabled = designChoices.contrast === 'WCAG AAA (High)';

  const principles = [
    { id: 'colorPalette', label: 'Colors', icon: Palette },
    { id: 'fontPairing', label: 'Typography', icon: Type },
    { id: 'layoutStyle', label: 'Layout', icon: LayoutTemplate },
    { id: 'componentStyle', label: 'Style', icon: ClipboardList },
    { id: 'spacing', label: 'Spacing', icon: Maximize },
    { id: 'hierarchy', label: 'Hierarchy', icon: ListOrdered },
    { id: 'alignment', label: 'Alignment', icon: AlignLeft },
  ];

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'layoutStyle':
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {LAYOUT_STYLE_OPTIONS.map(option => (
                <DesignOptionRow
                    key={option.name}
                    title={option.name}
                    description={option.description}
                    isSelected={designChoices.layoutStyle === option.name}
                    onSelect={() => handleSelect('layoutStyle', option.name)}
                />
            ))}
          </div>
        );
      case 'componentStyle':
        return (
           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {COMPONENT_STYLE_OPTIONS.map(option => (
                  <DesignOptionRow
                    key={option.name}
                    title={option.name}
                    description={option.description}
                    isSelected={designChoices.componentStyle === option.name}
                    onSelect={() => handleSelect('componentStyle', option.name)}
                  />
                ))}
           </div>
        );
      case 'colorPalette':
         return (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {isColorPaletteDisabled && (
                <p className="text-sm text-yellow-400 bg-yellow-900/30 border border-yellow-800/50 p-3 rounded-md mb-4">
                    Color options are overridden by the 'WCAG AAA (High)' contrast selection.
                </p>
              )}
              
              <h4 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider mb-3 mt-1">Select Palette</h4>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isColorPaletteDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {COLOR_PALETTES.map(palette => (
                  <PaletteOptionCard
                    key={palette.name}
                    palette={palette}
                    isSelected={designChoices.colorPalette === palette.name}
                    onSelect={() => handleSelect('colorPalette', palette.name)}
                  />
                ))}
                 <DesignOptionRow
                    title="Custom Palette"
                    description="Build your own theme"
                    isSelected={designChoices.colorPalette === 'Custom'}
                    onSelect={() => handleSelect('colorPalette', 'Custom')}
                  />
              </div>
               {designChoices.colorPalette === 'Custom' && (
                <div className={`mt-4 p-4 bg-brand-bg border border-brand-border rounded-lg space-y-4 ${isColorPaletteDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                         <label className="text-xs font-bold text-brand-text-muted uppercase block mb-2">Base Theme (Mode)</label>
                         <div className="flex gap-2">
                             <button onClick={() => setBaseTheme('light')} className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors">
                                <Sun size={16} /> Light Mode
                             </button>
                             <button onClick={() => setBaseTheme('dark')} className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-colors">
                                <Moon size={16} /> Dark Mode
                             </button>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="custom-bg" className="font-medium text-xs text-brand-text-muted block mb-1">Background</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" id="custom-bg" value={customPaletteColors.bg} onChange={(e) => handleCustomColorChange('bg', e.target.value)} className="w-8 h-8 p-0 border-none rounded bg-transparent cursor-pointer" />
                                <span className="font-mono text-xs text-brand-text-muted">{customPaletteColors.bg.toUpperCase()}</span>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="custom-card" className="font-medium text-xs text-brand-text-muted block mb-1">Card / Surface</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" id="custom-card" value={customPaletteColors.cardBg} onChange={(e) => handleCustomColorChange('cardBg', e.target.value)} className="w-8 h-8 p-0 border-none rounded bg-transparent cursor-pointer" />
                                <span className="font-mono text-xs text-brand-text-muted">{customPaletteColors.cardBg.toUpperCase()}</span>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="custom-text" className="font-medium text-xs text-brand-text-muted block mb-1">Main Text</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" id="custom-text" value={customPaletteColors.text} onChange={(e) => handleCustomColorChange('text', e.target.value)} className="w-8 h-8 p-0 border-none rounded bg-transparent cursor-pointer" />
                                <span className="font-mono text-xs text-brand-text-muted">{customPaletteColors.text.toUpperCase()}</span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="custom-primary" className="font-medium text-xs text-brand-text-muted block mb-1">Primary Color</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" id="custom-primary" value={customPaletteColors.primary} onChange={(e) => handleCustomColorChange('primary', e.target.value)} className="w-8 h-8 p-0 border-none rounded bg-transparent cursor-pointer" />
                                <span className="font-mono text-xs text-brand-text-muted">{customPaletteColors.primary.toUpperCase()}</span>
                            </div>
                        </div>
                         <div className="col-span-2">
                            <label htmlFor="custom-accent" className="font-medium text-xs text-brand-text-muted block mb-1">Accent / Highlight</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" id="custom-accent" value={customPaletteColors.accent} onChange={(e) => handleCustomColorChange('accent', e.target.value)} className="w-8 h-8 p-0 border-none rounded bg-transparent cursor-pointer" />
                                <span className="font-mono text-xs text-brand-text-muted">{customPaletteColors.accent.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
              )}
              <div className="mt-8 border-t border-brand-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Contrast size={18} className="text-brand-accent" />
                  <h4 className="text-sm font-bold text-brand-text-muted uppercase tracking-wider">Contrast Settings</h4>
                </div>
                <div className="space-y-3">
                  {CONTRAST_OPTIONS.map(option => (
                      <DesignOptionRow
                        key={option.name}
                        title={option.name}
                        description={option.description}
                        isSelected={designChoices.contrast === option.name}
                        onSelect={() => handleSelect('contrast', option.name)}
                      />
                    ))}
                </div>
              </div>
            </div>
         );
      case 'fontPairing':
        return (
           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <input
                type="search"
                value={fontSearch}
                onChange={e => setFontSearch(e.target.value)}
                placeholder="Search presets or Google Fonts..."
                className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text focus:ring-brand-primary focus:border-brand-primary placeholder-brand-text-muted"
              />
              {customFontPairing.title || customFontPairing.body ? (
                  <div className="p-4 rounded-lg border bg-brand-bg border-brand-border">
                    <h4 className="font-bold text-base text-brand-text">Custom Pairing</h4>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-brand-text-muted">Title: <span style={{fontFamily: customFontPairing.title || 'sans-serif'}} className="font-semibold text-brand-text">{customFontPairing.title || 'Not set'}</span></p>
                         {customFontPairing.title && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                     <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-brand-text-muted">Body: <span style={{fontFamily: customFontPairing.body || 'sans-serif'}} className="font-semibold text-brand-text">{customFontPairing.body || 'Not set'}</span></p>
                        {customFontPairing.body && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                     {designChoices.fontPairing === 'Custom Pairing' && (
                        <p className="text-xs text-brand-accent mt-2">✓ Applied to preview</p>
                     )}
                  </div>
                ) : null}

                {fontSearch.length > 1 && (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    <h4 className="text-sm font-semibold text-brand-text-muted uppercase">Google Fonts Results</h4>
                    {filteredGoogleFonts.map(font => (
                      <div key={font} className="p-3 bg-brand-bg border border-brand-border rounded-lg flex items-center justify-between">
                        <p style={{fontFamily: `'${font}', sans-serif`}} className="text-brand-text text-lg">{font}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleSetCustomFont('title', font)} className="text-xs px-2 py-1 rounded bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold">Set Title</button>
                          <button onClick={() => handleSetCustomFont('body', font)} className="text-xs px-2 py-1 rounded bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold">Set Body</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredPresetFonts.map(pairing => (
                    <FontOptionCard
                      key={pairing.name}
                      pairing={pairing}
                      isSelected={designChoices.fontPairing === pairing.name}
                      onSelect={() => handleSelect('fontPairing', pairing.name)}
                    />
                  ))}
               </div>
           </div>
        );
      case 'spacing':
         return (
             <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {SPACING_OPTIONS.map(option => (
                        <DesignOptionRow
                            key={option.name}
                            title={option.name}
                            description={option.description}
                            isSelected={designChoices.spacing === option.name}
                            onSelect={() => handleSelect('spacing', option.name)}
                        />
                    ))}
             </div>
         );
      case 'hierarchy':
         return (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {HIERARCHY_OPTIONS.map(option => (
                      <DesignOptionRow
                        key={option.name}
                        title={option.name}
                        description={option.description}
                        isSelected={designChoices.hierarchy === option.name}
                        onSelect={() => handleSelect('hierarchy', option.name)}
                      />
                    ))}
            </div>
         );
      case 'alignment':
         return (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {ALIGNMENT_OPTIONS.map(option => (
                      <DesignOptionRow
                        key={option.name}
                        title={option.name}
                        description={option.description}
                        isSelected={designChoices.alignment === option.name}
                        onSelect={() => handleSelect('alignment', option.name)}
                      />
                    ))}
            </div>
         );
      default:
        return null;
    }
  }

  return (
    // MAIN WRAPPER: Handles the Scroll Logic
    <div ref={scrollContainerRef} className="h-screen w-full overflow-y-auto scroll-smooth bg-brand-bg custom-scrollbar relative">
      
      {/* 1. DYNAMIC HEADER / LOGO MORPH
          This element is fixed and transitions from Center/Large (Hero) to Top-Left/Small (Sticky Header)
          based on scrollProgress.
      */}
      <div 
        className="fixed z-50 flex items-center gap-3 transition-colors duration-300 pointer-events-none"
        style={{
            // START: 20vh (approx center vertical), END: 1.5rem (top header padding)
            top: `calc(20vh * (1 - ${scrollProgress}) + 1.25rem * ${scrollProgress})`, 
            // START: 50% (center horizontal), END: 1.5rem (left header padding)
            left: `calc(50% * (1 - ${scrollProgress}) + 1.5rem * ${scrollProgress})`, 
            // START: translateX(-50%) to center it, END: translateX(0) to align left
            transform: `translate(calc(-50% * (1 - ${scrollProgress})), 0)`,
        }}
      >
        {/* Icon Scale: 4rem (16) -> 1.5rem (6) */}
        <div style={{ transform: `scale(${1 + (1.5 * (1 - scrollProgress))})` }}>
            <SparklesIcon className="w-6 h-6 text-brand-accent" />
        </div>
        
        {/* Text Scale: 3rem -> 1.25rem */}
        <h1 
            className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary tracking-tight whitespace-nowrap"
            style={{
                 // Interpolate Font Size from large to small
                 fontSize: `calc(1.25rem + (2.5rem * (1 - ${scrollProgress})))`,
                 // Fade out the detailed description as we scroll, optional, but keeps the header clean
                 opacity: 1
            }}
        >
            Design-It-Right
        </h1>
      </div>

      {/* Sticky Header Background (Fades in only at the end) */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-brand-bg/90 backdrop-blur-md border-b border-brand-border transition-opacity duration-300 pointer-events-none"
        style={{ opacity: scrollProgress > 0.8 ? 1 : 0 }}
      />

      {/* 2. PHONE OVERLAY - Slides up from bottom when scrolling down */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full lg:w-[40%] h-full z-40 pointer-events-none lg:pointer-events-auto transition-transform duration-700 ease-in-out transform ${!isHeroVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}
      >
         <div className="h-full w-full p-4 md:p-8 flex items-center justify-center bg-brand-bg/95 backdrop-blur-sm lg:bg-brand-bg lg:backdrop-blur-none border-l border-brand-border/50">
            {/* Background decoration for the phone partition */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
             
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            
            <div className="flex flex-row items-center gap-6 justify-center w-full h-full relative z-10">
                <div className="relative w-auto max-w-[calc(100%-4rem)] h-[85vh] aspect-[9/16] shadow-2xl rounded-[40px] bg-black border-4 border-gray-800 overflow-hidden">
                    <LivePreview 
                        ref={livePreviewRef} 
                        choices={designChoices} 
                        challenge={challenge} 
                        customPaletteColors={customPaletteColors}
                        fontPairing={getFontPairingForPreview()}
                        mockupImageUrl={uploadedMockupUrl}
                        analyzedUI={analyzedUI}
                        isAnalyzing={isAnalyzing}
                    />
                </div>

                {/* Side Action Buttons */}
                <div className="flex flex-col gap-4">
                    <SideActionButton 
                        onClick={handleImportClick} 
                        icon={Wand2} 
                        label="Build from Image" 
                    />
                    <SideActionButton 
                        onClick={handleExportClick} 
                        icon={Download} 
                        label="Download Preview" 
                    />
                     {uploadedMockupUrl && (
                         <SideActionButton 
                            onClick={handleClearMockup} 
                            icon={X} 
                            label="Clear Mockup" 
                            colorClass="bg-red-950/30 border-red-900 text-red-400 hover:bg-red-900 hover:text-white"
                        />
                    )}
                    
                    <div className="h-px bg-brand-border w-8 mx-auto my-2"></div>

                    <SideActionButton 
                        onClick={() => setIsSavedDesignsOpen(true)} 
                        icon={FolderOpen} 
                        label="Load Design" 
                    />
                    <SideActionButton 
                        onClick={handleSaveClick} 
                        icon={saveStatus === 'saved' ? Check : Save} 
                        label={saveStatus === 'saved' ? 'Saved!' : 'Save Design'}
                        isActive={saveStatus === 'saved'}
                    />
                    <SideActionButton 
                        onClick={handleResetClick} 
                        icon={RotateCw} 
                        label="Reset Design" 
                        colorClass="bg-brand-surface border-brand-border text-brand-text-muted hover:text-white hover:bg-red-600 hover:border-red-600"
                    />
                </div>
            </div>
         </div>
      </div>

      <SavedDesignsModal 
         isOpen={isSavedDesignsOpen}
         onClose={() => setIsSavedDesignsOpen(false)}
         savedDesigns={savedDesigns}
         currentChallengeId={challenge.id}
         onLoad={handleLoadDesign}
         onDelete={handleDeleteDesign}
      />

      {/* Save / Reset Modals */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSaveModalOpen(false)}></div>
            <div className="relative bg-brand-surface border border-brand-border rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-brand-text mb-4">Save Design</h3>
                <input 
                    type="text" 
                    value={newDesignName}
                    onChange={(e) => setNewDesignName(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text focus:ring-brand-primary focus:border-brand-primary mb-6"
                    placeholder="Enter design name..."
                    autoFocus
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-brand-text-muted hover:text-brand-text">Cancel</button>
                    <button onClick={handleConfirmSave} disabled={!newDesignName.trim()} className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-medium disabled:opacity-50">Save Design</button>
                </div>
            </div>
        </div>
      )}

      {isResetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)}></div>
            <div className="relative bg-brand-surface border border-brand-border rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-900/20 rounded-lg"><AlertCircle className="text-red-500" size={24} /></div>
                    <h3 className="text-xl font-bold text-brand-text">Reset Design?</h3>
                </div>
                <p className="text-brand-text-muted mb-6">Are you sure you want to reset everything to default? All current changes will be lost.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsResetModalOpen(false)} className="px-4 py-2 text-brand-text-muted hover:text-brand-text">Cancel</button>
                    <button onClick={handleConfirmReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Reset Design</button>
                </div>
            </div>
        </div>
      )}

      {/* 3. SCROLLABLE LAYOUT */}
      <div className="w-full relative z-10">
          
        {/* HERO SECTION - Full Width & Centered */}
        <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 text-center w-full relative z-10 bg-brand-bg py-20">
            <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto mb-10">
                {/* SPACER DIV: Takes up the exact space where the Dynamic Logo starts, so layout remains centered */}
                <div className="h-32 w-full flex items-center justify-center opacity-0 pointer-events-none" aria-hidden="true">
                     <span className="text-6xl md:text-8xl font-extrabold">Design-It-Right</span>
                </div>
                
                <p 
                    className="text-xl md:text-2xl text-brand-text-muted leading-relaxed max-w-2xl mt-4 transition-opacity duration-300"
                    style={{ opacity: 1 - scrollProgress * 2 }} // Fade out description quickly
                >
                    Bridge the gap between theory and practice. Tackle real-world design scenarios and get instant AI-powered feedback.
                </p>
            </div>

            {/* NEW: Challenge Selector & Upload Area */}
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                
                {/* Template List */}
                <div className="bg-brand-surface/40 backdrop-blur-md rounded-2xl p-6 border border-brand-border/50 flex flex-col h-full shadow-2xl shadow-black/20">
                     <div className="flex items-center justify-between mb-4">
                         <h3 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest">Choose a Template</h3>
                         <span className="text-xs text-brand-accent px-2 py-1 rounded bg-brand-accent/10 border border-brand-accent/20">
                             {DESIGN_CHALLENGES.filter(c => c.type === 'DESIGN').length} Available
                         </span>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar max-h-[240px] pr-2">
                        {DESIGN_CHALLENGES.filter(c => c.type === 'DESIGN').map(c => (
                            <button 
                                key={c.id}
                                onClick={() => onSelectChallenge(c.id)}
                                className={`text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                                    challenge.id === c.id 
                                    ? 'bg-brand-primary border-brand-primary text-white ring-2 ring-brand-primary/50' 
                                    : 'bg-brand-bg border-brand-border text-brand-text hover:border-brand-text-muted hover:bg-brand-surface'
                                }`}
                            >
                                <span className="font-bold block text-sm relative z-10">{c.title}</span>
                                {challenge.id === c.id && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CheckCircle size={16} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                     </div>
                </div>

                {/* Build Mode / Upload */}
                <div 
                    onClick={handleImportClick}
                    className="bg-gradient-to-br from-brand-surface/60 to-brand-bg rounded-2xl p-8 border-2 border-dashed border-brand-border/60 hover:border-brand-accent/50 cursor-pointer group transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xl shadow-black/20 relative overflow-hidden"
                >
                     <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     
                     <div className="w-16 h-16 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-brand-accent/20 group-hover:border-brand-accent/50 relative z-10">
                        <ImagePlus size={32} className="text-brand-text-muted group-hover:text-brand-accent transition-colors" />
                     </div>
                     <h3 className="text-xl font-bold text-brand-text mb-2 relative z-10">Build from Image</h3>
                     <p className="text-brand-text-muted text-sm max-w-xs relative z-10">
                        Upload a screenshot of any app, and AI will convert it into an editable template.
                     </p>
                     
                     <div className="mt-6 flex items-center gap-2 text-sm font-bold text-brand-accent opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 relative z-10">
                        Upload Mockup <ArrowRight size={16} />
                     </div>
                </div>

            </div>

            <div className="flex items-center gap-2 text-brand-accent/50 animate-bounce mt-16">
                <span className="text-sm uppercase tracking-widest font-bold">Scroll to start</span>
                <ChevronDown size={20} />
            </div>
        </section>

        {/* CONTENT COLUMN - Restricted Width when Phone is Visible */}
        <div className={`w-full ${!isHeroVisible ? 'lg:w-[60%]' : 'w-full'} transition-all duration-700 bg-brand-bg`}>
            
            {/* BRIEF (CONTEXT & REQUIREMENTS) */}
            <section className="min-h-screen flex flex-col justify-center px-10 lg:px-24 xl:px-32 py-20 border-t border-brand-border/30">
                <div className="space-y-8 mb-12">
                    <div>
                    <span className="text-brand-accent font-mono text-sm tracking-widest uppercase mb-2 block">Current Scenario</span>
                    <h2 className="text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
                            {analyzedUI ? 'Build Mode: Live Edit' : challenge.title}
                        </h2>
                    </div>
                    
                    <p className="text-xl text-brand-text-muted leading-relaxed max-w-xl">
                        {analyzedUI 
                            ? 'Gemini 3 has reconstructed your mockup. Use the controls below to change its Theme, Colors, and Typography in real-time.' 
                            : challenge.scenario}
                    </p>
                </div>

                {!analyzedUI && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-6 pl-1">Requirements</h3>
                        <div className="bg-brand-surface/50 border border-brand-border rounded-2xl p-8 backdrop-blur-sm">
                            <ul className="space-y-6">
                                {challenge.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent" />
                                    </div>
                                    <span className="text-brand-text text-lg leading-relaxed">{req}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </section>

            {/* WORKSPACE (CONTROLS & FEEDBACK) */}
            <section className="min-h-screen flex flex-col justify-center px-10 lg:px-24 xl:px-32 py-20 border-t border-brand-border/30">
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest pl-1">Design Controls</h3>
                    </div>
                    
                    <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-2xl overflow-hidden">
                        {/* Tabs */}
                        <div className="flex overflow-x-auto p-4 gap-3 border-b border-brand-border bg-brand-bg/50 custom-scrollbar">
                            {principles.map((p) => {
                                const Icon = p.icon;
                                const isActive = activeTab === p.id;
                                
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setActiveTab(p.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-3 rounded-xl border transition-all whitespace-nowrap outline-none
                                            ${isActive 
                                                ? 'bg-brand-primary/10 border-brand-primary text-brand-text' 
                                                : 'bg-transparent border-transparent text-brand-text-muted hover:text-brand-text hover:bg-brand-bg/50'
                                            }
                                        `}
                                    >
                                        <Icon size={18} className={isActive ? 'text-brand-accent' : 'text-current'} />
                                        <span className="font-medium text-sm">{p.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 md:p-8 bg-brand-surface min-h-[400px]">
                            {renderSectionContent(activeTab)}
                        </div>
                    </div>
                </div>
                
                {/* TARGET AUDIENCE BUILDER */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <CollapsibleSection
                        title="Target Audience (Optional)"
                        icon={Users}
                        isOpen={isAudienceOpen}
                        onToggle={() => setIsAudienceOpen(!isAudienceOpen)}
                    >
                         <p className="text-sm text-brand-text-muted mb-4">
                            Define a specific user persona to get tailored AI feedback based on demographics and lifestyle.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Row 1 */}
                            <input 
                                type="text" 
                                placeholder="Age Range (e.g. 18-24, 50+)"
                                value={targetAudience.age}
                                onChange={(e) => handleAudienceChange('age', e.target.value)}
                                className="bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                            <select 
                                value={targetAudience.gender}
                                onChange={(e) => handleAudienceChange('gender', e.target.value)}
                                className="bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="All">All / Neutral</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                            </select>
                            
                            {/* Row 2 */}
                             <input 
                                type="text" 
                                placeholder="Job Title (e.g. Student, CEO)"
                                value={targetAudience.job}
                                onChange={(e) => handleAudienceChange('job', e.target.value)}
                                className="bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                            <select 
                                value={targetAudience.income}
                                onChange={(e) => handleAudienceChange('income', e.target.value)}
                                className="bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                            >
                                <option value="" disabled>Income Level</option>
                                <option value="Student / Low">Student / Low</option>
                                <option value="Middle Income">Middle Income</option>
                                <option value="High Income">High Income</option>
                                <option value="Luxury / HNWI">Luxury / HNWI</option>
                            </select>

                            {/* Row 3 - Full Width Text Areas */}
                            <div className="md:col-span-2">
                                 <input 
                                    type="text" 
                                    placeholder="Lifestyle & Buying Habits (e.g. Eco-conscious, Impulse buyer, Minimalist)"
                                    value={targetAudience.lifestyle}
                                    onChange={(e) => handleAudienceChange('lifestyle', e.target.value)}
                                    className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                 <input 
                                    type="text" 
                                    placeholder="User Goals (e.g. Save money, Get fit quickly)"
                                    value={targetAudience.goals}
                                    onChange={(e) => handleAudienceChange('goals', e.target.value)}
                                    className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                />
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                    <form onSubmit={handleGetFeedback}>
                        {error && <p className="mb-6 text-red-400 text-center bg-red-950/20 p-3 rounded-lg border border-red-900/50">{error}</p>}
                        <div className="text-center pb-10">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center w-auto min-w-[240px] px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(15,118,110,0.3)] text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-4 focus:ring-brand-primary/30 disabled:bg-brand-primary/50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Get AI Feedback'}
                            </button>
                        </div>
                        {feedback && <FeedbackDisplay feedback={feedback} />}
                    </form>
                </div>
            </section>
            
            <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
};

export default DesignChallenge;
