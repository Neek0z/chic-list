import { useState, useCallback } from 'react';
import { GroceryList, GroceryItem } from '@/types/grocery';

const STORAGE_KEY = 'grocery-lists';
const ACTIVE_KEY = 'grocery-active-list';

function loadLists(): GroceryList[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const defaultList: GroceryList = { id: crypto.randomUUID(), name: 'Ma Liste', items: [] };
  return [defaultList];
}

function saveLists(lists: GroceryList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function useGroceryList() {
  const [lists, setLists] = useState<GroceryList[]>(loadLists);
  const [activeListId, setActiveListId] = useState<string>(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const allLists = loadLists();
    if (saved && allLists.find(l => l.id === saved)) return saved;
    return allLists[0].id;
  });

  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  const items = activeList.items;

  const updateList = useCallback((listId: string, updater: (list: GroceryList) => GroceryList) => {
    setLists(prev => {
      const next = prev.map(l => l.id === listId ? updater(l) : l);
      saveLists(next);
      return next;
    });
  }, []);

  const addItem = useCallback((name: string, category: string, aisle?: number, quantity?: string) => {
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      aisle,
      quantity: quantity?.trim() || undefined,
      checked: false,
    };
    updateList(activeListId, l => ({ ...l, items: [newItem, ...l.items] }));
  }, [activeListId, updateList]);

  const editItem = useCallback((id: string, updates: Partial<Pick<GroceryItem, 'name' | 'category' | 'aisle' | 'quantity'>>) => {
    updateList(activeListId, l => ({
      ...l,
      items: l.items.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, [activeListId, updateList]);

  const toggleItem = useCallback((id: string) => {
    updateList(activeListId, l => ({
      ...l,
      items: l.items.map(item => item.id === id ? { ...item, checked: !item.checked } : item),
    }));
  }, [activeListId, updateList]);

  const removeChecked = useCallback(() => {
    updateList(activeListId, l => ({ ...l, items: l.items.filter(i => !i.checked) }));
  }, [activeListId, updateList]);

  const removeItem = useCallback((id: string) => {
    updateList(activeListId, l => ({ ...l, items: l.items.filter(i => i.id !== id) }));
  }, [activeListId, updateList]);

  const createList = useCallback((name: string) => {
    const newList: GroceryList = { id: crypto.randomUUID(), name, items: [] };
    setLists(prev => {
      const next = [...prev, newList];
      saveLists(next);
      return next;
    });
    setActiveListId(newList.id);
    localStorage.setItem(ACTIVE_KEY, newList.id);
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(l => l.id !== id);
      saveLists(next);
      if (activeListId === id) {
        setActiveListId(next[0].id);
        localStorage.setItem(ACTIVE_KEY, next[0].id);
      }
      return next;
    });
  }, [activeListId]);

  const renameList = useCallback((id: string, name: string) => {
    updateList(id, l => ({ ...l, name }));
  }, [updateList]);

  const switchList = useCallback((id: string) => {
    setActiveListId(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const uncheckedCount = items.filter(i => !i.checked).length;
  const checkedCount = items.filter(i => i.checked).length;

  return {
    lists, activeList, items,
    addItem, editItem, toggleItem, removeChecked, removeItem,
    createList, deleteList, renameList, switchList,
    uncheckedCount, checkedCount,
  };
}
