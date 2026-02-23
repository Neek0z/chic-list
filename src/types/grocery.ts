export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  aisle?: number;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
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
