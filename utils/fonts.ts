// A curated list of popular Google Fonts for the search functionality.
// In a real-world scenario, this might be fetched from an API.
export const GOOGLE_FONTS_LIST = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro",
  "Slabo 27px", "Raleway", "PT Sans", "Merriweather", "Noto Sans", "Poppins",
  "Ubuntu", "Playfair Display", "Lora", "Inter", "Nunito", "Rubik", "Work Sans",
  "Fira Sans", "Quicksand", "Karla", "Josefin Sans", "Arvo", "Hind", "Cabin",
  "Lobster", "Bebas Neue", "Comfortaa", "Exo 2", "Pacifico", "Anton", "Caveat",
  "Righteous", "Permanent Marker", "Dancing Script", "Shadows Into Light"
].sort();


/**
 * Dynamically loads a Google Font into the document by adding a <link> tag.
 * It creates a unique ID for the link tag based on the font name to avoid duplicates.
 * @param {string} fontName - The name of the Google Font to load (e.g., "Roboto").
 */
export const loadGoogleFont = (fontName: string) => {
  if (!fontName) return;

  const fontId = `google-font-${fontName.replace(/\s/g, '-')}`;
  
  if (document.getElementById(fontId)) {
    // Font is already loaded or is being loaded.
    return;
  }

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  const formattedFontName = fontName.replace(/\s/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@400;700&display=swap`;
  
  document.head.appendChild(link);
};
