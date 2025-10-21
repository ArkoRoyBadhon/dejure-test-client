// Utility to load and register a Bangla TTF font into jsPDF at runtime.
// Place the TTF at: public/fonts/NotoSansBengali-Regular.ttf
// If you use a different font, update the `fontPath` variable.

let cachedFontName = null;
let cachedFontAdded = false;

export const addBanglaFont = async (doc) => {
  if (cachedFontAdded) return cachedFontName;

  const fontPath = "/fonts/NotoSansBengali-Regular.ttf"; // Update if using a different font
  try {
    const response = await fetch(fontPath);
    if (!response.ok) throw new Error("Failed to load font file");

    const fontBuffer = await response.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(fontBuffer);

    const fontName = "BanglaFont";
    doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
    doc.addFont(`${fontName}.ttf`, fontName, "normal");

    cachedFontName = fontName;
    cachedFontAdded = true;
    return fontName;
  } catch (error) {
    console.error("Error loading Bangla font:", error);
    return "helvetica"; // Fallback to Helvetica
  }
};

// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Utility functions for Bangla number and date conversion
export const convertToBanglaNumber = (number) => {
  if (number === null || number === undefined || number === "") return "";

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = String(number);
  for (let i = 0; i < englishDigits.length; i++) {
    result = result.replace(new RegExp(englishDigits[i], "g"), banglaDigits[i]);
  }

  return result;
};

export const formatDateToBangla = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const banglaMonths = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];

    const day = convertToBanglaNumber(date.getDate());
    const month = banglaMonths[date.getMonth()];
    const year = convertToBanglaNumber(date.getFullYear());

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if error
  }
};
