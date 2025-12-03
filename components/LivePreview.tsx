
import React from 'react';
import { DesignChoices, DesignChallengeData, ColorPalette, FontPairing, UIComponent, CustomPaletteColors } from '../types';
import { COLOR_PALETTES } from '../constants';
import { 
  Landmark,
  Music, SkipForward, SkipBack, Play, Pause,
  Bell, Settings, Home, CreditCard, Wallet, CircleUserRound, Plus, BarChart3, UserPlus,
  HeartPulse, Flame, Footprints, BedDouble as Bed,
  CookingPot, UtensilsCrossed, ChefHat, Timer,
  Droplets, Trophy, Dumbbell,
  Heart, Volume2, Repeat, Shuffle, ChevronUp, ChevronLeft, SlidersHorizontal,
  Star, Clock, Bookmark, Search, User, Users
} from 'lucide-react';
import DynamicRenderer from './DynamicRenderer';
import LoadingSpinner from './LoadingSpinner';

// --- COLOR UTILITY FUNCTIONS ---
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function tintShade(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  let { r, g, b } = rgb;
  const amount = Math.floor(2.55 * percent);

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return rgbToHex(r, g, b);
}

function isColorLight(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    // Using the YIQ formula
    const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    return yiq >= 128;
}

// --- END COLOR UTILITY FUNCTIONS ---


interface PreviewStyleProps {
  theme: ColorPalette['palette'];
  fonts: FontPairing;
  hierarchyStyle: React.CSSProperties;
  balanceClasses: { item: string; text: string; };
  repetitionClass: string;
  componentStyle: string;
  layoutStyle: string;
  spacingClasses: { padding: string; gap: string; marginY: string; };
}

// --- LOGO COMPONENTS ---
const ZenBankLogo: React.FC<{ theme: ColorPalette['palette'], fonts: FontPairing }> = ({ theme, fonts }) => (
    <div className="flex items-center gap-2">
        <div style={{ backgroundColor: theme.primary }} className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20L4 20H20" stroke={theme.primaryText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="font-bold text-xl" style={{ color: theme.text, fontFamily: fonts.titleFont }}>ZenBank</span>
    </div>
);

const VibeLogo: React.FC<{ theme: ColorPalette['palette'], fonts: FontPairing }> = ({ theme, fonts }) => (
    <div className="flex items-center gap-2">
        <div style={{ backgroundColor: theme.primary }} className="w-8 h-8 rounded-full flex items-center justify-center gap-0.5">
           <span style={{backgroundColor: theme.primaryText}} className="w-1 h-2 rounded-full"></span>
           <span style={{backgroundColor: theme.primaryText}} className="w-1 h-4 rounded-full"></span>
           <span style={{backgroundColor: theme.primaryText}} className="w-1 h-3 rounded-full"></span>
        </div>
        <span className="font-bold text-xl" style={{ color: theme.text, fontFamily: fonts.titleFont }}>Vibe</span>
    </div>
);

const FitTrackLogo: React.FC<{ theme: ColorPalette['palette'], fonts: FontPairing }> = ({ theme, fonts }) => (
    <div className="flex items-center gap-2">
        <div style={{ backgroundColor: theme.primary }} className="w-8 h-8 rounded-full flex items-center justify-center">
            <HeartPulse size={18} style={{ color: theme.primaryText }} />
        </div>
        <span className="font-bold text-xl" style={{ color: theme.text, fontFamily: fonts.titleFont }}>FitTrack</span>
    </div>
);

const CheflyLogo: React.FC<{ theme: ColorPalette['palette'], fonts: FontPairing }> = ({ theme, fonts }) => (
     <div className="flex items-center gap-2">
        <div style={{ backgroundColor: theme.primary }} className="w-8 h-8 rounded-full flex items-center justify-center">
            <CookingPot size={18} style={{ color: theme.primaryText }} />
        </div>
        <span className="font-bold text-xl" style={{ color: theme.text, fontFamily: fonts.titleFont }}>Chefly</span>
    </div>
);

// --- REAL COMPANY LOGOS ---
const AmazonLogo: React.FC<{ color: string }> = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h1.63c.45 0 .89.17 1.22.47l5.28 4.38c.33.27.76.45 1.22.47H20"/>
        <path d="M16.5 17.5c-1.5 0-3-1-3-2.5 0-1.5 1.5-2.5 3-2.5s3 1 3 2.5c0 1.5-1.5 2.5-3 2.5Z"/>
        <path d="M4 8h1.63c.45 0 .89.17 1.22.47l5.28 4.38c.33.27.76.45 1.22.47H20"/>
    </svg>
);
const StarbucksLogo: React.FC<{ color: string }> = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={color} stroke="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8-8 8zm4.68-6.15c.34.34.34.89 0 1.23l-1.31 1.31c-.34.34-.89.34-1.23 0l-1.15-1.15c-.29-.29-.77-.29-1.06 0l-1.15 1.15c-.34.34-.89.34-1.23 0l-1.31-1.31c-.34-.34-.34-.89 0-1.23l1.15-1.15c.29-.29.29-.77 0-1.06l-1.15-1.15c-.34-.34-.34-.89 0-1.23l1.31-1.31c.34-.34.89-.34 1.23 0l1.15 1.15c.29.29.77.29 1.06 0l1.15-1.15c.34-.34.89-.34 1.23 0l1.31 1.31c.34.34.34.89 0 1.23l-1.15 1.15c-.29.29-.29-.77 0 1.06l1.15 1.15z"/>
    </svg>
);

const SpotifyLogo = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
        <circle cx="12" cy="12" r="12" fill="#1DB954" />
        <path d="M6.2,12.61c-0.22,0-0.44-0.11-0.55-0.33c-0.11-0.22,0-0.44,0.11-0.55c2.31-1.32,5.06-1.65,8.03-0.88 c0.22,0.11,0.33,0.33,0.22,0.55c-0.11,0.22-0.33,0.33-0.55,0.22C10.56,11.01,7.91,11.34,6.2,12.61z" fill="#FFF"/>
        <path d="M5.87,15.17c-0.22,0-0.33-0.11-0.44-0.33c-0.11-0.22,0-0.44,0.22-0.55c2.75-1.54,6.71-1.76,9.46-0.99 c0.22,0.11,0.33,0.33,0.22,0.55c-0.11,0.22-0.33,0.33-0.55,0.22C12.1,13.3,8.44,13.52,5.87,15.17z" fill="#FFF"/>
        <path d="M5.65,17.72c-0.11-0.22-0.11-0.44,0.11-0.55c3.08-1.76,7.81-1.98,10.67-1.1c0.22,0.11,0.33,0.44,0.22,0.66 c-0.11,0.22-0.44,0.33-0.66,0.22c-2.53-0.77-6.82-0.55-9.57,1.1C6.2,17.94,5.87,17.94,5.65,17.72z" fill="#FFF"/>
    </svg>
);


const getComponentStyles = (style: string, theme: ColorPalette['palette'], isGradient: boolean = false): React.CSSProperties => {
    let baseStyle: React.CSSProperties = {};
    
    if (isGradient) {
        baseStyle.background = `linear-gradient(to bottom right, ${theme.primary}, ${theme.accent})`;
    } else {
        baseStyle.backgroundColor = theme.cardBg;
    }

    switch (style) {
        case 'Glassmorphism':
            const glassBg = isColorLight(theme.bg) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 35, 50, 0.2)';
            const glassBorder = isColorLight(theme.bg) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            return {
                backgroundColor: glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${glassBorder}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            };
        case 'Neumorphism':
            const lightShadow = `color-mix(in srgb, ${theme.bg} 10%, white)`;
            const darkShadow = `color-mix(in srgb, ${theme.bg} 80%, black)`;
            return {
                backgroundColor: theme.bg,
                boxShadow: `5px 5px 10px ${darkShadow}, -5px -5px 10px ${lightShadow}`
            };
        case 'Material Design':
            return {
                ...baseStyle,
                borderColor: theme.border,
                borderWidth: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            };
        case 'Flat Design':
        default:
            return {
                ...baseStyle,
                borderColor: theme.border,
                borderWidth: 1
            };
    }
}

const BottomNavBar: React.FC<{ theme: ColorPalette['palette'] }> = ({ theme }) => (
  <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="absolute bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-2 z-20">
      <div className="flex flex-col items-center" style={{ color: theme.primary }}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
      </div>
      <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
          <CreditCard size={24} />
          <span className="text-xs mt-1">Cards</span>
      </div>
      <div className="w-16 h-16 -mt-16">
        <div style={{ backgroundColor: theme.accent, borderColor: theme.bg }} className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4" >
           <Plus size={32} style={{ color: theme.primaryText }} />
        </div>
      </div>
      <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
          <Wallet size={24} />
          <span className="text-xs mt-1">Savings</span>
      </div>
      <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
          <CircleUserRound size={24} />
          <span className="text-xs mt-1">More</span>
      </div>
  </div>
);

const RecipeBottomNav: React.FC<{ theme: ColorPalette['palette'] }> = ({ theme }) => (
    <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="absolute bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-4 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
         <button className="p-2 flex flex-col items-center gap-1 group" style={{color: theme.primary}}>
            <Home size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">Home</span>
         </button>
         <button className="p-2 flex flex-col items-center gap-1 group" style={{color: theme.secondaryText}}>
            <Search size={24} className="group-hover:text-current transition-colors"/>
            <span className="text-[10px]">Search</span>
         </button>
         <button className="p-2 flex flex-col items-center gap-1 group" style={{color: theme.secondaryText}}>
            <Bookmark size={24} className="group-hover:text-current transition-colors"/>
            <span className="text-[10px]">Saved</span>
         </button>
         <button className="p-2 flex flex-col items-center gap-1 group" style={{color: theme.secondaryText}}>
             <CircleUserRound size={24} className="group-hover:text-current transition-colors"/>
             <span className="text-[10px]">Profile</span>
         </button>
    </div>
);


const BankingPreview: React.FC<PreviewStyleProps> = ({ theme, fonts, hierarchyStyle, balanceClasses, repetitionClass, componentStyle, layoutStyle, spacingClasses }) => {
    const cardClasses = `${spacingClasses.padding} w-full ${repetitionClass}`;
    
    // Spacing utility helper
    const getSpacing = (base: number) => {
        if (spacingClasses.gap.includes('2')) return base * 0.5;
        if (spacingClasses.gap.includes('6')) return base * 1.5;
        return base;
    }

    const transactions = [
        { name: 'Amazon Purchase', amt: '-€89.90', logo: AmazonLogo, type: 'Shopping' },
        { name: 'Starbucks', amt: '-€4.50', logo: StarbucksLogo, type: 'Food' },
        { name: 'Spotify Premium', amt: '-€9.99', logo: SpotifyLogo, type: 'Entertainment' },
        { name: 'Salary Deposit', amt: '+€3,200.00', logo: Landmark, type: 'Income' },
    ];

    const accountBalanceCard = (
        <div className={`${cardClasses} ${balanceClasses.text}`} style={{...getComponentStyles(componentStyle, theme, true), color: theme.primaryText }}>
            <p style={{fontFamily: fonts.bodyFont}} className={`text-sm opacity-80`}>Account Balance</p>
            <p style={{fontFamily: fonts.titleFont, ...hierarchyStyle}} className={`mt-1`}>€4,500.80</p>
            <p style={{fontFamily: fonts.bodyFont}} className={`text-xs mt-1 opacity-80`}>Available Funds</p>
            <div className={`w-full h-1.5 rounded-full mt-3 bg-white/30`}><div className={`w-3/4 h-1.5 rounded-full`} style={{backgroundColor: theme.primaryText}}></div></div>
        </div>
    );
    
    const transfersCard = (
        <div className={`${cardClasses} ${balanceClasses.text}`} style={getComponentStyles(componentStyle, theme)}>
            <div className="flex justify-between items-center mb-3">
                <h3 style={{color: theme.text, fontFamily: fonts.titleFont}} className={`font-bold text-base`}>Recent Transactions</h3>
                <Settings size={20} style={{color: theme.secondaryText}} />
            </div>
            <ul className={`space-y-${spacingClasses.gap.replace('gap-', '')}`}>
                {transactions.slice(0, 3).map(tx => (
                    <li key={tx.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full`} style={{backgroundColor: theme.bg}}>
                                <tx.logo color={theme.secondaryText} />
                            </div>
                            <div>
                                <p style={{color: theme.text, fontFamily: fonts.bodyFont}} className={`font-semibold text-sm text-left`}>{tx.name}</p>
                                <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className={`text-xs text-left`}>{tx.type}</p>
                            </div>
                        </div>
                        <p style={{color: tx.amt.startsWith('+') ? '#16A34A' : theme.text, fontFamily: fonts.bodyFont}} className={`font-semibold text-sm`}>{tx.amt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

    const budgetCard = (
         <div className={`${cardClasses} ${balanceClasses.text}`} style={getComponentStyles(componentStyle, theme)}>
           <h3 style={{color: theme.text, fontFamily: fonts.titleFont}} className={`font-bold text-base mb-3`}>Budget Overview</h3>
           <div className="flex items-center gap-4">
              <div className="w-1/3 text-center">
                  <BarChart3 size={32} className="mx-auto" style={{ color: theme.accent }} />
                  <p style={{ color: theme.secondaryText, fontFamily: fonts.bodyFont }} className="text-xs mt-1">60% of Budget</p>
              </div>
              <div className="flex-1 flex justify-around">
                  {[ { name: 'Anna' }, { name: 'Mark' } ].map(p => (
                    <div key={p.name} className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{backgroundColor: theme.bg}}><CircleUserRound size={20} style={{color: theme.secondaryText}}/></div>
                      <span style={{color: theme.text, fontFamily: fonts.bodyFont}} className="text-xs">{p.name}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{backgroundColor: theme.bg}}><UserPlus size={20} style={{color: theme.secondaryText}} /></div>
                      <span style={{color: theme.text, fontFamily: fonts.bodyFont}} className="text-xs">New</span>
                  </div>
              </div>
           </div>
        </div>
    );
    
    const boostSavingsCard = (
        <div className={`${cardClasses} ${balanceClasses.text} relative overflow-hidden`} style={{...getComponentStyles(componentStyle, theme, true), color: theme.primaryText}}>
             <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/20"></div>
             <div className="absolute -bottom-4 -right-2 w-16 h-16 rounded-full bg-white/10"></div>
            <h3 style={{fontFamily: fonts.titleFont}} className={`font-bold text-base`}>Boost Your Savings</h3>
            <p style={{fontFamily: fonts.bodyFont}} className={`text-sm mt-1 opacity-80`}>Turn on automatic round-ups to save with every purchase.</p>
            <button 
                style={{ backgroundColor: theme.primaryText, color: theme.primary, fontFamily: fonts.bodyFont }} 
                className={`font-bold py-2 px-4 rounded-lg mt-4 text-sm`}
            >
                Learn More
            </button>
        </div>
    );

    const renderLayout = () => {
        switch (layoutStyle) {
            case 'Feature-Focused':
                return (
                    <div className={`flex flex-col ${spacingClasses.marginY} pb-24 ${balanceClasses.item}`}>
                        <div className="w-full">{accountBalanceCard}</div>
                        <div className={`grid grid-cols-1 ${spacingClasses.gap}`}>
                           {transfersCard}
                           {budgetCard}
                           {boostSavingsCard}
                        </div>
                    </div>
                );
            case 'Card Grid (2-col)':
                 return (
                    <div className={`grid grid-cols-2 ${spacingClasses.gap} pb-24`}>
                        <div className="col-span-2">{accountBalanceCard}</div>
                        <div className="col-span-2">{transfersCard}</div>
                        <div className="col-span-1">{budgetCard}</div>
                        <div className="col-span-1">{boostSavingsCard}</div>
                    </div>
                );
            case 'Minimalist List':
                 return (
                    <div className={`flex flex-col ${spacingClasses.gap} pb-24 ${balanceClasses.item}`}>
                        {accountBalanceCard}
                        {transfersCard}
                        {budgetCard}
                        {boostSavingsCard}
                    </div>
                 );
            case 'Single Column Feed':
            default:
                 return (
                    <div className={`flex flex-col ${spacingClasses.marginY} pb-24 ${balanceClasses.item}`}>
                        {accountBalanceCard}
                        {transfersCard}
                        {budgetCard}
                        {boostSavingsCard}
                    </div>
                );
        }
    };
    return renderLayout();
};

const MusicPreview: React.FC<PreviewStyleProps> = ({ theme, fonts, hierarchyStyle, balanceClasses, repetitionClass, componentStyle, layoutStyle, spacingClasses }) => {
    
    // Determine layout specifics based on style
    const isMinimal = layoutStyle === 'Minimalist List';
    
    // Top Bar (Settings/Nav)
    const topBar = (
        <div className="flex justify-between items-center w-full mb-6 px-1">
             <button style={{color: theme.text}} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24} /></button>
             <span style={{color: theme.text, fontFamily: fonts.bodyFont}} className="text-xs font-bold tracking-widest uppercase opacity-60">Now Playing</span>
             <button style={{color: theme.text}} className="p-2 hover:bg-white/10 rounded-full transition-colors"><SlidersHorizontal size={20} /></button>
        </div>
    );

    // Album Art
    const artSizeClasses = isMinimal ? "w-24 h-24" : "w-full aspect-square max-w-[340px] mx-auto";
    const albumArt = (
        <div className={`relative ${repetitionClass} overflow-hidden shadow-2xl ${artSizeClasses} group`}>
             <img src="https://picsum.photos/seed/musicvibe/800" alt="Album art" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             {/* Gradient Overlay for texture */}
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
        </div>
    );
    
    // Song Info
    const infoClasses = isMinimal ? "text-left" : `text-center mt-8 mb-2`;
    const songInfo = (
        <div className={`${infoClasses} w-full`}>
            <h2 style={{...hierarchyStyle, color: theme.text, fontFamily: fonts.titleFont, fontSize: isMinimal ? '1.25rem' : '1.75rem'}} className="font-bold leading-tight mb-1">Neon Nights</h2>
            <div className="flex flex-col gap-0.5">
                <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-base font-medium">The Midnight</p>
                {!isMinimal && <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-xs uppercase tracking-widest opacity-60">Endless Summer</p>}
            </div>
        </div>
    );

    // Like & Volume Row
    const actionRow = (
        <div className="flex justify-between items-center w-full mt-6 px-4">
            <button style={{color: theme.text}} className="hover:text-red-500 transition-colors"><Heart size={24} /></button>
            <button style={{color: theme.text}} className="hover:text-brand-accent transition-colors"><Volume2 size={24} /></button>
        </div>
    );

    // Progress Bar
    const progressBar = (
        <div className="w-full mt-6 px-2">
            <div className="w-full h-1.5 rounded-full relative group cursor-pointer bg-gray-700/30">
                 <div 
                    className="absolute top-0 left-0 h-full rounded-full z-10" 
                    style={{
                        background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, 
                        width: '35%'
                    }}
                 ></div>
                 <div 
                    className="absolute top-1/2 -translate-y-1/2 left-[35%] w-4 h-4 rounded-full border-2 bg-white shadow-lg transition-transform hover:scale-125"
                    style={{borderColor: theme.accent}}
                 ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium font-mono" style={{color: theme.secondaryText}}>
                <span>1:20</span>
                <span>4:20</span>
            </div>
        </div>
    );

    // Main Controls
    const mainControls = (
         <div className="flex justify-between items-center w-full mt-8 px-2">
            <button style={{color: theme.secondaryText}} className="hover:text-current transition-colors p-2"><Repeat size={20} /></button>
            <button style={{color: theme.text}} className="hover:scale-110 transition-transform p-2"><SkipBack size={32} fill="currentColor" className="opacity-90" /></button>
            
            <button 
                style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, 
                    color: theme.primaryText,
                    boxShadow: `0 10px 30px -10px ${theme.primary}80`
                }} 
                className="w-20 h-20 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 mx-4"
            >
                <Pause size={32} fill="currentColor" />
            </button>
            
            <button style={{color: theme.text}} className="hover:scale-110 transition-transform p-2"><SkipForward size={32} fill="currentColor" className="opacity-90" /></button>
            <button style={{color: theme.secondaryText}} className="hover:text-current transition-colors p-2"><Shuffle size={20} /></button>
         </div>
    );

    // Bottom Lyrics
    const lyricsTab = (
        <div className="flex flex-col items-center mt-auto pt-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
            <ChevronUp size={20} style={{color: theme.text}} className="group-hover:-translate-y-1 transition-transform" />
            <span style={{color: theme.text, fontFamily: fonts.bodyFont}} className="text-xs font-bold uppercase tracking-widest mt-1">Lyrics</span>
        </div>
    );

    if (isMinimal) {
        return (
            <div className={`flex flex-col h-full pb-24 ${spacingClasses.padding}`}>
                {topBar}
                 <div className="flex-1 flex flex-col justify-center gap-6">
                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        {albumArt}
                        <div className="flex-1 min-w-0">
                            <h3 style={{color: theme.text, fontFamily: fonts.titleFont}} className="font-bold truncate text-xl">Neon Nights</h3>
                            <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-sm truncate">The Midnight</p>
                        </div>
                        <button style={{color: theme.primary}} className="p-3 bg-white/10 rounded-full hover:bg-white/20"><Pause size={24} fill="currentColor"/></button>
                    </div>
                     <div className="px-2">
                        {progressBar}
                     </div>
                 </div>
            </div>
        )
    }

    return (
        <div className={`flex flex-col h-full pb-24 ${spacingClasses.padding}`}>
            {topBar}
            <div className="flex-1 flex flex-col justify-center w-full">
                {albumArt}
                {songInfo}
                {actionRow}
                {progressBar}
                {mainControls}
            </div>
            {lyricsTab}
        </div>
    );
};

const FitnessPreview: React.FC<PreviewStyleProps> = ({ theme, fonts, hierarchyStyle, balanceClasses, repetitionClass, componentStyle, layoutStyle, spacingClasses }) => {
    const cardStyles = getComponentStyles(componentStyle, theme);
    const cardClasses = `${spacingClasses.padding} w-full ${repetitionClass}`;
    
    // Bottom Navigation for Fitness to make it look like a complete app
    const fitnessNav = (
        <div style={{ backgroundColor: theme.cardBg, borderColor: theme.border }} className="absolute bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-2 z-20">
            <div className="flex flex-col items-center" style={{ color: theme.primary }}>
                <Home size={24} />
                <span className="text-[10px] mt-1 font-bold">Today</span>
            </div>
            <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <BarChart3 size={24} />
                <span className="text-[10px] mt-1">Activity</span>
            </div>
            <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <UtensilsCrossed size={24} />
                <span className="text-[10px] mt-1">Nutrition</span>
            </div>
            <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <CircleUserRound size={24} />
                <span className="text-[10px] mt-1">Profile</span>
            </div>
        </div>
    );

    const statsCard = (
        <div className={cardClasses} style={cardStyles}>
            <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className={`text-sm ${balanceClasses.text}`}>Today's Activity</p>
            <div className={`grid grid-cols-3 gap-2 mt-3`}>
                {[ { icon: Footprints, value: '8,450', label: 'Steps' }, { icon: Flame, value: '320', label: 'Calories' }, { icon: Bed, value: '7h 15m', label: 'Sleep' }, ].map(item => (
                    <div key={item.label} className={balanceClasses.text}>
                        <item.icon size={24} style={{color: theme.accent}} className={`${balanceClasses.text === 'text-center' ? 'mx-auto' : ''}`} />
                        <p style={{color: theme.text, fontFamily: fonts.bodyFont}} className={`font-bold mt-1`}>{item.value}</p>
                        <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className={`text-xs`}>{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const workoutsList = (
        <div className={`w-full ${balanceClasses.text}`}>
            <h3 style={{...hierarchyStyle, color: theme.text, fontSize: '1.25rem', fontFamily: fonts.titleFont }} className={`mb-2`}>Recent Workouts</h3>
            <div className={spacingClasses.marginY.replace('space-y', 'space-y-2')}>
                {[{title: 'Morning Run', detail: '3.2 miles'}, {title: 'Gym Session', detail: '45 min'}].map(w => (
                    <div key={w.title} className={`${cardClasses} flex justify-between items-center`} style={cardStyles}>
                        <div className="flex items-center gap-3">
                             <div className="p-2 rounded-full" style={{backgroundColor: `${theme.primary}15`}}>
                                <Dumbbell size={16} style={{color: theme.primary}} />
                             </div>
                             <div>
                                <p style={{color: theme.text, fontFamily: fonts.bodyFont}} className={`font-bold`}>{w.title}</p>
                                <p style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className={`text-sm`}>{w.detail}</p>
                             </div>
                        </div>
                        <button style={{backgroundColor: theme.primary, color: theme.primaryText, fontFamily: fonts.bodyFont}} className={`text-xs font-bold py-1 px-3 rounded-full`}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const waterCard = (
        <div className={`${cardClasses} ${balanceClasses.text}`} style={cardStyles}>
            <div className="flex items-center justify-between mb-2">
                <h4 style={{color: theme.text, fontFamily: fonts.titleFont}} className="font-bold">Water</h4>
                <div style={{ backgroundColor: `${theme.accent}20` }} className="p-1.5 rounded-full">
                    <Droplets size={16} style={{ color: theme.accent }} />
                </div>
            </div>
            <div className="flex items-end gap-1 mb-2">
                 <span style={{color: theme.text, fontFamily: fonts.bodyFont}} className="text-2xl font-bold">1.2L</span>
                 <span style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-xs mb-1">/ 2.0L</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg }}>
                <div className="h-full rounded-full" style={{ backgroundColor: theme.primary, width: '60%' }}></div>
            </div>
        </div>
    );

    const awardsCard = (
        <div className={`${cardClasses} ${balanceClasses.text}`} style={cardStyles}>
            <div className="flex items-center justify-between mb-3">
                <h4 style={{color: theme.text, fontFamily: fonts.titleFont}} className="font-bold">Awards</h4>
                 <div style={{ backgroundColor: `${theme.accent}20` }} className="p-1.5 rounded-full">
                    <Trophy size={16} style={{ color: theme.accent }} />
                </div>
            </div>
            <div className="flex justify-between gap-1">
                 <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border text-[10px] font-bold" style={{ borderColor: theme.primary, color: theme.primary, backgroundColor: `${theme.primary}10` }}>7d</div>
                    <span style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-[9px] mt-1 font-semibold">Streak</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border text-[10px]" style={{ borderColor: theme.accent, color: theme.accent, backgroundColor: `${theme.accent}10` }}>
                        <Flame size={14} />
                    </div>
                    <span style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-[9px] mt-1 font-semibold">Burn</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border text-[10px]" style={{ borderColor: theme.text, color: theme.text, backgroundColor: `${theme.text}10` }}>
                        <Footprints size={14} />
                    </div>
                    <span style={{color: theme.secondaryText, fontFamily: fonts.bodyFont}} className="text-[9px] mt-1 font-semibold">Steps</span>
                 </div>
            </div>
        </div>
    );

    let content;
    if (layoutStyle === 'Card Grid (2-col)') {
        content = (
            <div className={`grid grid-cols-2 ${spacingClasses.gap} pb-24`}>
                <div className="col-span-2">{statsCard}</div>
                <div className="col-span-2">{workoutsList}</div>
                <div className="col-span-1">{waterCard}</div>
                <div className="col-span-1">{awardsCard}</div>
            </div>
        );
    } else {
        content = (
            <div className={`${spacingClasses.marginY} pb-24`}>
                {statsCard}
                {workoutsList}
                {waterCard}
                {awardsCard}
            </div>
        );
    }

    return (
        <div className="relative h-full flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {content}
            </div>
            {fitnessNav}
        </div>
    );
};

const RecipePreview: React.FC<PreviewStyleProps> = ({ theme, fonts, hierarchyStyle, balanceClasses, repetitionClass, componentStyle, layoutStyle, spacingClasses }) => {
    
    const StatBadge = ({ icon: Icon, label, value, sub }: any) => (
        <div 
            className={`flex flex-col items-center justify-center p-3 rounded-2xl w-full aspect-[4/5]`}
            style={{ 
                backgroundColor: componentStyle === 'Neumorphism' ? theme.bg : theme.cardBg,
                border: componentStyle === 'Flat Design' ? `1px solid ${theme.border}` : 'none',
                boxShadow: componentStyle === 'Neumorphism' 
                    ? `5px 5px 10px ${theme.border}40, -5px -5px 10px #ffffff` // Approximation
                    : '0 4px 12px rgba(0,0,0,0.05)'
            }}
        >
             <div className="p-2.5 rounded-full mb-2" style={{ backgroundColor: `${theme.accent}15` }}>
                 <Icon size={22} style={{ color: theme.accent }} />
             </div>
             <span style={{ color: theme.text, fontFamily: fonts.titleFont }} className="font-bold text-base">{value}</span>
             <span style={{ color: theme.secondaryText, fontFamily: fonts.bodyFont }} className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
    );

     return (
        <div className="flex flex-col relative -mx-4 -mt-2 pb-24">
            {/* Full Bleed Image Header */}
            <div className="relative h-80 w-full shrink-0 bg-orange-100">
                <img 
                    src="https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/62298.jpg?output-format=auto&output-quality=auto&resize=600:*" 
                    alt="Chocolate Chip Cookies" 
                    className="w-full h-full object-cover block" 
                />
                <button 
                    className="absolute top-4 left-4 p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-20"
                >
                    <ChevronLeft size={24} />
                </button>
                {/* Gradient fade at bottom of image for blending */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Content Body - Overlapping Card */}
            <div 
                className={`relative z-10 -mt-10 rounded-t-[32px] px-6 pt-8 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[500px]`} 
                style={{ backgroundColor: theme.bg }}
            >
                 {/* Title Row */}
                 <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <span style={{ color: theme.accent, fontFamily: fonts.bodyFont }} className="text-xs font-bold uppercase tracking-widest mb-1 block">Dessert</span>
                        <h1 style={{ fontFamily: fonts.titleFont, color: theme.text, ...hierarchyStyle }} className="text-3xl font-bold leading-tight">Best Chocolate Chip Cookies</h1>
                    </div>
                    <div className="text-right shrink-0 ml-4 flex flex-col items-end">
                         <button 
                            style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }} 
                            className="p-3 rounded-full hover:brightness-95 transition-all"
                        >
                            <Heart size={20} fill="currentColor" />
                        </button>
                    </div>
                 </div>
                 
                 {/* Reviews */}
                 <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400 gap-0.5">
                        <Star fill="currentColor" size={14}/>
                        <Star fill="currentColor" size={14}/>
                        <Star fill="currentColor" size={14}/>
                        <Star fill="currentColor" size={14}/>
                        <Star fill="currentColor" size={14}/>
                    </div>
                    <span style={{ color: theme.secondaryText }} className="text-xs font-medium">(12k Reviews)</span>
                 </div>

                 {/* Description */}
                 <p style={{ fontFamily: fonts.bodyFont, color: theme.secondaryText }} className="text-sm leading-relaxed mb-6">
                    Crispy on the edges, chewy in the middle, and packed with chocolate chips. The only recipe you need.
                 </p>

                 {/* Stats Badge Grid - More Visual */}
                 <div className="grid grid-cols-3 gap-3 mb-8">
                     <StatBadge icon={Users} label="Yield" value="24" />
                     <StatBadge icon={Timer} label="Prep" value="15 min" />
                     <StatBadge icon={Flame} label="Cal" value="190" />
                 </div>

                 {/* Ingredients */}
                 <h3 style={{ fontFamily: fonts.titleFont, color: theme.text }} className="font-bold text-lg mb-4 flex items-center gap-2">
                    <ChefHat size={20} className="text-brand-accent" style={{color: theme.accent}} /> Ingredients
                 </h3>
                 <ul className="space-y-3 mb-8">
                    {[
                        "2 1/4 cups all-purpose flour",
                        "1 tsp baking soda",
                        "1 cup (2 sticks) butter, softened",
                        "3/4 cup granulated sugar",
                        "3/4 cup packed brown sugar",
                        "1 tsp vanilla extract",
                        "2 large eggs",
                        "2 cups semisweet chocolate chips"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                            <div 
                                className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5" 
                                style={{ borderColor: theme.border, backgroundColor: theme.cardBg }}
                            >
                                <div className="w-2.5 h-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.primary }}></div>
                            </div>
                            <span style={{ fontFamily: fonts.bodyFont, color: theme.text }} className="text-sm font-medium">{item}</span>
                        </li>
                    ))}
                 </ul>
                 
                 {/* Directions Snippet */}
                 <h3 style={{ fontFamily: fonts.titleFont, color: theme.text }} className="font-bold text-lg mb-4">Directions</h3>
                 <div className="relative pl-2 space-y-6">
                     {/* Timeline Line */}
                     <div className="absolute top-2 bottom-2 left-[19px] w-0.5" style={{ backgroundColor: theme.border }}></div>
                     
                     <div className="flex gap-4 relative">
                         <div className="flex flex-col items-center gap-1 shrink-0 z-10">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm" style={{ backgroundColor: theme.primary, color: theme.primaryText }}>1</div>
                         </div>
                         <div className="pb-2">
                             <h4 style={{ color: theme.text }} className="font-bold text-sm mb-1">Preheat & Prep</h4>
                             <p style={{ fontFamily: fonts.bodyFont, color: theme.secondaryText }} className="text-sm leading-relaxed">
                                 Preheat oven to 375°F. Line baking sheets with parchment paper.
                             </p>
                         </div>
                     </div>
                     <div className="flex gap-4 relative">
                         <div className="flex flex-col items-center gap-1 shrink-0 z-10">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border bg-white" style={{ borderColor: theme.border, color: theme.secondaryText }}>2</div>
                         </div>
                         <div>
                             <h4 style={{ color: theme.text }} className="font-bold text-sm mb-1">Mix Wet Ingredients</h4>
                             <p style={{ fontFamily: fonts.bodyFont, color: theme.secondaryText }} className="text-sm leading-relaxed">
                                 Beat butter, sugars, and vanilla until creamy. Add eggs, one at a time.
                             </p>
                         </div>
                     </div>
                      <div className="flex gap-4 relative">
                         <div className="flex flex-col items-center gap-1 shrink-0 z-10">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border bg-white" style={{ borderColor: theme.border, color: theme.secondaryText }}>3</div>
                         </div>
                         <div>
                             <h4 style={{ color: theme.text }} className="font-bold text-sm mb-1">Combine & Bake</h4>
                             <p style={{ fontFamily: fonts.bodyFont, color: theme.secondaryText }} className="text-sm leading-relaxed">
                                 Gradually stir in flour mixture and chocolate chips. Drop onto baking sheets. Bake for 9 to 11 minutes.
                             </p>
                         </div>
                     </div>
                 </div>

                 {/* Chef's Tip */}
                 <div className="mt-8 p-4 rounded-xl flex gap-3" style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}>
                    <div className="shrink-0"><Star size={20} style={{ color: theme.accent }} fill="currentColor" /></div>
                    <div>
                        <span style={{ color: theme.accent }} className="text-xs font-bold uppercase tracking-wider block mb-1">Chef's Tip</span>
                        <p style={{ color: theme.text, fontSize: '0.85rem' }}>Chill the dough for 30 minutes before baking for a chewier texture and deeper flavor.</p>
                    </div>
                 </div>
            </div>
        </div>
     );
};

interface LivePreviewProps {
    choices: DesignChoices;
    challenge: DesignChallengeData;
    customPaletteColors: CustomPaletteColors; // UPDATED: Accept full object
    fontPairing: FontPairing;
    mockupImageUrl?: string | null;
    analyzedUI?: UIComponent | null;
    isAnalyzing?: boolean;
}

const LivePreview = React.forwardRef<HTMLDivElement, LivePreviewProps>(({ choices, challenge, customPaletteColors, fontPairing, mockupImageUrl, analyzedUI, isAnalyzing }, ref) => {
  const { 
    layoutStyle, componentStyle, hierarchy, contrast, alignment, repetition, colorPalette, spacing
  } = choices;
  
  let theme: ColorPalette['palette'];
  if (colorPalette === 'Custom') {
      // UPDATED: Construct theme from full custom object
      theme = {
          name: 'Custom',
          palette: {
              primary: customPaletteColors.primary,
              accent: customPaletteColors.accent,
              bg: customPaletteColors.bg,
              cardBg: customPaletteColors.cardBg,
              text: customPaletteColors.text,
              secondaryText: `color-mix(in srgb, ${customPaletteColors.text} 70%, transparent)`, // Auto-derive secondary
              border: `color-mix(in srgb, ${customPaletteColors.text} 20%, transparent)`, // Auto-derive border
              primaryText: isColorLight(customPaletteColors.primary) ? '#1E293B' : '#FFFFFF', // Auto-contrast for button text
          }
      }.palette;
  } else {
      theme = COLOR_PALETTES.find(p => p.name === colorPalette)?.palette || COLOR_PALETTES[0].palette;
  }
  
  const HIERARCHY_MAP: Record<string, React.CSSProperties> = { 
    'Title-Focused': { fontSize: '2rem', fontWeight: 'bold' }, 
    'Balanced': { fontSize: '1.5rem', fontWeight: 'bold' }, 
    'Subtle': { fontSize: '1.25rem', fontWeight: '600' }, 
    'Inverted': { fontSize: '1.125rem', fontWeight: '500' } 
  };
  const hierarchyStyle = HIERARCHY_MAP[hierarchy] || HIERARCHY_MAP['Balanced'];
  
  const CONTRAST_MAP: Record<string, Partial<ColorPalette['palette']>> = {
      'WCAG AAA (High)': { bg: '#FFFFFF', cardBg: '#F0F0F0', primary: '#000000', primaryText: '#FFFFFF', text: '#000000', secondaryText: '#595959', accent: '#333333', border: '#D0D0D0' },
      'Subtle (Low)': { text: theme.secondaryText, secondaryText: `color-mix(in srgb, ${theme.secondaryText} 50%, ${theme.bg})` },
  };
  if (CONTRAST_MAP[contrast]) theme = { ...theme, ...CONTRAST_MAP[contrast] };

  const ALIGNMENT_MAP: Record<string, {text: string, item: string}> = {
    'Left-Aligned': { text: 'text-left', item: 'items-start' },
    'Center-Aligned': { text: 'text-center', item: 'items-center' },
    'Right-Aligned': { text: 'text-right', item: 'items-end' },
    'Justified': { text: 'text-justify', item: 'items-start' }
  };
  const balanceClasses = ALIGNMENT_MAP[alignment] || { text: 'text-left', item: 'items-start' };

  const REPETITION_MAP: Record<string, string> = { 'Strict System': 'rounded-xl', 'Thematic System': 'rounded-lg', 'No System (Chaotic)': 'rounded-none' };
  const repetitionClass = REPETITION_MAP[repetition] || 'rounded-xl';

  const SPACING_MAP: Record<string, { padding: string; gap: string; marginY: string; }> = {
      'Compact': { padding: 'p-2', gap: 'gap-2', marginY: 'space-y-2' },
      'Standard': { padding: 'p-4', gap: 'gap-4', marginY: 'space-y-4' },
      'Relaxed': { padding: 'p-6', gap: 'gap-6', marginY: 'space-y-6' },
  }
  const spacingClasses = SPACING_MAP[spacing] || SPACING_MAP['Standard'];

  const styleProps: PreviewStyleProps = { theme, fonts: fontPairing, hierarchyStyle, balanceClasses, repetitionClass, componentStyle, layoutStyle, spacingClasses };
  
  const renderAppContent = () => {
    switch (challenge.id) {
      case 1: return <BankingPreview {...styleProps} />;
      case 2: return <MusicPreview {...styleProps} />;
      case 3: return <FitnessPreview {...styleProps} />;
      case 4: return <RecipePreview {...styleProps} />;
      default: return <BankingPreview {...styleProps} />;
    }
  };

  const renderLogo = () => {
      switch(challenge.id) {
          case 1: return <ZenBankLogo theme={theme} fonts={fontPairing} />;
          case 2: return <VibeLogo theme={theme} fonts={fontPairing} />;
          case 3: return <FitTrackLogo theme={theme} fonts={fontPairing} />;
          case 4: return <CheflyLogo theme={theme} fonts={fontPairing} />;
          default: return <ZenBankLogo theme={theme} fonts={fontPairing} />;
      }
  }

  const isGlass = componentStyle === 'Glassmorphism' && !mockupImageUrl && !analyzedUI;

  const renderPreviewContent = () => {
    if (analyzedUI) {
      return (
        <div className="w-full h-full rounded-[32px] overflow-hidden bg-brand-bg relative">
             <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
                <DynamicRenderer 
                  component={analyzedUI} 
                  palette={theme} 
                  fonts={fontPairing} 
                  componentStyle={componentStyle}
                  repetition={repetition}
                  hierarchy={hierarchy}
                  alignment={alignment}
                  spacing={spacing}
                  layoutStyle={layoutStyle}
                />
             </div>
        </div>
      );
    }
    if (mockupImageUrl) {
      return (
        <div 
          className="w-full h-full bg-contain bg-no-repeat bg-center rounded-[32px]"
          style={{ 
              backgroundImage: `url(${mockupImageUrl})`,
              backgroundColor: '#1E293B'
          }}
        />
      );
    }
    // Default pre-built challenges
    return (
      <div className="relative z-10 h-full" style={{ backgroundColor: theme.bg }}>
        {isGlass && (
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px]">
                <div className="absolute bg-purple-500 rounded-full w-72 h-72 -top-10 -left-16 mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute bg-yellow-500 rounded-full w-72 h-72 -bottom-10 right-0 mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bg-pink-500 rounded-full w-72 h-72 -bottom-20 -left-10 mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>
        )}
        <div className="relative z-10 h-full">
            <div className="h-full overflow-y-auto no-scrollbar">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-30"></div>
                
                {/* Header Section - Hide for Recipe App as it has custom header */}
                {challenge.id !== 4 && (
                    <header className={`sticky top-0 z-20 pt-8 px-4 flex justify-between items-center`} style={{color: theme.text, backgroundColor: `color-mix(in srgb, ${theme.bg} 80%, transparent)`}}>
                        {renderLogo()}
                        <div className="flex items-center gap-3">
                            <Bell size={22} style={{color: theme.secondaryText}} />
                            <Settings size={22} style={{color: theme.secondaryText}} />
                        </div>
                    </header>
                )}

                <main className={`p-4 mt-2 flex flex-col ${challenge.id === 4 ? '' : 'h-full'}`}>
                    {renderAppContent()}
                </main>
            </div>
            {challenge.id === 1 && <BottomNavBar theme={theme} />}
            {challenge.id === 4 && <RecipeBottomNav theme={theme} />}
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className="w-full h-full mx-auto rounded-[40px] shadow-2xl overflow-hidden bg-black p-3 border-4 border-gray-800">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden transition-colors duration-300">
            {isAnalyzing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 text-center bg-slate-900/80 backdrop-blur-sm p-4 rounded-[32px]">
                <LoadingSpinner />
                <p className="text-slate-200 font-semibold">Analyzing your mockup...</p>
                <p className="text-slate-400 text-sm">Gemini is deconstructing the UI. This might take a moment.</p>
            </div>
            )}
            {renderPreviewContent()}
        </div>
    </div>
  );
});

export default LivePreview;
