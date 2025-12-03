import React from 'react';
import { UIComponent, ColorPalette, FontPairing } from '../types';
import * as LucideIcons from 'lucide-react';

// A helper to safely map string names from Gemini to Lucide components
const Icon: React.FC<{ name: string; [key: string]: any }> = ({ name, ...props }) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) {
        // Return a default icon or null if the name doesn't match
        console.warn(`Icon "${name}" not found in lucide-react.`);
        return <LucideIcons.HelpCircle {...props} />;
    }
    return <IconComponent {...props} />;
};

function isColorLight(hex: string): boolean {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return false;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128;
}

// Helper to apply component styles (Shadows, Glassmorphism, etc.)
const applyComponentStyle = (styleName: string | undefined, palette: ColorPalette['palette'], isPrimary: boolean): React.CSSProperties => {
    if (!styleName) return {};
    
    // Base border if not defined
    const baseBorder = { borderWidth: 1, borderColor: palette.border };

    switch (styleName) {
        case 'Glassmorphism':
            const glassBg = isColorLight(palette.bg) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 35, 50, 0.2)';
            const glassBorder = isColorLight(palette.bg) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            return {
                backgroundColor: isPrimary ? undefined : glassBg, // Keep primary color if it's a button
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${glassBorder}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            };
        case 'Neumorphism':
            const lightShadow = `color-mix(in srgb, ${palette.bg} 10%, white)`;
            const darkShadow = `color-mix(in srgb, ${palette.bg} 80%, black)`;
            // Neumorphism usually needs the element to be the same color as background to work well, 
            // but for surfaces we use cardBg.
            return {
                boxShadow: `5px 5px 10px ${darkShadow}, -5px -5px 10px ${lightShadow}`,
                border: 'none'
            };
        case 'Material Design':
            return {
                ...baseBorder,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            };
        case 'Flat Design':
        default:
            return {
                ...baseBorder,
                boxShadow: 'none'
            };
    }
};

interface ThemeOptions { 
    componentStyle?: string, 
    repetition?: string, 
    hierarchy?: string, 
    alignment?: string,
    spacing?: string,
    layoutStyle?: string 
}

// Applies the user's selected theme over the base styles from the AI
const getThemedStyle = (
    component: UIComponent, 
    palette: ColorPalette['palette'], 
    fonts: FontPairing,
    options: ThemeOptions
): React.CSSProperties => {
    const newStyle = { ...(component.style || {}) };
    const role = component.style?.semanticRole;

    // --- 1. Colors & Fonts (Basic Theme) ---
    if (role === 'primary') {
        newStyle.backgroundColor = palette.primary;
        newStyle.color = palette.primaryText;
        newStyle.borderColor = 'transparent';
    } else if (role === 'secondary') {
        newStyle.backgroundColor = palette.accent;
        newStyle.color = palette.primaryText;
        newStyle.borderColor = 'transparent';
    } else if (role === 'background') {
        newStyle.backgroundColor = palette.bg;
    } else if (role === 'surface') {
        newStyle.backgroundColor = palette.cardBg;
        newStyle.borderColor = palette.border;
    } else if (role === 'heading') {
        newStyle.color = palette.text;
        newStyle.fontFamily = fonts.titleFont;
    } else if (role === 'body') {
        newStyle.color = palette.secondaryText;
        newStyle.fontFamily = fonts.bodyFont;
    } else if (role === 'text') {
        newStyle.color = palette.text;
        newStyle.fontFamily = fonts.bodyFont;
    }

    if (typeof newStyle.fontWeight === 'number') {
        newStyle.fontWeight = newStyle.fontWeight.toString();
    }

    // --- 2. Repetition (Border Radius) ---
    if (options.repetition && (role === 'surface' || role === 'primary' || role === 'secondary' || role === 'text' || component.type === 'Image')) {
        if (options.repetition === 'Strict System') {
            newStyle.borderRadius = '12px';
        } else if (options.repetition === 'Thematic System') {
            newStyle.borderRadius = '8px';
        } else if (options.repetition === 'No System (Chaotic)') {
            newStyle.borderRadius = '0px'; 
        }
    }

    // --- 3. Component Style (Shadows, Glass, etc.) ---
    if (options.componentStyle && (role === 'surface' || role === 'primary')) {
        const isPrimary = role === 'primary';
        const compStyles = applyComponentStyle(options.componentStyle, palette, isPrimary);
        Object.assign(newStyle, compStyles);
    }

    // --- 4. Hierarchy (Font Scaling) ---
    if (options.hierarchy && role === 'heading') {
        if (options.hierarchy === 'Title-Focused') {
            newStyle.fontWeight = '800';
            // Scale up potentially if needed, but be careful with breaking layouts
        } else if (options.hierarchy === 'Subtle') {
            newStyle.fontWeight = '600';
        } else if (options.hierarchy === 'Inverted') {
             newStyle.fontWeight = '500';
             newStyle.textTransform = 'uppercase';
             newStyle.letterSpacing = '0.1em';
        }
    }

    // --- 5. Alignment ---
    if (options.alignment && (role === 'heading' || role === 'body' || role === 'text')) {
         const map: Record<string, any> = { 
             'Left-Aligned': 'left', 
             'Center-Aligned': 'center', 
             'Right-Aligned': 'right', 
             'Justified': 'justify' 
         };
         if (map[options.alignment]) {
             newStyle.textAlign = map[options.alignment];
         }
    }

    // --- 6. Spacing ---
    if (options.spacing) {
        const factor = options.spacing === 'Compact' ? 0.5 : options.spacing === 'Relaxed' ? 2 : 1;
        // Apply to gap if it exists
        if (newStyle.gap) {
            if (typeof newStyle.gap === 'string' && newStyle.gap.endsWith('px')) {
                const val = parseInt(newStyle.gap);
                newStyle.gap = `${val * factor}px`;
            } else if (typeof newStyle.gap === 'number') {
                newStyle.gap = newStyle.gap * factor;
            }
        }
        // Apply to padding if it exists
        if (newStyle.padding) {
             if (typeof newStyle.padding === 'string' && newStyle.padding.endsWith('px')) {
                const val = parseInt(newStyle.padding);
                newStyle.padding = `${val * factor}px`;
            } else if (typeof newStyle.padding === 'number') {
                newStyle.padding = newStyle.padding * factor;
            }
        }
    }
    
    // --- 7. Layout Style Override (Experimental) ---
    // If it's a container with multiple children and layout is "Card Grid", attempt grid
    if (options.layoutStyle === 'Card Grid (2-col)' && component.type === 'Container' && component.children && component.children.length > 2) {
        // Only apply if it looks like a list (flex-col)
        if (newStyle.flexDirection === 'column' || !newStyle.flexDirection) {
             // Check if it's not the main root container (which should usually be column)
             if (role !== 'background') {
                 newStyle.display = 'grid';
                 newStyle.gridTemplateColumns = '1fr 1fr';
                 newStyle.gap = options.spacing === 'Compact' ? '8px' : '16px';
                 // Reset flex props that might conflict
                 newStyle.flexDirection = undefined; 
             }
        }
    }

    // --- SAFETY OVERRIDES FOR LAYOUT STABILITY ---
    newStyle.maxWidth = '100%';
    newStyle.boxSizing = 'border-box';
    if (component.type === 'Image') {
        newStyle.maxWidth = '100%';
        newStyle.height = 'auto';
        newStyle.objectFit = 'cover';
    }

    return newStyle;
};

interface DynamicRendererProps {
    component: UIComponent;
    palette: ColorPalette['palette'];
    fonts: FontPairing;
    componentStyle?: string;
    repetition?: string;
    hierarchy?: string;
    alignment?: string;
    spacing?: string;
    layoutStyle?: string;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ 
    component, 
    palette, 
    fonts, 
    componentStyle, 
    repetition, 
    hierarchy, 
    alignment,
    spacing,
    layoutStyle
}) => {
    if (!component) {
        return null;
    }

    const { type, props, children } = component;
    const style = getThemedStyle(component, palette, fonts, { componentStyle, repetition, hierarchy, alignment, spacing, layoutStyle });

    const renderChildren = () =>
        children?.map((child, index) => (
            <DynamicRenderer 
                key={index} 
                component={child} 
                palette={palette} 
                fonts={fonts}
                componentStyle={componentStyle}
                repetition={repetition}
                hierarchy={hierarchy}
                alignment={alignment}
                spacing={spacing}
                layoutStyle={layoutStyle}
            />
        ));

    switch (type) {
        case 'Container':
            return <div style={style}>{renderChildren()}</div>;
        case 'Text':
            return <p style={style}>{props?.content}</p>;
        case 'Button':
            return <button style={style}>{props?.content}</button>;
        case 'Image':
            return <img src={props?.imageUrl} style={style} alt={props?.content || 'analyzed image'} />;
        case 'Icon':
            if (props?.iconName) {
                return <Icon name={props.iconName} style={style} />;
            }
            return null;
        default:
            console.warn(`Unknown component type: ${type}`);
            return <div style={style}>{renderChildren()}</div>;
    }
};

export default DynamicRenderer;