import { useState, useCallback } from 'react';
import { GroceryItem } from '@/types/grocery';

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('grocery-items');
    return saved ? JSON.parse(saved) : [];
  });

  const save = (newItems: GroceryItem[]) => {
    setItems(newItems);
    localStorage.setItem('grocery-items', JSON.stringify(newItems));
  };

  const addItem = useCallback((name: string, category: string) => {
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      checked: false,
    };
    save([newItem, ...items]);
  }, [items]);

  const toggleItem = useCallback((id: string) => {
    save(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  }, [items]);

  const removeChecked = useCallback(() => {
    save(items.filter(item => !item.checked));
  }, [items]);

  const removeItem = useCallback((id: string) => {
    save(items.filter(item => item.id !== id));
  }, [items]);

  const uncheckedCount = items.filter(i => !i.checked).length;
  const checkedCount = items.filter(i => i.checked).length;

  return { items, addItem, toggleItem, removeChecked, removeItem, uncheckedCount, checkedCount };
}
