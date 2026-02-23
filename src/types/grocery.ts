export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  aisle?: number;
  quantity?: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  shareCode: string;
  name: string;
  items: GroceryItem[];
}

const SHARE_CODE_LENGTH = 6;
const SHARE_CODE_REGEX = /^[A-Z0-9]{6}$/;

export function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < SHARE_CODE_LENGTH; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/** Valide un code de partage (6 caractères A-Z, 2-9) pour éviter l’usage de doc IDs arbitraires. */
export function isValidShareCode(code: string): boolean {
  return typeof code === 'string' && SHARE_CODE_REGEX.test(code.trim().toUpperCase());
}

export type DisplayMode = 'category' | 'aisle' | 'all';

export interface Category {
  key: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { key: 'fruits', label: 'Fruits', emoji: '🍎' },
  { key: 'legumes', label: 'Légumes', emoji: '🥦' },
  { key: 'viandes', label: 'Viandes', emoji: '🥩' },
  { key: 'laitiers', label: 'Produits laitiers', emoji: '🧀' },
  { key: 'epicerie', label: 'Épicerie', emoji: '🍝' },
  { key: 'boissons', label: 'Boissons', emoji: '🥤' },
  { key: 'hygiene', label: 'Hygiène', emoji: '🧴' },
  { key: 'autre', label: 'Autre', emoji: '📦' },
];
