// This file assumes html2canvas is loaded globally from index.html
declare const html2canvas: any;

export const exportComponentAsPNG = (element: HTMLElement) => {
  if (typeof html2canvas === 'undefined') {
    console.error('html2canvas is not loaded. Make sure the script is in index.html.');
    alert('Could not export image. The required library is missing.');
    return;
  }

  // Temporarily remove scrollbar for capture
  element.classList.add('no-scrollbar');

  html2canvas(element, {
    backgroundColor: null, // Use transparent background for the canvas
    useCORS: true, // Important for external images like from picsum.photos
    logging: false,
    onclone: (clonedDoc) => {
        // Find the scrollable element inside the cloned document and set its scroll position to the top
        const scrollable = clonedDoc.querySelector('.overflow-y-auto');
        if (scrollable) {
            scrollable.scrollTop = 0;
        }
    }
  }).then((canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = 'design-it-right-preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch((err: any) => {
    console.error("Failed to export component as PNG", err);
    alert('An error occurred while exporting the image.');
  }).finally(() => {
    // Re-add scrollbar after capture
    element.classList.remove('no-scrollbar');
  });
};