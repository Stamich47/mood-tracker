import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_NOTES_ENCRYPTION_KEY ||
  "default-secret-key-change-me";

export const encryptNote = (note: string): string => {
  if (!note) return "";
  try {
    return CryptoJS.AES.encrypt(note, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return note;
  }
};

export const decryptNote = (cipherText: string): string => {
  if (!cipherText) return "";
  // If it doesn't look like a cipher text (e.g. old plain text notes), return as is
  if (
    !cipherText.includes("/") &&
    !cipherText.includes("+") &&
    cipherText.length < 20
  ) {
    return cipherText;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // If decryption fails (e.g. wrong key or not encrypted), it returns empty string
    if (!originalText && cipherText) {
      return cipherText; // Return original if it seems like it wasn't encrypted
    }

    return originalText;
  } catch {
    // If it fails, it might be an old plain text note
    return cipherText;
  }
};

export const encryptArray = (items: string[]): string[] => {
  if (!items || items.length === 0) return [];
  return items.map((item) => encryptNote(item));
};

export const decryptArray = (items: string[]): string[] => {
  if (!items || items.length === 0) return [];
  return items.map((item) => decryptNote(item));
};
