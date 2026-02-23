import { useState, useCallback, useEffect } from 'react';
import { GroceryList, GroceryItem, generateShareCode, isValidShareCode } from '@/types/grocery';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

const ACTIVE_KEY = 'grocery-active-list';

const LISTS_COLLECTION = 'lists';

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-expect-error older libs may not know randomUUID
    return crypto.randomUUID() as string;
  }
  return Math.random().toString(36).slice(2);
}

function ensureShareCode(list: GroceryList): GroceryList {
  if (!list.shareCode) return { ...list, shareCode: generateShareCode() };
  return list;
}

// Firestore document shape: use shareCode as document id for easy sharing
function listDocRef(shareCode: string) {
  return doc(collection(db, LISTS_COLLECTION), shareCode);
}

/** Première lettre en majuscule, le reste en minuscules (ex: "LAIT" → "Lait"). */
function capitalizeFirst(str: string): string {
  const s = str.trim();
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

/** Retire récursivement les champs undefined pour éviter l'erreur Firestore "Unsupported field value: undefined". */
function stripUndefined<T>(value: T): T {
  if (value === undefined) return value;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(item => stripUndefined(item)) as T;
  }
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[k] = stripUndefined(v);
  }
  return out as T;
}

export function useGroceryList() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [joinedShareCodes, setJoinedShareCodes] = useState<string[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;

  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  const items = activeList?.items ?? [];

  // Initialisation : écouter les listes de l'utilisateur connecté ou créer une liste par défaut.
  useEffect(() => {
    if (!userId) return;

    const userListsCol = collection(db, 'users', userId, 'lists');

    const unsubscribe = onSnapshot(
      userListsCol,
      (snapshot) => {
        if (snapshot.empty) {
          const newList: GroceryList = {
            id: createId(),
            shareCode: generateShareCode(),
            name: 'Ma Liste',
            items: [],
          };
          // Mettre à jour l'UI tout de suite pour ne pas rester sur "Chargement des listes"
          setJoinedShareCodes([newList.shareCode]);
          setLists([newList]);
          setActiveListId(newList.id);
          localStorage.setItem(ACTIVE_KEY, newList.id);
          // Écriture Firestore en arrière-plan (si les règles le permettent)
          const listRef = listDocRef(newList.shareCode);
          const membershipRef = doc(userListsCol, newList.shareCode);
          setDoc(listRef, stripUndefined(newList))
            .then(() => setDoc(membershipRef, stripUndefined({ shareCode: newList.shareCode, name: newList.name })))
            .catch(() => {});
          return;
        }

        const shareCodes = snapshot.docs
          .map(d => (d.data().shareCode as string | undefined) ?? d.id)
          .filter(Boolean);
        setJoinedShareCodes(shareCodes as string[]);
      },
      (err) => {
        // Si la lecture échoue (ex. règles Firestore), afficher quand même une liste par défaut
        const newList: GroceryList = {
          id: createId(),
          shareCode: generateShareCode(),
          name: 'Ma Liste',
          items: [],
        };
        setJoinedShareCodes([newList.shareCode]);
        setLists([newList]);
        setActiveListId(newList.id);
        localStorage.setItem(ACTIVE_KEY, newList.id);
      }
    );

    return () => unsubscribe();
  }, [userId]);

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
            id: data.id || createId(),
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

  const updateList = useCallback(
    (listId: string, updater: (list: GroceryList) => GroceryList) => {
      setLists(prev => {
        const next = prev.map(l => (l.id === listId ? updater(l) : l));
        const updated = next.find(l => l.id === listId);
        if (updated) {
          const ref = listDocRef(updated.shareCode);
          void setDoc(ref, stripUndefined(updated), { merge: false });
        }
        return next;
      });
    },
    [],
  );

  const addItem = useCallback((name: string, category: string, aisle?: number, quantity?: string) => {
    const newItem: GroceryItem = {
      id: createId(),
      name: capitalizeFirst(name),
      category,
      aisle,
      quantity: quantity?.trim() || undefined,
      checked: false,
    };
    updateList(activeListId, l => ({ ...l, items: [newItem, ...l.items] }));
  }, [activeListId, updateList]);

  const editItem = useCallback((id: string, updates: Partial<Pick<GroceryItem, 'name' | 'category' | 'aisle' | 'quantity'>>) => {
    const normalized = { ...updates };
    if (updates.name !== undefined) normalized.name = capitalizeFirst(updates.name);
    updateList(activeListId, l => ({
      ...l,
      items: l.items.map(item => item.id === id ? { ...item, ...normalized } : item),
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
    if (!userId) return;

    const newList: GroceryList = {
      id: createId(),
      shareCode: generateShareCode(),
      name,
      items: [],
    };
    const ref = listDocRef(newList.shareCode);
    void setDoc(ref, stripUndefined(newList));
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    localStorage.setItem(ACTIVE_KEY, newList.id);
    const membershipRef = doc(db, 'users', userId, 'lists', newList.shareCode);
    void setDoc(membershipRef, stripUndefined({
      shareCode: newList.shareCode,
      name: newList.name,
    }));
  }, [userId]);

  const joinByShareCode = useCallback(
    (code: string, serverList?: GroceryList) => {
      if (!userId) return;
      if (!isValidShareCode(code)) return;

      const normalizedCode = code.trim().toUpperCase();
      const membershipRef = doc(db, 'users', userId, 'lists', normalizedCode);
      void setDoc(membershipRef, stripUndefined({
        shareCode: normalizedCode,
        name: serverList?.name ?? '',
      }), { merge: true });

      if (serverList) {
        const withShare = ensureShareCode({
          ...serverList,
          shareCode: serverList.shareCode || normalizedCode,
          id: serverList.id || createId(),
        });
        setLists(prev => {
          if (prev.find(l => l.shareCode === withShare.shareCode)) return prev;
          return [...prev, withShare];
        });
      }
    },
    [db, userId],
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
        if (userId) {
          const membershipRef = doc(db, 'users', userId, 'lists', list.shareCode);
          void deleteDoc(membershipRef);
        }
      }
      return next;
    });
  }, [activeListId, userId]);

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
