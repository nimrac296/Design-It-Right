
import { ChallengeData, ChallengeType, DesignOption, ColorPalette, FontPairing } from './types';

export const DESIGN_CHALLENGES: ChallengeData[] = [
  {
    id: 1,
    type: ChallengeType.DESIGN,
    title: 'Mobile Banking App Home Screen',
    scenario: 'You are designing the home screen for a new mobile banking app called "ZenBank". The target audience is young professionals who value simplicity, security, and quick access to key information.',
    requirements: [
      "Display the user's current balance prominently.",
      'Provide quick access to "Send Money", "Deposit Check", and "View Transactions".',
      'The design should feel modern, trustworthy, and clean.',
    ],
  },
  {
    id: 2,
    type: ChallengeType.DESIGN,
    title: 'Music Player "Now Playing" Screen',
    scenario: 'Design the "Now Playing" screen for a music streaming service called "Vibe". The app is known for its vibrant and youth-focused branding. Users need clear controls and engaging visuals.',
    requirements: [
      'Display song title, artist, and album art.',
      'Include standard controls: play/pause, next, and previous.',
      'The design should feel energetic, modern, and immersive.',
    ],
  },
  {
    id: 3,
    type: ChallengeType.DESIGN,
    title: 'Fitness Tracker Dashboard',
    scenario: 'Create the main dashboard for "FitTrack", a fitness app that helps users monitor their daily activity. The goal is to motivate users by presenting their data in a clear and encouraging way.',
    requirements: [
      'Show key metrics like steps, active calories, and distance.',
      'Provide a summary of recent workouts.',
      'The UI should be clean, motivational, and easy to scan.',
    ],
  },
  {
    id: 4,
    type: ChallengeType.DESIGN,
    title: 'Recipe Discovery App',
    scenario: 'You are designing the home screen for "Chefly", an app for finding and saving recipes. The app targets home cooks who appreciate beautiful food photography and simple instructions.',
    requirements: [
      'Feature a prominent "Recipe of the Day".',
      'Allow users to browse by categories like "Dinner", "Dessert", etc.',
      'The design must be visually appealing, clean, and inspiring.',
    ],
  },
];

export const LAYOUT_STYLE_OPTIONS: DesignOption[] = [
  { name: 'Single Column Feed', description: 'Classic top-to-bottom flow, easy to scroll.' },
  { name: 'Card Grid (2-col)', description: 'A compact, scannable grid layout for content.' },
  { name: 'Minimalist List', description: 'Clean, text-focused rows for high information density.' },
];

export const COMPONENT_STYLE_OPTIONS: DesignOption[] = [
  { name: 'Flat Design', description: 'Clean, modern style with solid colors and no depth.' },
  { name: 'Neumorphism', description: 'Soft, extruded plastic look using subtle shadows and highlights.' },
  { name: 'Material Design', description: 'Google\'s style with subtle shadows and clear interaction states.' },
];

export const HIERARCHY_OPTIONS: DesignOption[] = [
  { name: 'Title-Focused', description: 'Extra-large titles create a strong focal point.' },
  { name: 'Inverted', description: 'Body text is larger than the title for an artistic effect.' },
];

// Reordered so WCAG AA is first/default
export const CONTRAST_OPTIONS: DesignOption[] = [
  { name: 'WCAG AA (Standard)', description: 'Good contrast that meets standard accessibility guidelines.' },
  { name: 'WCAG AAA (High)', description: 'Very high contrast, ideal for maximum accessibility.' },
  { name: 'Subtle (Low)', description: 'Soft and elegant, but may be difficult for some users to read.' },
  { name: 'Artistic (Vibrant)', description: 'Uses bold, complementary colors for a high-energy feel.' },
];

export const ALIGNMENT_OPTIONS: DesignOption[] = [
    { name: 'Left-Aligned', description: 'Clean and organized. Creates a strong invisible line on the left.' },
    { name: 'Center-Aligned', description: 'Formal and sometimes static. Can be hard to read for long text.' },
    { name: 'Right-Aligned', description: 'Used for special cases, draws attention to the right edge.' },
    { name: 'Justified', description: 'Creates clean edges on both sides, but can create awkward spacing.' },
];

export const REPETITION_OPTIONS: DesignOption[] = [
    { name: 'Strict System', description: 'Creates unity. All buttons, icons, and cards share identical styles.' },
    { name: 'Thematic System', description: 'Elements are stylistically similar but have minor variations.' },
    { name: 'No System (Chaotic)', description: 'Creates confusion. Elements with similar functions look different.' },
];

export const SPACING_OPTIONS: DesignOption[] = [
    { name: 'Compact', description: 'Tight spacing with smaller margins for high information density.' },
    { name: 'Standard', description: 'Balanced whitespace suitable for most mobile interfaces.' },
    { name: 'Relaxed', description: 'Generous padding and margins for an airy, luxurious feel.' },
];

export const COLOR_PALETTES: ColorPalette[] = [
    { name: 'Cyber Future', palette: { bg: '#09090B', cardBg: '#18181B', primary: '#F43F5E', primaryText: '#FFFFFF', text: '#E2E8F0', secondaryText: '#94A3B8', accent: '#22D3EE', border: '#27272A' } },
    { name: 'Clean Slate', palette: { bg: '#FFFFFF', cardBg: '#F1F5F9', primary: '#2563EB', primaryText: '#FFFFFF', text: '#0F172A', secondaryText: '#475569', accent: '#CBD5E1', border: '#E2E8F0' } },
    { name: 'Dark Mode', palette: { bg: '#0F172A', cardBg: '#1E293B', primary: '#3B82F6', primaryText: '#FFFFFF', text: '#F8FAFC', secondaryText: '#94A3B8', accent: '#60A5FA', border: '#334155' } },
    { name: 'Ocean Breeze', palette: { bg: '#EFF6FF', cardBg: '#FFFFFF', primary: '#2563EB', primaryText: '#FFFFFF', text: '#172554', secondaryText: '#1e40af', accent: '#3B82F6', border: '#DBEAFE' } },
    { name: 'Forest Walk', palette: { bg: '#F0FDF4', cardBg: '#FFFFFF', primary: '#16A34A', primaryText: '#FFFFFF', text: '#022c22', secondaryText: '#14532d', accent: '#22C55E', border: '#DCFCE7' } },
    { name: 'Sunset Glow', palette: { bg: '#FFF7ED', cardBg: '#FFFFFF', primary: '#F97316', primaryText: '#FFFFFF', text: '#7c2d12', secondaryText: '#9a3412', accent: '#FB923C', border: '#FFEDD5' } },
    { name: 'Royal Purple', palette: { bg: '#F5F3FF', cardBg: '#FFFFFF', primary: '#7C3AED', primaryText: '#FFFFFF', text: '#581c87', secondaryText: '#6b21a8', accent: '#8B5CF6', border: '#E9D5FF' } },
    { name: 'Crimson Bold', palette: { bg: '#FEF2F2', cardBg: '#FFFFFF', primary: '#DC2626', primaryText: '#FFFFFF', text: '#7f1d1d', secondaryText: '#991b1b', accent: '#EF4444', border: '#FEE2E2' } },
    { name: 'Mono Chrome', palette: { bg: '#F8FAFC', cardBg: '#FFFFFF', primary: '#1E293B', primaryText: '#FFFFFF', text: '#0F172A', secondaryText: '#64748B', accent: '#334155', border: '#E2E8F0' } },
    { name: 'Minty Fresh', palette: { bg: '#ECFDF5', cardBg: '#FFFFFF', primary: '#10B981', primaryText: '#FFFFFF', text: '#064E3B', secondaryText: '#4B5563', accent: '#34D399', border: '#A7F3D0' } },
    { name: 'Tangerine Dream', palette: { bg: '#FFFBEB', cardBg: '#FFFFFF', primary: '#F59E0B', primaryText: '#1E293B', text: '#451a03', secondaryText: '#78350F', accent: '#FBBF24', border: '#FEF3C7' } },
    { name: 'Sakura Pink', palette: { bg: '#FEF6F9', cardBg: '#FFFFFF', primary: '#EC4899', primaryText: '#FFFFFF', text: '#831843', secondaryText: '#9d174d', accent: '#F472B6', border: '#FCE7F3' } },
];

export const FONT_PAIRINGS: FontPairing[] = [
    { name: 'Modern Sans', titleFont: "'Inter', sans-serif", bodyFont: "'Inter', sans-serif", description: 'Clean, neutral, and highly readable.' },
    { name: 'Elegant Serif', titleFont: "'Playfair Display', serif", bodyFont: "'Lora', serif", description: 'Sophisticated high-contrast serif.' },
    { name: 'Stylish Mix', titleFont: "'Playfair Display', serif", bodyFont: "'Inter', sans-serif", description: 'Serif headline with clean body.' },
    { name: 'System UI', titleFont: "Arial, sans-serif", bodyFont: "Arial, sans-serif", description: 'Default, safe, and legible.' },
    { name: 'Techy Mono', titleFont: "'Courier New', monospace", bodyFont: "'Courier New', monospace", description: 'Technical retro vibe.' },
    { name: 'Playful', titleFont: "'Comic Sans MS', 'cursive', sans-serif", bodyFont: "'Comic Sans MS', 'cursive', sans-serif", description: 'Informal and fun.' },
];
