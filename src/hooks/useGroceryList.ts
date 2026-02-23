import { useState, useCallback, useEffect } from 'react';
import { GroceryList, GroceryItem, generateShareCode } from '@/types/grocery';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

const ACTIVE_KEY = 'grocery-active-list';
const JOINED_KEY = 'grocery-joined-sharecodes';

const LISTS_COLLECTION = 'lists';

function ensureShareCode(list: GroceryList): GroceryList {
  if (!list.shareCode) return { ...list, shareCode: generateShareCode() };
  return list;
}

// Firestore document shape: use shareCode as document id for easy sharing
function listDocRef(shareCode: string) {
  return doc(collection(db, LISTS_COLLECTION), shareCode);
}

export function useGroceryList() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [joinedShareCodes, setJoinedShareCodes] = useState<string[]>([]);

  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  const items = activeList?.items ?? [];

  // Initialisation : charger les codes rejoints ou créer une liste par défaut.
  useEffect(() => {
    const savedJoined = localStorage.getItem(JOINED_KEY);
    if (!savedJoined) {
      const newList: GroceryList = {
        id: crypto.randomUUID(),
        shareCode: generateShareCode(),
        name: 'Ma Liste',
        items: [],
      };
      const ref = listDocRef(newList.shareCode);
      void setDoc(ref, newList);
      localStorage.setItem(JOINED_KEY, JSON.stringify([newList.shareCode]));
      localStorage.setItem(ACTIVE_KEY, newList.id);
      setJoinedShareCodes([newList.shareCode]);
      setLists([newList]);
      setActiveListId(newList.id);
      return;
    }

    const shareCodes: string[] = JSON.parse(savedJoined);
    if (shareCodes.length > 0) {
      setJoinedShareCodes(shareCodes);
    }
  }, []);

  // Abonnements en temps réel aux listes correspondantes aux codes rejoints.
  useEffect(() => {
    if (!joinedShareCodes.length) return;

    const unsubscribers = joinedShareCodes.map(code => {
      const ref = listDocRef(code);
      return onSnapshot(ref, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GroceryList;
          const withShareCode = ensureShareCode({
            ...data,
            id: data.id || crypto.randomUUID(),
          });
          setLists(prev => {
            const idx = prev.findIndex(l => l.shareCode === code);
            if (idx === -1) return [...prev, withShareCode];
            const next = [...prev];
            next[idx] = withShareCode;
            return next;
          });
        }
      });
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [joinedShareCodes]);

  // Restore active list id from localStorage once lists are available
  useEffect(() => {
    if (!lists.length) return;
    setActiveListId(prev => {
      if (prev && lists.find(l => l.id === prev)) return prev;
      const saved = localStorage.getItem(ACTIVE_KEY);
      if (saved && lists.find(l => l.id === saved)) return saved;
      return lists[0].id;
    });
  }, [lists]);

  const persistJoined = useCallback((codes: string[]) => {
    localStorage.setItem(JOINED_KEY, JSON.stringify(codes));
  }, []);

  const updateList = useCallback(
    (listId: string, updater: (list: GroceryList) => GroceryList) => {
      setLists(prev => {
        const next = prev.map(l => (l.id === listId ? updater(l) : l));
        const updated = next.find(l => l.id === listId);
        if (updated) {
          const ref = listDocRef(updated.shareCode);
          void setDoc(ref, updated, { merge: false });
        }
        return next;
      });
    },
    [],
  );

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
    const newList: GroceryList = {
      id: crypto.randomUUID(),
      shareCode: generateShareCode(),
      name,
      items: [],
    };
    const ref = listDocRef(newList.shareCode);
    void setDoc(ref, newList);
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    localStorage.setItem(ACTIVE_KEY, newList.id);
    setJoinedShareCodes(prev => {
      if (prev.includes(newList.shareCode)) return prev;
      const next = [...prev, newList.shareCode];
      persistJoined(next);
      return next;
    });
  }, [persistJoined]);

  const joinByShareCode = useCallback(
    (code: string, serverList?: GroceryList) => {
      const normalizedCode = code.toUpperCase();
      setJoinedShareCodes(prev => {
        if (prev.includes(normalizedCode)) return prev;
        const next = [...prev, normalizedCode];
        persistJoined(next);
        return next;
      });

      if (serverList) {
        const withShare = ensureShareCode({
          ...serverList,
          shareCode: serverList.shareCode || normalizedCode,
          id: serverList.id || crypto.randomUUID(),
        });
        setLists(prev => {
          if (prev.find(l => l.shareCode === withShare.shareCode)) return prev;
          return [...prev, withShare];
        });
      }
    },
    [persistJoined],
  );

  const leaveList = useCallback((id: string) => {
    setLists(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(l => l.id !== id);
      if (activeListId === id) {
        setActiveListId(next[0].id);
        localStorage.setItem(ACTIVE_KEY, next[0].id);
      }
      const list = prev.find(l => l.id === id);
      if (list) {
        setJoinedShareCodes(codes => {
          const nextCodes = codes.filter(code => code !== list.shareCode);
          persistJoined(nextCodes);
          return nextCodes;
        });
      }
      return next;
    });
  }, [activeListId, persistJoined]);

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
    createList, leaveList, renameList, switchList,
    joinByShareCode,
    uncheckedCount, checkedCount,
  };
}
