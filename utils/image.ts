
export async function urlToBase64(url: string): Promise<{ base64: string, mimeType: string }> {
  // Use a proxy to avoid CORS issues with picsum.photos if needed in some environments
  const proxiedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  
  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
     console.warn("CORS proxy might be needed. Trying direct fetch.");
     // Fallback to direct fetch
     const response = await fetch(url);
     if (!response.ok) {
         throw new Error(`Direct fetch failed: ${response.statusText}`);
     }
     const blob = await response.blob();
     const mimeType = blob.type;
     return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
