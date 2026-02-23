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

export function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
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
