
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { DesignChoices, AIFeedback, UIComponent, TargetAudience } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getDesignFeedback = async (
    scenario: string, 
    choices: DesignChoices, 
    customPrimaryColor?: string,
    audience?: TargetAudience
): Promise<AIFeedback> => {
    const model = 'gemini-2.5-flash';

    const colorPaletteChoice = choices.colorPalette === 'Custom' 
      ? `Custom color (${customPrimaryColor})` 
      : `'${choices.colorPalette}'`;

    let audienceContext = '';
    if (audience && (audience.age || audience.job || audience.lifestyle)) {
        audienceContext = `
        SPECIFIC TARGET AUDIENCE PROFILE:
        - Demographics: ${audience.age || 'N/A'}, ${audience.gender || 'N/A'}, ${audience.job || 'N/A'}, Income: ${audience.income || 'N/A'}
        - Lifestyle: ${audience.lifestyle || 'N/A'}
        - Buying Habits: ${audience.buyingHabits || 'N/A'}
        - Goals: ${audience.goals || 'N/A'}

        CRITICAL INSTRUCTION: You must strictly evaluate the design choices against this specific audience. 
        Does the aesthetic match their income level? Is the usability appropriate for their age? Does the vibe match their lifestyle?
        `;
    }

    const prompt = `As a world-class UI/UX design mentor, provide constructive feedback on the following design choices for a '${scenario}'.
    
    ${audienceContext}

    Chosen Design Choices:
    - Layout Style: '${choices.layoutStyle}'
    - Component Style: '${choices.componentStyle}'
    - Color Palette: ${colorPaletteChoice}
    - Font Pairing: '${choices.fontPairing}'
    - Hierarchy: '${choices.hierarchy}'
    - Contrast: '${choices.contrast}'
    - Repetition & Unity: '${choices.repetition}'
    - Alignment: '${choices.alignment}'
    - Spacing: '${choices.spacing}'

    Analyze the combination of these choices for this specific app scenario${audience ? ' AND the specific target audience provided above' : ''}.
    
    Your response MUST be a valid JSON object with the following structure:
    {
      "score": number, // An integer score from 0 to 100 based on how well the choices fit the scenario and follow design principles.
      "overallAssessment": string, // A 1-2 sentence overall assessment of the design.
      "feedbackPoints": string[] // An array of 2-3 short, actionable feedback points in bullet-list format.
    }

    Base the score on coherence, usability, and appropriateness for the target audience. The feedback should be encouraging and helpful.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        overallAssessment: { type: Type.STRING },
                        feedbackPoints: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ['score', 'overallAssessment', 'feedbackPoints'],
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating design feedback:", error);
        throw new Error("Failed to get design feedback.");
    }
};

export const analyzeMockup = async (base64: string, mimeType: string): Promise<UIComponent> => {
    // Switch to flash for stability with vision
    const model = 'gemini-2.5-flash'; 
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64,
      },
    };
    
    const prompt = `You are an expert Frontend Engineer and UI/UX Designer running in "Build Mode". 
    Analyze this UI mockup image and reverse-engineer it into a hierarchical structure of React-like components.

    Your Goal: Create a fully populated, scrollable layout structure that perfectly mirrors the image but is RESPONSIVE to a mobile phone screen width.

    output JSON matching this TypeScript interface:
    
    interface UIComponent {
      type: 'Container' | 'Text' | 'Button' | 'Image' | 'Icon';
      props?: {
        content?: string; // For Text or Button labels
        iconName?: string; // Lucide icon name (e.g., 'Home', 'Menu', 'ChevronRight', 'User')
        imageUrl?: string; // For Image type
      };
      style: {
        semanticRole?: 'primary' | 'secondary' | 'background' | 'surface' | 'text' | 'heading' | 'body';
        [key: string]: string | number | undefined; // Standard React CSS properties (camelCase)
      };
      children?: UIComponent[];
    }

    CRITICAL RULES:
    1. **Root Element**: The top-level component MUST be a 'Container' with \`style: { width: '100%', minHeight: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', semanticRole: 'background' }\`.
    2. **Responsiveness**: 
       - NEVER use fixed widths greater than 300px. Use percentages (e.g. '100%', '50%') or flexbox/grid for layout.
       - If you see a row of items, use \`display: 'flex'\` with \`flexWrap: 'wrap'\` to prevent horizontal overflow.
    3. **Structure**: 
       - Identify major sections: Header, Hero, Content List/Grid, Bottom Navigation.
       - Use 'Container' for these sections.
    4. **Colors**: Do NOT hardcode hex colors. Use \`semanticRole\` so the theme engine can colorize it.
       - 'background': Main screen background.
       - 'surface': Cards, nav bars, headers.
       - 'primary': Call-to-action buttons, active icons.
       - 'text': General text.
       - 'heading': Large titles.
       - 'body': Descriptions.
    5. **Images**: 
       - **NEVER** return empty strings or local paths for \`imageUrl\`.
       - **ALWAYS** use a working Picsum placeholder for images: \`https://picsum.photos/seed/{random_string}/400/300\`. Change the seed and size to match aspect ratio.
    6. **Icons**: Use valid Lucide React icon names (e.g., 'Menu', 'Search', 'Home', 'Settings').
    7. **Content**: Populate ALL text visible in the screenshot. Do not summarize.

    Return ONLY the raw JSON object. Do not include markdown formatting.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [
              {text: prompt},
              imagePart
            ]},
            config: {
                responseMimeType: "application/json",
                // Removing strict responseSchema to allow deep recursion without complex definition constraints
            },
        });
        
        let jsonText = response.text.trim();
        // Clean markdown if present (sometimes Gemini adds ```json ... ``` despite instructions)
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonText.startsWith('```')) {
             jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error analyzing mockup:", error);
        throw new Error("Failed to analyze mockup.");
    }
};


export const getVibeCheckFeedback = async (base64: string, mimeType: string, userInput: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64,
      },
    };
    const textPart = {
      text: `Analyze the provided UI screenshot based on the user's description. User's description: "${userInput}". Provide constructive feedback on whether the user's "vibe check" is accurate. Explain the design principles (color theory, typography, layout) that support your analysis. Keep the feedback concise and encouraging, in 2-3 sentences.`
    };
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating vibe check feedback:", error);
        throw new Error("Failed to get vibe check feedback.");
    }
};

export const getColorVibeFeedback = async (colors: string[], keywords: string[], userInput: string): Promise<{ feedback: string; isCorrect: boolean }> => {
    const model = 'gemini-2.5-flash';
    const prompt = `A user is analyzing a color palette.
    - Palette (hex codes): ${colors.join(', ')}
    - Target keywords for this palette: ${keywords.join(', ')}
    - User's description: "${userInput}"

    Analyze if the user's description aligns with the target keywords and the principles of color theory.
    Respond with a JSON object with two keys:
    1. "isCorrect" (boolean): true if the user's description is generally accurate, false otherwise.
    2. "feedback" (string): A short, one-to-two sentence explanation for your decision, providing constructive feedback.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                    },
                    required: ['isCorrect', 'feedback'],
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating color vibe feedback:", error);
        throw new Error("Failed to get color vibe feedback.");
    }
};

export const getTypographyFeedback = async (correctAnswer: string, explanationPrompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Explain why "${correctAnswer}" is the correct answer for the following typography challenge.
    Challenge context: ${explanationPrompt}
    Provide a concise, helpful explanation in markdown format. Focus on the core design principle.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating typography feedback:", error);
        throw new Error("Failed to get typography feedback.");
    }
};
