import React from 'react';

export enum ChallengeType {
  DESIGN = 'DESIGN',
  // FIX: Add missing challenge types
  VIBE_CHECK = 'VIBE_CHECK',
  COLOR_VIBE = 'COLOR_VIBE',
  TYPOGRAPHY = 'TYPOGRAPHY',
}

export interface DesignChallengeData {
  id: number;
  type: ChallengeType.DESIGN;
  title: string;
  scenario: string;
  requirements: string[];
}

// FIX: Add missing challenge data interface
export interface VibeCheckChallengeData {
  id:number;
  type: ChallengeType.VIBE_CHECK;
  title: string;
  imageUrl: string;
  prompt: string;
}

// FIX: Add missing challenge data interface
export interface ColorVibeChallengeData {
  id: number;
  type: ChallengeType.COLOR_VIBE;
  title: string;
  colors: string[];
  keywords: string[];
  prompt: string;
}

// FIX: Add missing challenge data interface
export interface TypographyChallengeData {
  id: number;
  type: ChallengeType.TYPOGRAPHY;
  title: string;
  imageUrl: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanationPrompt: string;
}

// FIX: Update union type to include all challenge data types
export type ChallengeData = DesignChallengeData | VibeCheckChallengeData | ColorVibeChallengeData | TypographyChallengeData;

// New types for structured design choices
export interface DesignOption {
  name: string;
  description: string;
}

export interface DesignChoices {
  layoutStyle: string;
  componentStyle: string;
  hierarchy: string;
  contrast: string;
  alignment: string;
  repetition: string;
  colorPalette: string;
  fontPairing: string;
  spacing: string;
}

export interface TargetAudience {
  gender: string;
  age: string;
  job: string;
  income: string;
  lifestyle: string;
  buyingHabits: string;
  goals: string;
}

export interface CustomPaletteColors {
    primary: string;
    accent: string;
    bg: string;
    cardBg: string;
    text: string;
}

export interface SavedDesign {
  id: string;
  challengeId: number;
  name: string;
  timestamp: number;
  choices: DesignChoices;
  customPaletteColors?: CustomPaletteColors; // UPDATED: Replaced single string with full object
  customFontPairing?: { title: string | null, body: string | null };
  targetAudience?: TargetAudience; // Added to saved design
}

export interface ColorPalette {
  name: string;
  palette: {
    bg: string;
    cardBg: string;
    primary: string;
    text: string;
    secondaryText: string;
    accent: string;
    border: string;
    primaryText: string;
  }
}

export interface FontPairing {
  name: string;
  titleFont: string;
  bodyFont: string;
  description: string;
}

export interface AIFeedback {
  score: number;
  overallAssessment: string;
  feedbackPoints: string[];
}

// Type for AI-analyzed UI components from a mockup
export interface UIComponent {
  type: 'Container' | 'Text' | 'Button' | 'Image' | 'Icon';
  props?: {
    content?: string;
    iconName?: string;
    imageUrl?: string;
  };
  style: React.CSSProperties & {
    semanticRole?: 'primary' | 'secondary' | 'background' | 'surface' | 'text' | 'heading' | 'body';
  };
  children?: UIComponent[];
}