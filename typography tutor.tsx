import React, { useState } from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  CaseSensitive,
  Scan,
  RotateCw,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Type,
  Copy,
  LayoutList,
  Scaling,
  Contrast,
  Rows,
  TextQuote, // For font weight
  Baseline, // For line height
  Columns, // For column balance
  Image, // For opacity
  Wand2, // For AI Playground
  Loader2, // For loading spinner
  ClipboardCheck, // For score
} from 'lucide-react';

// --- Principle Data ---
const principles = {
  hierarchy: {
    id: 'hierarchy',
    title: 'Hierarchy',
    icon: LayoutList,
    description: 'Guiding the eye to what matters most.',
    learn: `Hierarchy is the art of arranging elements to show their order of importance. Designers use size, color, and placement to tell your eyes what to look at first, second, and third. Without it, every piece of information screams for attention at once, and nothing gets heard.`,
    activities: [
      {
        id: 1,
        title: 'Activity 1: By Size',
        fixType: 'fontSize',
        problem: { titleSize: 'text-lg', bodySize: 'text-md' },
        solution: { titleSize: 'text-4xl' },
        explanation:
          'Great! By making the headline significantly larger, you establish a clear visual hierarchy. The user knows exactly what to read first.',
      },
      {
        id: 2,
        title: 'Activity 2: By Weight',
        fixType: 'fontWeight',
        problem: { fontWeight: 'font-normal' },
        solution: { fontWeight: 'font-bold' },
        explanation:
          'Perfect! Using a heavier font weight is another key way to create hierarchy. It makes the title "pop" without just making it bigger.',
      },
    ],
  },
  contrast: {
    id: 'contrast',
    title: 'Contrast',
    icon: Contrast,
    description: 'Making elements stand out from each other.',
    learn: `Contrast is what makes an element "pop." It's the difference between light and dark, big and small, thick and thin. High contrast (like black text on a white background) is easy to read. Low contrast (like light gray on white) is difficult and should be avoided for important info. It's a key part of accessibility.`,
    activities: [
      {
        id: 3,
        title: 'Activity 1: Color (Accessibility)',
        fixType: 'color',
        problem: { bgColor: 'bg-blue-500', textColor: 'text-blue-200' },
        solution: { textColor: 'text-white' },
        explanation:
          'Excellent! Using white text on a dark blue background provides high contrast, making the button readable and accessible for everyone.',
      },
      {
        id: 4,
        title: 'Activity 2: Typeface (Style)',
        fixType: 'fontFamily',
        problem: { bodyFont: 'font-sans' },
        solution: { bodyFont: 'font-serif' },
        explanation:
          "Nice! By contrasting a modern, sans-serif headline with an elegant serif font for the quote, you create stylistic contrast. It's visually interesting.",
      },
    ],
  },
  balance: {
    id: 'balance',
    title: 'Balance',
    icon: Scaling,
    description: 'Creating a feeling of stability in a design.',
    learn: `Balance is the distribution of visual weight in your design. Just like a physical object, a design can feel 'lopsided' if all the heavy elements are on one side. Symmetrical balance (mirror image) is stable and formal. Asymmetrical balance (using different-sized elements) is more dynamic and modern.`,
    activities: [
      {
        id: 5,
        title: 'Activity 1: Symmetrical Balance',
        fixType: 'alignment',
        problem: { alignment: 'text-left', margin: 'mr-auto' },
        solution: { alignment: 'text-center', margin: 'mx-auto' },
        explanation:
          'Perfect! By centering the elements, you create symmetrical balance. The design feels more stable, professional, and harmonious.',
      },
      {
        id: 6,
        title: 'Activity 2: Asymmetrical Balance',
        fixType: 'columnBalance',
        problem: {
          colSpanLeft: 'col-span-2',
          colSpanRight: 'col-span-1',
        },
        solution: { colSpanLeft: 'col-span-1', colSpanRight: 'col-span-1' },
        explanation:
          "That's it! Even though the columns aren't identical, they feel 'balanced' because the visual weight is distributed. This is asymmetrical balance.",
      },
    ],
  },
  alignment: {
    id: 'alignment',
    title: 'Alignment',
    icon: AlignLeft,
    description: 'Connecting elements with an invisible line.',
    learn: `Alignment is the 'glue' that holds a design together. It's about placing elements so their edges or centers line up on a common, invisible line. This creates a sharp, organized, and clean look. Avoid center-aligning long paragraphs—it makes them very hard to read!`,
    activities: [
      {
        id: 7,
        title: 'Activity 1: Readability',
        fixType: 'textAlignment',
        problem: { textAlignment: 'text-center' },
        solution: { textAlignment: 'text-left' },
        explanation:
          "Exactly! Left-aligning body text (for languages like English) creates a strong, clean 'edge' for the eye to follow, making it much easier to read.",
      },
      {
        id: 8,
        title: 'Activity 2: Grid Alignment',
        fixType: 'itemAlignment',
        problem: { items: 'items-start' },
        solution: { items: 'items-center' },
        explanation:
          "Great fix! By vertically aligning all the items to their center, the whole row feels much more organized and intentional, even though the elements are different.",
      },
    ],
  },
  typography: {
    id: 'typography',
    title: 'Typography',
    icon: Type,
    description: 'The art and style of arranging type.',
    learn: `Typography is the style, arrangement, and appearance of text. It's not just the font you choose! It's also the size (hierarchy), line spacing (legibility), and alignment. Good typography makes reading effortless; bad typography makes it a chore.`,
    activities: [
      {
        id: 9,
        title: 'Activity 1: Font Choice',
        fixType: 'bodyFontFamily', // Renamed from 'fontFamily'
        problem: { bodyFont: 'font-serif' },
        solution: { bodyFont: 'font-sans' },
        explanation:
          'Exactly! While serif fonts can be elegant (and great for print), sans-serif fonts are often clearer and more legible for body text on digital screens.',
      },
      {
        id: 10,
        title: 'Activity 2: Line Height (Leading)',
        fixType: 'lineHeight',
        problem: { lineHeight: 'leading-tight' },
        solution: { lineHeight: 'leading-loose' },
        explanation:
          "Much better! That cramped text was hard to read. Adding more line height (or 'leading') gives each line room to breathe and is much more comfortable for the reader.",
      },
    ],
  },
  repetition: {
    id: 'repetition',
    title: 'Repetition / Unity',
    icon: Copy,
    description: 'Repeating styles to create unity and logic.',
    learn: `Repetition is about using the same design element over and over. This could be a color, a font, a shape, or a layout. Repetition creates unity, making different parts of a design feel like they belong together. It also creates predictability, so a user knows a 'blue button' always does the same thing.`,
    activities: [
      {
        id: 11,
        title: 'Activity 1: Button Styles',
        fixType: 'buttonStyle',
        problem: { style: 'mixed' },
        solution: { style: 'unified' },
        explanation:
          'Yes! By using the same style (repetition) for all buttons, you create a sense of unity and predictability. The user instantly knows these are all similar actions.',
      },
      {
        id: 12,
        title: 'Activity 2: Visual Metaphors',
        fixType: 'iconStyle',
        problem: { iconStyle: 'mixed' },
        solution: { iconStyle: 'unified' },
        explanation:
          'Yes! By using a consistent icon style (all "outline" icons), the design feels unified and professional. Mixing styles (outline, filled, two-tone) looks messy.',
      },
    ],
  },
  colorHarmony: {
    id: 'colorHarmony',
    title: 'Color Harmony',
    icon: Palette,
    description: 'Using the color wheel to create palettes.',
    learn: `Color Harmony is about using the color wheel to build palettes that feel 'right.' An Analogous palette uses colors that are next to each other (like blue and purple), creating a serene, harmonious feel. A Complementary palette uses colors opposite each other (like red and green) for high-energy, high-contrast designs.`,
    activities: [
      {
        id: 13,
        title: 'Activity 1: Analogous Colors',
        fixType: 'colorHarmony',
        problem: { alertBg: 'bg-red-500' },
        solution: { alertBg: 'bg-purple-500' },
        explanation:
          "That's it! Purple is next to blue on the color wheel, creating an analogous color harmony. It's distinct enough to be an alert, but doesn't clash violently.",
      },
      {
        id: 14,
        title: 'Activity 2: Using Opacity',
        fixType: 'imageOpacity',
        problem: { opacity: 'opacity-100' },
        solution: { opacity: 'opacity-20' },
        explanation:
          "Perfect! By reducing the background image's opacity, you stop it from 'fighting' with the text. The text is now the most important thing, as it should be.",
      },
    ],
  },
};

// --- Reusable Button Component ---
// FIX: Add explicit props type using React.PropsWithChildren to correctly handle the 'children' prop 
// and resolve TypeScript errors about missing 'children'.
function ControlButton({
  onClick,
  isActive,
  children,
  className = '',
  title,
}: React.PropsWithChildren<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  className?: string;
  title: string;
}>) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex-1 p-3 rounded-lg border-2 transition-all duration-150 ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } ${className}`}
    >
      {children}
    </button>
  );
}

// --- Helper function to render control sets ---
function renderControlSet(fixType: string, userFixes: any, onFix: (fixes: any) => void) {
  switch (fixType) {
    case 'fontSize':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Small"
            onClick={() => onFix({ titleSize: 'text-lg' })}
            isActive={userFixes.titleSize === 'text-lg'}
          >
            <CaseSensitive size={20} className="mx-auto" />
            <span className="text-xs">Small</span>
          </ControlButton>
          <ControlButton
            title="Medium"
            onClick={() => onFix({ titleSize: 'text-2xl' })}
            isActive={userFixes.titleSize === 'text-2xl'}
          >
            <CaseSensitive size={24} className="mx-auto" />
            <span className="text-xs">Medium</span>
          </ControlButton>
          <ControlButton
            title="Large"
            onClick={() => onFix({ titleSize: 'text-4xl' })}
            isActive={userFixes.titleSize === 'text-4xl'}
          >
            <CaseSensitive size={28} className="mx-auto" />
            <span className="text-xs">Large</span>
          </ControlButton>
        </div>
      );
    // NEW: fontWeight
    case 'fontWeight':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Normal"
            onClick={() => onFix({ fontWeight: 'font-normal' })}
            isActive={userFixes.fontWeight === 'font-normal'}
          >
            <span className="font-normal text-xl mx-auto">Aa</span>
            <span className="text-xs">Normal</span>
          </ControlButton>
          <ControlButton
            title="Semibold"
            onClick={() => onFix({ fontWeight: 'font-semibold' })}
            isActive={userFixes.fontWeight === 'font-semibold'}
          >
            <span className="font-semibold text-xl mx-auto">Aa</span>
            <span className="text-xs">Semibold</span>
          </ControlButton>
          <ControlButton
            title="Bold"
            onClick={() => onFix({ fontWeight: 'font-bold' })}
            isActive={userFixes.fontWeight === 'font-bold'}
          >
            <span className="font-bold text-xl mx-auto">Aa</span>
            <span className="text-xs">Bold</span>
          </ControlButton>
        </div>
      );
    case 'color':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Light Blue Text"
            onClick={() => onFix({ textColor: 'text-blue-200' })}
            isActive={userFixes.textColor === 'text-blue-200'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-blue-200 mx-auto border" />
            <span className="text-xs mt-1">Light Blue</span>
          </ControlButton>
          <ControlButton
            title="Dark Text"
            onClick={() => onFix({ textColor: 'text-gray-800' })}
            isActive={userFixes.textColor === 'text-gray-800'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-gray-800 mx-auto border" />
            <span className="text-xs mt-1">Dark</span>
          </ControlButton>
          <ControlButton
            title="White Text"
            onClick={() => onFix({ textColor: 'text-white' })}
            isActive={userFixes.textColor === 'text-white'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-white mx-auto border" />
            <span className="text-xs mt-1">White</span>
          </ControlButton>
        </div>
      );
    // NEW: fontFamily (for contrast)
    case 'fontFamily':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Sans-Serif"
            onClick={() => onFix({ bodyFont: 'font-sans' })}
            isActive={userFixes.bodyFont === 'font-sans'}
          >
            <Type size={20} className="mx-auto font-sans" />
            <span className="text-xs">Sans-Serif</span>
          </ControlButton>
          <ControlButton
            title="Serif"
            onClick={() => onFix({ bodyFont: 'font-serif' })}
            isActive={userFixes.bodyFont === 'font-serif'}
          >
            <Type size={20} className="mx-auto font-serif" />
            <span className="text-xs">Serif</span>
          </ControlButton>
          <ControlButton
            title="Mono"
            onClick={() => onFix({ bodyFont: 'font-mono' })}
            isActive={userFixes.bodyFont === 'font-mono'}
          >
            <Type size={20} className="mx-auto font-mono" />
            <span className="text-xs">Mono</span>
          </ControlButton>
        </div>
      );
    // NEW: bodyFontFamily (for typography)
    case 'bodyFontFamily':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Serif Font"
            onClick={() => onFix({ bodyFont: 'font-serif' })}
            isActive={userFixes.bodyFont === 'font-serif'}
          >
            <Type size={20} className="mx-auto font-serif" />
            <span className="text-xs">Serif</span>
          </ControlButton>
          <ControlButton
            title="Sans-Serif Font"
            onClick={() => onFix({ bodyFont: 'font-sans' })}
            isActive={userFixes.bodyFont === 'font-sans'}
          >
            <Type size={20} className="mx-auto font-sans" />
            <span className="text-xs">Sans-Serif</span>
          </ControlButton>
          <ControlButton
            title="Mono Font"
            onClick={() => onFix({ bodyFont: 'font-mono' })}
            isActive={userFixes.bodyFont === 'font-mono'}
          >
            <Type size={20} className="mx-auto font-mono" />
            <span className="text-xs">Mono</span>
          </ControlButton>
        </div>
      );
    // NEW: lineHeight
    case 'lineHeight':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Tight"
            onClick={() => onFix({ lineHeight: 'leading-tight' })}
            isActive={userFixes.lineHeight === 'leading-tight'}
          >
            <Baseline size={20} className="mx-auto" />
            <span className="text-xs">Tight</span>
          </ControlButton>
          <ControlButton
            title="Relaxed"
            onClick={() => onFix({ lineHeight: 'leading-relaxed' })}
            isActive={userFixes.lineHeight === 'leading-relaxed'}
          >
            <Baseline size={24} className="mx-auto" />
            <span className="text-xs">Relaxed</span>
          </ControlButton>
          <ControlButton
            title="Loose"
            onClick={() => onFix({ lineHeight: 'leading-loose' })}
            isActive={userFixes.lineHeight === 'leading-loose'}
          >
            <Baseline size={28} className="mx-auto" />
            <span className="text-xs">Loose</span>
          </ControlButton>
        </div>
      );
    case 'alignment':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Align Left"
            onClick={() => onFix({ alignment: 'text-left', margin: 'mr-auto' })}
            isActive={userFixes.alignment === 'text-left'}
          >
            <AlignLeft className="mx-auto" />
            <span className="text-xs">Left</span>
          </ControlButton>
          <ControlButton
            title="Align Center"
            onClick={() =>
              onFix({ alignment: 'text-center', margin: 'mx-auto' })
            }
            isActive={userFixes.alignment === 'text-center'}
          >
            <AlignCenter className="mx-auto" />
            <span className="text-xs">Center</span>
          </ControlButton>
          <ControlButton
            title="Align Right"
            onClick={() =>
              onFix({ alignment: 'text-right', margin: 'ml-auto' })
            }
            isActive={userFixes.alignment === 'text-right'}
          >
            <AlignRight className="mx-auto" />
            <span className="text-xs">Right</span>
          </ControlButton>
        </div>
      );
    // NEW: columnBalance
    case 'columnBalance':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Unbalanced"
            onClick={() =>
              onFix({ colSpanLeft: 'col-span-2', colSpanRight: 'col-span-1' })
            }
            isActive={userFixes.colSpanLeft === 'col-span-2'}
          >
            <Columns size={20} className="mx-auto" />
            <span className="text-xs">Unbalanced</span>
          </ControlButton>
          <ControlButton
            title="Balanced"
            onClick={() =>
              onFix({ colSpanLeft: 'col-span-1', colSpanRight: 'col-span-1' })
            }
            isActive={userFixes.colSpanLeft === 'col-span-1'}
          >
            <Columns size={24} className="mx-auto" />
            <span className="text-xs">Balanced</span>
          </ControlButton>
        </div>
      );
    case 'textAlignment':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Align Left"
            onClick={() => onFix({ textAlignment: 'text-left' })}
            isActive={userFixes.textAlignment === 'text-left'}
          >
            <AlignLeft className="mx-auto" />
            <span className="text-xs">Left</span>
          </ControlButton>
          <ControlButton
            title="Align Center"
            onClick={() => onFix({ textAlignment: 'text-center' })}
            isActive={userFixes.textAlignment === 'text-center'}
          >
            <AlignCenter className="mx-auto" />
            <span className="text-xs">Center</span>
          </ControlButton>
          <ControlButton
            title="Align Right"
            onClick={() => onFix({ textAlignment: 'text-right' })}
            isActive={userFixes.textAlignment === 'text-right'}
          >
            <AlignRight className="mx-auto" />
            <span className="text-xs">Right</span>
          </ControlButton>
        </div>
      );
    // NEW: itemAlignment
    case 'itemAlignment':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Align Top"
            onClick={() => onFix({ items: 'items-start' })}
            isActive={userFixes.items === 'items-start'}
          >
            <AlignLeft className="mx-auto -rotate-90" />
            <span className="text-xs">Top</span>
          </ControlButton>
          <ControlButton
            title="Align Center"
            onClick={() => onFix({ items: 'items-center' })}
            isActive={userFixes.items === 'items-center'}
          >
            <AlignCenter className="mx-auto -rotate-90" />
            <span className="text-xs">Center</span>
          </ControlButton>
          <ControlButton
            title="Align Bottom"
            onClick={() => onFix({ items: 'items-end' })}
            isActive={userFixes.items === 'items-end'}
          >
            <AlignRight className="mx-auto -rotate-90" />
            <span className="text-xs">Bottom</span>
          </ControlButton>
        </div>
      );
    case 'buttonStyle':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Mixed Styles"
            onClick={() => onFix({ style: 'mixed' })}
            isActive={userFixes.style === 'mixed'}
          >
            <XCircle size={20} className="mx-auto" />
            <span className="text-xs">Mixed</span>
          </ControlButton>
          <ControlButton
            title="Unified Style"
            onClick={() => onFix({ style: 'unified' })}
            isActive={userFixes.style === 'unified'}
          >
            <Copy size={20} className="mx-auto" />
            <span className="text-xs">Unified</span>
          </ControlButton>
        </div>
      );
    // NEW: iconStyle
    case 'iconStyle':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Mixed Styles"
            onClick={() => onFix({ iconStyle: 'mixed' })}
            isActive={userFixes.iconStyle === 'mixed'}
          >
            <XCircle size={20} className="mx-auto" />
            <span className="text-xs">Mixed</span>
          </ControlButton>
          <ControlButton
            title="Unified Style"
            onClick={() => onFix({ iconStyle: 'unified' })}
            isActive={userFixes.iconStyle === 'unified'}
          >
            <Copy size={20} className="mx-auto" />
            <span className="text-xs">Unified</span>
          </ControlButton>
        </div>
      );
    case 'colorHarmony':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="Clashing Red"
            onClick={() => onFix({ alertBg: 'bg-red-500' })}
            isActive={userFixes.alertBg === 'bg-red-500'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-red-500 mx-auto border" />
            <span className="text-xs mt-1">Red</span>
          </ControlButton>
          <ControlButton
            title="Harmonious Purple"
            onClick={() => onFix({ alertBg: 'bg-purple-500' })}
            isActive={userFixes.alertBg === 'bg-purple-500'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-purple-500 mx-auto border" />
            <span className="text-xs mt-1">Purple</span>
          </ControlButton>
          <ControlButton
            title="Muted Green"
            onClick={() => onFix({ alertBg: 'bg-emerald-500' })}
            isActive={userFixes.alertBg === 'bg-emerald-500'}
            className="flex-col"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 mx-auto border" />
            <span className="text-xs mt-1">Green</span>
          </ControlButton>
        </div>
      );
    // NEW: imageOpacity
    case 'imageOpacity':
      return (
        <div className="flex gap-3">
          <ControlButton
            title="100%"
            onClick={() => onFix({ opacity: 'opacity-100' })}
            isActive={userFixes.opacity === 'opacity-100'}
            className="flex-col"
          >
            <Image size={20} className="mx-auto opacity-100" />
            <span className="text-xs mt-1">100%</span>
          </ControlButton>
          <ControlButton
            title="50%"
            onClick={() => onFix({ opacity: 'opacity-50' })}
            isActive={userFixes.opacity === 'opacity-50'}
            className="flex-col"
          >
            <Image size={20} className="mx-auto opacity-50" />
            <span className="text-xs mt-1">50%</span>
          </ControlButton>
          <ControlButton
            title="20%"
            onClick={() => onFix({ opacity: 'opacity-20' })}
            isActive={userFixes.opacity === 'opacity-20'}
            className="flex-col"
          >
            <Image size={20} className="mx-auto opacity-20" />
            <span className="text-xs mt-1">20%</span>
          </ControlButton>
        </div>
      );
    default:
      return null;
  }
}

// --- Dynamic Canvas ---
// Renders the "problem" area for the interactive activity.
function DesignCanvas({ activity, userFixes }: { activity: any, userFixes: any }) {
  const { fixType, problem } = activity;

  // Merge problem styles with user fixes to get the current state
  const appliedStyles = { ...problem, ...userFixes };

  return (
    <div className="w-full h-full min-h-[400px] bg-gray-200 p-8 flex items-center justify-center transition-all duration-300 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
      <div className="w-full max-w-lg">
        {/* --- HIERARCHY --- */}
        {fixType === 'fontSize' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            <h1
              className={`font-bold text-gray-800 ${appliedStyles.titleSize} transition-all duration-300`}
            >
              Weekly Newsletter
            </h1>
            <p
              className={`mt-2 text-gray-600 ${appliedStyles.bodySize} transition-all duration-300`}
            >
              Design tips and tricks, delivered to your inbox.
            </p>
          </div>
        )}
        {fixType === 'fontWeight' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            <h1
              className={`text-2xl text-gray-800 ${appliedStyles.fontWeight} transition-all duration-300`}
            >
              The Science of Design
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              An upcoming webinar
            </p>
          </div>
        )}

        {/* --- CONTRAST --- */}
        {fixType === 'color' && (
          <button
            className={`w-full font-bold py-4 px-6 rounded-lg shadow-lg text-lg transition-all duration-300 ${appliedStyles.bgColor} ${appliedStyles.textColor}`}
          >
            Click Me to Sign Up
          </button>
        )}
        {fixType === 'fontFamily' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 text-center">
            <h1 className="font-bold text-gray-800 text-3xl font-sans">
              "Design is thinking made visual."
            </h1>
            <p
              className={`mt-4 text-gray-700 text-xl italic ${appliedStyles.bodyFont} transition-all duration-300`}
            >
              - Saul Bass
            </p>
          </div>
        )}

        {/* --- BALANCE --- */}
        {fixType === 'alignment' && (
          <div
            className={`w-3/4 ${appliedStyles.alignment} ${appliedStyles.margin} transition-all duration-300`}
          >
            <Rows
              className={`text-blue-500 ${appliedStyles.margin}`}
              size={48}
            />
            <h3 className="mt-2 text-2xl font-bold text-gray-800">
              Stable Design
            </h3>
            <p className="mt-1 text-gray-600">This feels balanced.</p>
          </div>
        )}
        {fixType === 'columnBalance' && (
          <div className="w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 grid grid-cols-3 gap-6">
            <div
              className={`transition-all duration-300 ${appliedStyles.colSpanLeft}`}
            >
              <h3 className="text-xl font-bold text-gray-800">Main Feature</h3>
              <p className="text-gray-600 mt-2">
                This content takes up the main area. It needs to be balanced
                with the sidebar.
              </p>
            </div>
            <div
              className={`transition-all duration-300 bg-blue-50 p-4 rounded-lg ${appliedStyles.colSpanRight}`}
            >
              <h4 className="font-semibold text-blue-800">Sidebar</h4>
              <p className="text-sm text-blue-700 mt-1">Related links</p>
            </div>
          </div>
        )}

        {/* --- ALIGNMENT --- */}
        {fixType === 'textAlignment' && (
          <div
            className={`w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${appliedStyles.textAlignment}`}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">
              Chapter One
            </h3>
            <p className="text-gray-700">
              This text is much easier to read when it has a consistent left
              edge. Center-aligning long blocks of text creates 'ragged edges'
              on both sides, forcing the reader's eye to search for the start of
              each new line.
            </p>
          </div>
        )}
        {fixType === 'itemAlignment' && (
          <div
            className={`w-full bg-white p-6 rounded-lg shadow-md transition-all duration-300 flex gap-4 ${appliedStyles.items}`}
          >
            <div className="p-4 bg-gray-200 rounded text-center">
              <h4 className="font-bold">Item 1</h4>
              <p className="text-sm">Short</p>
            </div>
            <div className="p-4 bg-gray-200 rounded text-center">
              <h4 className="font-bold">Item 2</h4>
              <p className="text-sm">
                This one is much
                <br />
                taller than the others
              </p>
            </div>
            <div className="p-4 bg-gray-200 rounded text-center">
              <h4 className="font-bold">Item 3</h4>
              <p className="text-sm">Medium height</p>
            </div>
          </div>
        )}

        {/* --- TYPOGRAPHY --- */}
        {fixType === 'bodyFontFamily' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            <h1 className="font-bold text-gray-800 text-2xl font-sans">
              The Daily Read
            </h1>
            <p
              className={`mt-2 text-gray-700 text-md leading-relaxed ${appliedStyles.bodyFont} transition-all duration-300`}
            >
              Good typography is about more than just picking fonts. It's about
              shaping the text to be as readable and comfortable as possible for
              the user. This text needs to be easy on the eyes.
            </p>
          </div>
        )}
        {fixType === 'lineHeight' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              The Art of Reading
            </h3>
            <p
              className={`text-gray-700 ${appliedStyles.lineHeight} transition-all duration-300`}
            >
              This paragraph is all about legibility. When lines of text are too
              close together, it becomes very difficult for the reader's eye to
              move from the end of one line to the beginning of the next. It
              feels cramped and causes eye strain.
            </p>
          </div>
        )}

        {/* --- REPETITION --- */}
        {fixType === 'buttonStyle' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Join Us</h3>
            <button
              className={`w-40 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ${
                appliedStyles.style === 'unified'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-500 text-white' // Problem style
              }`}
            >
              Sign Up
            </button>
            <button
              className={`w-40 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ${
                appliedStyles.style === 'unified'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border-2 border-blue-500' // Problem style
              }`}
            >
              Learn More
            </button>
            <button
              className={`w-40 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ${
                appliedStyles.style === 'unified'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white' // Problem style
              }`}
            >
              Contact Us
            </button>
          </div>
        )}
        {fixType === 'iconStyle' && (
          <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 flex justify-around items-center gap-4">
            {/* These SVG icons are complex to write by hand.
                In a real app, you'd use an icon library like lucide-react.
                For this simulation, we'll use text to represent the styles.
             */}
            <div className="text-center">
              <svg
                className={`w-12 h-12 text-blue-600 transition-all duration-300 ${
                  appliedStyles.iconStyle === 'unified' ? 'fill-none' : ''
                }`}
                stroke="currentColor"
                fill={
                  appliedStyles.iconStyle === 'unified'
                    ? 'none'
                    : 'currentColor'
                } // Problem style
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <p className="text-sm text-gray-600 mt-1">Home</p>
            </div>
            <div className="text-center">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <p className="text-sm text-gray-600 mt-1">Profile</p>
            </div>
            <div className="text-center">
              <svg
                className={`w-12 h-12 text-blue-600 transition-all duration-300 ${
                  appliedStyles.iconStyle === 'unified' ? 'fill-none' : ''
                }`}
                stroke="currentColor"
                fill={
                  appliedStyles.iconStyle === 'unified'
                    ? 'none'
                    : 'currentColor'
                } // Problem style
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <p className="text-sm text-gray-600 mt-1">Alerts</p>
            </div>
          </div>
        )}

        {/* --- COLOR HARMONY --- */}
        {fixType === 'colorHarmony' && (
          <div className="bg-blue-500 p-6 rounded-lg shadow-lg transition-all duration-300">
            <h1 className="font-bold text-white text-3xl">Dashboard</h1>
            <p className="mt-1 text-blue-100">Welcome back, user.</p>
            <div
              className={`mt-4 p-4 rounded-lg shadow-inner ${appliedStyles.alertBg} transition-all duration-300`}
            >
              <h3 className="font-bold text-white">New Alert!</h3>
              <p className="text-white opacity-90 text-sm">
                This color needs to work with the blue theme.
              </p>
            </div>
          </div>
        )}
        {fixType === 'imageOpacity' && (
          <div
            className="relative w-full h-64 rounded-lg shadow-lg flex items-center justify-center p-6 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage:
                "url('https://placehold.co/600x400/a3e635/172554?text=NATURE')",
            }}
          >
            <div
              className={`absolute inset-0 w-full h-full bg-black rounded-lg ${appliedStyles.opacity} transition-all duration-300`}
            ></div>
            <div className="relative z-10 text-center">
              <h1 className="font-bold text-white text-4xl shadow-md">
                The Beauty of Nature
              </h1>
              <p className="mt-2 text-white text-lg font-medium shadow-sm">
                This text should be easy to read.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW: Interactive Activity Component ---
// This component is a self-contained "game" for one activity.
// It manages its own state, feedback, and reset logic.
function InteractiveActivity({ activity }: { activity: any }) {
  const [userFixes, setUserFixes] = useState(activity.problem);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isComplete, setIsComplete] = useState(false);

  const handleFix = (fixesObject: any) => {
    const newFixes = { ...userFixes, ...fixesObject };
    setUserFixes(newFixes);

    let allCorrect = true;
    for (const key in activity.solution) {
      if (newFixes[key] !== activity.solution[key]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setFeedback({
        message: activity.explanation,
        type: 'success',
      });
      setIsComplete(true);
    } else {
      setFeedback({ message: 'Not quite... Keep trying!', type: 'error' });
      setIsComplete(false);
    }
  };

  const handleResetFix = () => {
    setUserFixes(activity.problem);
    setFeedback({ message: '', type: '' });
    setIsComplete(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-6">
      {/* 1. The Canvas */}
      <DesignCanvas activity={activity} userFixes={userFixes} />

      {/* 2. The Controls & Feedback */}
      <div className="p-6 bg-white">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Fix It Controls
        </h3>
        {renderControlSet(activity.fixType, userFixes, handleFix)}

        {feedback.message && (
          <div
            className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{feedback.message}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleResetFix}
            className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <RotateCw size={16} />
            Reset Activity
          </button>
        </div>
      </div>
    </div>
  );
}

// --- NEW: Home Page Card ---
// FIX: Add explicit props type to resolve TypeScript errors about invalid 'key' prop.
const PrincipleCard: React.FC<{
  principle: any;
  onSelect: (id: string) => void;
}> = ({ principle, onSelect }) => {
  const Icon = principle.icon;
  return (
    <button
      onClick={() => onSelect(principle.id)}
      className="text-left p-6 bg-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <Icon className="w-10 h-10 text-blue-600 mb-3" />
      <h3 className="text-xl font-bold text-gray-900">{principle.title}</h3>
      <p className="text-gray-600 mt-1 flex-1">{principle.description}</p>
      <span className="font-semibold text-blue-600 mt-4">Learn More</span>
    </button>
  );
};

// --- NEW: Playground Card (for Home Page) ---
function PlaygroundCard({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect('playground')}
      className="text-left p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <Wand2 className="w-10 h-10 text-white mb-3" />
      <h3 className="text-xl font-bold">AI Design Playground</h3>
      <p className="opacity-90 mt-1 flex-1">
        A sandbox to practice your skills with live AI feedback.
      </p>
      <span className="font-semibold text-white mt-4">Start Designing</span>
    </button>
  );
}

// --- NEW: Home Page ---
// This component shows the grid of all principles.
function HomePage({ principles, onSelect }: { principles: any[], onSelect: (id: string) => void }) {
  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Design-It-Right
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          Your interactive guide to the core principles of graphic design.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((p) => (
          <PrincipleCard key={p.id} principle={p} onSelect={onSelect} />
        ))}
        {/* Add the new Playground Card */}
        <PlaygroundCard onSelect={onSelect} />
      </div>
    </div>
  );
}

// --- NEW: Principle Page ---
// This component shows the 'Learn' text and the 'Activity' for one principle.
function PrinciplePage({ principle, onBack }: { principle: any, onBack: () => void }) {
  return (
    <div className="p-6 sm:p-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition-all mb-4"
      >
        <ArrowLeft size={18} />
        Back to All Principles
      </button>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">{principle.title}</h1>
      </header>

      <div className="prose prose-lg max-w-none">
        <h2>What is {principle.title}?</h2>
        <p>{principle.learn}</p>
      </div>

      {/* Map over all activities for this principle */}
      {principle.activities.map((activity: any, index: number) => (
        <div key={activity.id} className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Activity {index + 1}: {activity.title}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Time to put it into practice. Try to fix this common design
            problem.
          </p>
          <InteractiveActivity activity={activity} />
        </div>
      ))}
    </div>
  );
}

// --- NEW: AI API Call Utility ---
/**
 * Fetches data from the Gemini API with exponential backoff.
 */
async function fetchWithBackoff(apiUrl: string, payload: any, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          // Throttling or server error, worth retrying
          throw new Error(`API Error: ${response.status}`);
        } else {
          // Other client error (e.g., 400), don't retry
          const errorResult = await response.json();
          console.error('Non-retriable API error:', errorResult);
          return null; // Or throw a specific error
        }
      }

      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`, error);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error('All API retry attempts failed.');
        return null; // Return null after all retries fail
      }
    }
  }
}

// --- NEW: Playground Task Data (with Briefs) ---
const playgroundTasks = [
  {
    id: 'product',
    title: 'Product Card',
    defaultTitle: 'Mountain Bikes',
    defaultBody:
      'Explore our new line of professional-grade mountain bikes, built to handle the toughest trails.',
    defaultButton: 'Shop Now',
    brief: 'Client wants this to feel energetic and bold to attract young athletes. High-energy and clear.',
    defaultBgImage: '', // No default image for product card
    defaultBgImageOpacity: 1,
  },
  {
    id: 'event',
    title: 'Event Poster',
    defaultTitle: 'Jazz Festival',
    defaultBody:
      'Live at the park. This weekend only. Featuring the Cool Cats Quartet.',
    defaultButton: 'Get Tickets',
    brief: 'Client wants a sophisticated, high-end, and minimalist feel for an exclusive event. Think "less is more".',
    defaultBgImage:
      'https://images.unsplash.com/photo-1510915228310-fe7569537f2a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Black and white jazz
    defaultBgImageOpacity: 0.2,
  },
  {
    id: 'testimonial',
    title: 'Testimonial',
    defaultTitle: '"This app is a life-saver!"',
    defaultBody: '- Jane Doe, CEO of TechCorp',
    defaultButton: 'Read More Stories',
    brief: 'Client wants this to feel trustworthy, calm, and professional. It should build confidence in the brand.',
    defaultBgImage: '', // No default image for testimonial
    defaultBgImageOpacity: 1,
  },
];

// --- NEW: AI Design Playground Page ---
function DesignPlaygroundPage({ onBack }: { onBack: () => void }) {
  // Design element states
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [cardColor, setCardColor] = useState('#ffffff');
  const [titleColor, setTitleColor] = useState('#11182d');
  const [bodyColor, setBodyColor] = useState('#4b5563');
  const [titleSize, setTitleSize] = useState(24);
  const [bodySize, setBodySize] = useState(16);
  const [alignment, setAlignment] = useState('text-left');
  const [titleFont, setTitleFont] = useState('font-sans');
  const [bodyFont, setBodyFont] = useState('font-sans');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [buttonColor, setButtonColor] = useState('#2563eb'); // Default blue

  // --- NEW: Background image states ---
  const [bgImage, setBgImage] = useState('');
  const [bgImageOpacity, setBgImageOpacity] = useState(1);

  // Task State
  const [activeTaskId, setActiveTaskId] = useState('product');
  const activeTask =
    playgroundTasks.find((t) => t.id === activeTaskId) || playgroundTasks[0];

  // AI Feedback states
  const [aiFeedback, setAiFeedback] = useState(
    'Welcome to the playground! Pick a task, change the design, and click "Analyze" to get your score.'
  );
  const [isLoading, setIsLoading] = useState(false);
  // --- NEW: Gamification States ---
  const [score, setScore] = useState<number | null>(null);
  const [scoreJustification, setScoreJustification] = useState('');

  // Effect to reset states when activeTask changes
  React.useEffect(() => {
    // Reset colors to common defaults or task-specific defaults
    setBgColor('#f3f4f6');
    setCardColor('#ffffff');
    setTitleColor('#11182d');
    setBodyColor('#4b5563');
    setTitleSize(24);
    setBodySize(16);
    setAlignment('text-left');
    setTitleFont('font-sans');
    setBodyFont('font-sans');
    setLineHeight(1.6);
    setButtonColor('#2563eb');

    // Set task-specific background image and opacity
    setBgImage(activeTask.defaultBgImage || '');
    setBgImageOpacity(activeTask.defaultBgImageOpacity || 1);

    resetFeedback();
  }, [activeTaskId, activeTask.defaultBgImage, activeTask.defaultBgImageOpacity]);

  // --- NEW: Reset function ---
  const resetFeedback = () => {
    setAiFeedback('Pick a task, change the design, and click "Analyze" to get your score.');
    setScore(null);
    setScoreJustification('');
  }

  const getAIFeedback = async () => {
    setIsLoading(true);
    setScore(null);
    setScoreJustification('');
    setAiFeedback('Analyzing your design...');

    const apiKey = ''; // Leave as-is, will be populated by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const designState = {
      taskTitle: activeTask.title,
      clientBrief: activeTask.brief, // --- NEW ---
      pageBackground: bgColor,
      cardBackground: cardColor,
      titleColor: titleColor,
      bodyTextColor: bodyColor,
      titleFontSizePx: titleSize,
      bodyFontSizePx: bodySize,
      textAlignment: alignment,
      titleFont: titleFont,
      bodyFont: bodyFont,
      bodyLineHeight: lineHeight,
      buttonColor: buttonColor,
      cardBgImage: bgImage, // --- NEW ---
      cardBgImageOpacity: bgImageOpacity, // --- NEW ---
    };

    const systemPrompt = `You are a tough but fair AI Creative Director. A design student is submitting a ${designState.taskTitle} for review. Their brief is: "${designState.clientBrief}". Their design is provided as a JSON object.
    You MUST return a JSON object with three properties:
    1. "score": An integer from 0-100 based *strictly* on how well the design achieves the client brief (e.g., does "bold" have high contrast? Does "sophisticated" use elegant fonts?).
    2. "scoreJustification": A short, 1-sentence explanation for the score, tied directly to the brief.
    3. "feedback": A friendly, 2-sentence piece of actionable design advice to help them improve the score.`;

    const payload = {
      contents: [{ parts: [{ text: JSON.stringify(designState) }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      // --- NEW: JSON Response Schema ---
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            score: {
              type: 'INTEGER',
              description: 'A score from 0-100, 100 is best.',
            },
            scoreJustification: {
              type: 'STRING',
              description: 'A brief (1 sentence) explanation for the score.',
            },
            feedback: {
              type: 'STRING',
              description: 'Friendly, actionable design feedback (2 sentences).',
            },
          },
          required: ['score', 'scoreJustification', 'feedback'],
        },
      },
    };

    try {
      const result: any = await fetchWithBackoff(apiUrl, payload);
      
      if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const json = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(json);

        setScore(parsedJson.score);
        setScoreJustification(parsedJson.scoreJustification);
        setAiFeedback(parsedJson.feedback);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('Error fetching or parsing AI feedback:', error);
      setAiFeedback(
        "Sorry, I couldn't get feedback right now. Please try again."
      );
      setScore(null);
      setScoreJustification('');
    }

    setIsLoading(false);
  };

  // Helper for alignment controls
  const alignmentControls = [
    { name: 'Left', value: 'text-left', icon: AlignLeft },
    { name: 'Center', value: 'text-center', icon: AlignCenter },
    { name: 'Right', value: 'text-right', icon: AlignRight },
  ];

  // Helper for font controls
  const fontControls = [
    { name: 'Sans-Serif', value: 'font-sans' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Mono', value: 'font-mono' },
  ];

  return (
    <div className="p-6 sm:p-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition-all mb-4"
      >
        <ArrowLeft size={18} />
        Back to All Principles
      </button>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          AI Design Playground
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Select a client brief, design to the spec, and get your score!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* --- Column 1: The Canvas --- */}
        <div
          className="p-8 rounded-lg transition-all duration-300 flex items-center justify-center min-h-[500px]"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="relative w-full max-w-sm p-6 rounded-lg shadow-xl transition-all duration-300 overflow-hidden bg-cover bg-center"
            style={{
              backgroundColor: cardColor,
              // Fix: Cast string to a valid CSS property type for textAlign
              textAlign: alignment.replace('text-', '') as React.CSSProperties['textAlign'],
              backgroundImage: bgImage ? `url(${bgImage})` : 'none', // Apply background image
            }}
          >
            {/* Overlay for background image opacity */}
            {bgImage && (
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: cardColor, // Use card color as overlay color
                  opacity: bgImageOpacity,
                }}
              ></div>
            )}
            <div className="relative z-10"> {/* Ensure text is above overlay */}
              <h2
                className={`transition-all duration-300 ${titleFont}`}
                style={{
                  color: titleColor,
                  fontSize: `${titleSize}px`,
                  fontWeight: 'bold',
                }}
              >
                {activeTask.defaultTitle}
              </h2>
              <p
                className={`transition-all duration-300 ${bodyFont}`}
                style={{
                  color: bodyColor,
                  fontSize: `${bodySize}px`,
                  marginTop: '12px',
                  lineHeight: lineHeight,
                }}
              >
                {activeTask.defaultBody}
              </p>
              <button
                className="mt-6 px-5 py-2 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-all"
                style={{
                  backgroundColor: buttonColor,
                }}
              >
                {activeTask.defaultButton}
              </button>
            </div>
          </div>
        </div>

        {/* --- Column 2: The Controls --- */}
        <div className="flex flex-col gap-6">
          {/* --- NEW: Task Selector --- */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Client Briefs
            </label>
            <div className="flex flex-col gap-2">
              {playgroundTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    setActiveTaskId(task.id);
                  }}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    activeTaskId === task.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold">{task.title}</span>
                  <p className="text-sm">
                    {activeTaskId === task.id
                      ? `Brief: ${task.brief}`
                      : 'Select this brief'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Page BG
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Card BG
              </label>
              <input
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Title Text
              </label>
              <input
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Body Text
              </label>
              <input
                type="color"
                value={bodyColor}
                onChange={(e) => setBodyColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Button
              </label>
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="w-full h-10 rounded-lg"
              />
            </div>
          </div>

          {/* Background Image Controls (only for relevant tasks) */}
          {activeTask.id === 'event' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Background Image URL</span>
                </label>
                <input
                  type="text"
                  value={bgImage}
                  onChange={(e) => setBgImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Image Opacity</span>
                  <span>{(bgImageOpacity * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgImageOpacity}
                  onChange={(e) => setBgImageOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}


          {/* Typography */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Title Font
              </label>
              <div className="flex gap-3">
                {fontControls.map((font) => (
                  <ControlButton
                    key={font.value}
                    title={font.name}
                    onClick={() => setTitleFont(font.value)}
                    isActive={titleFont === font.value}
                    className="flex-col"
                  >
                    <span className={`text-lg ${font.value}`}>Aa</span>
                    <span className="text-xs">{font.name}</span>
                  </ControlButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Body Font
              </label>
              <div className="flex gap-3">
                {fontControls.map((font) => (
                  <ControlButton
                    key={font.value}
                    title={font.name}
                    onClick={() => setBodyFont(font.value)}
                    isActive={bodyFont === font.value}
                    className="flex-col"
                  >
                    <span className={`text-lg ${font.value}`}>Aa</span>
                    <span className="text-xs">{font.name}</span>
                  </ControlButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Title Size</span>
                <span>{titleSize}px</span>
              </label>
              <input
                type="range"
                min="16"
                max="48"
                step="1"
                value={titleSize}
                // Fix: Parse string value from input to number
                onChange={(e) => setTitleSize(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Body Size</span>
                <span>{bodySize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={bodySize}
                // Fix: Parse string value from input to number
                onChange={(e) => setBodySize(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Line Height</span>
                <span>{lineHeight}</span>
              </label>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={lineHeight}
                // Fix: Parse string value from input to number
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Alignment
            </label>
            <div className="flex gap-3">
              {alignmentControls.map((control) => (
                <ControlButton
                  key={control.value}
                  title={control.name}
                  onClick={() => setAlignment(control.value)}
                  isActive={alignment === control.value}
                >
                  <control.icon className="mx-auto" />
                  <span className="text-xs">{control.name}</span>
                </ControlButton>
              ))}
            </div>
          </div>

          {/* AI Button */}
          <button
            onClick={getAIFeedback}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Wand2 size={20} />
            )}
            {isLoading ? 'Analyzing...' : 'Submit for Review'}
          </button>
        </div>
      </div>

      {/* --- NEW: Feedback Area --- */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Creative Director's Feedback
        </h2>
        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-gray-500">SCORE</span>
              <span
                className={`text-6xl font-bold ${
                  score === null
                    ? 'text-gray-400'
                    : score >= 80
                    ? 'text-green-600'
                    : score >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {score === null ? '??' : score}
              </span>
              <span className="text-sm font-semibold text-gray-500">
                / 100
              </span>
            </div>
            <div className="flex-1">
              {scoreJustification && (
                <p className="text-gray-700 font-semibold italic">
                  "{scoreJustification}"
                </p>
              )}
              <p className="text-gray-700 mt-2">{aiFeedback}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component (Refactored for Navigation) ---
// The App component now only manages which page is active.
export default function App() {
  const [activePrincipleId, setActivePrincipleId] = useState<string | null>(null); // 'hierarchy', 'contrast', or null (home)

  const handleSelectPrinciple = (id: string) => {
    setActivePrincipleId(id);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setActivePrincipleId(null);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  const activePrinciple = activePrincipleId ? (principles as any)[activePrincipleId] : null;

  let content;
  if (activePrinciple) {
    content = (
      <PrinciplePage principle={activePrinciple} onBack={handleGoHome} />
    );
  } else if (activePrincipleId === 'playground') {
    content = <DesignPlaygroundPage onBack={handleGoHome} />;
  } else {
    // Default case, also handles activePrincipleId === null
    content = (
      <HomePage
        principles={Object.values(principles)}
        onSelect={handleSelectPrinciple}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-800 font-sans">
      <div className="w-full max-w-6xl mx-auto py-8 sm:py-12">
        <main className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-[80vh]">
          {content}
        </main>
      </div>
    </div>
  );
}