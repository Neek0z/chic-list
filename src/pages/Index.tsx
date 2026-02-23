import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import { useGroceryList } from '@/hooks/useGroceryList';
import { useDarkMode } from '@/hooks/useDarkMode';
import { CATEGORIES, DisplayMode, GroceryItem } from '@/types/grocery';
import AddItemForm from '@/components/AddItemForm';
import GroceryItemCard from '@/components/GroceryItemCard';
import ListSelector from '@/components/ListSelector';
import DisplayModeToggle from '@/components/DisplayModeToggle';
import DarkModeToggle from '@/components/DarkModeToggle';

function sortAlpha(a: GroceryItem, b: GroceryItem) {
  return a.name.localeCompare(b.name, 'fr');
}

const Index = () => {
  const {
    lists, activeList, items,
    addItem, toggleItem, removeChecked, removeItem,
    createList, deleteList, renameList, switchList,
    uncheckedCount, checkedCount,
  } = useGroceryList();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('category');

  const uncheckedItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  const renderGroups = () => {
    if (displayMode === 'category') {
      const grouped = CATEGORIES.map(cat => ({
        ...cat,
        items: uncheckedItems.filter(i => i.category === cat.key).sort(sortAlpha),
      })).filter(g => g.items.length > 0);

      return grouped.map(group => (
        <div key={group.key}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {group.emoji} {group.label}
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {group.items.map(item => (
                <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ));
    }

    if (displayMode === 'aisle') {
      const aisleMap = new Map<number | 'none', GroceryItem[]>();
      uncheckedItems.forEach(item => {
        const key = item.aisle ?? 'none';
        if (!aisleMap.has(key)) aisleMap.set(key, []);
        aisleMap.get(key)!.push(item);
      });
      const entries = Array.from(aisleMap.entries()).sort((a, b) => {
        if (a[0] === 'none') return 1;
        if (b[0] === 'none') return -1;
        return (a[0] as number) - (b[0] as number);
      });

      return entries.map(([aisle, aisleItems]) => (
        <div key={String(aisle)}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {aisle === 'none' ? '📦 Sans rayon' : `🛒 Rayon ${aisle}`}
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {aisleItems.sort(sortAlpha).map(item => (
                <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ));
    }

    // all
    return (
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {uncheckedItems.sort(sortAlpha).map(item => (
            <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <ListSelector
                  lists={lists}
                  activeList={activeList}
                  onSwitch={switchList}
                  onCreate={createList}
                  onDelete={deleteList}
                  onRename={renameList}
                />
                <p className="text-sm text-muted-foreground">
                  {uncheckedCount === 0
                    ? 'Tout est fait ! 🎉'
                    : `${uncheckedCount} article${uncheckedCount > 1 ? 's' : ''} restant${uncheckedCount > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <DarkModeToggle dark={dark} onToggle={toggleDark} />
          </div>
        </motion.header>

        {/* Add Item */}
        <AddItemForm onAdd={addItem} />

        {/* Display mode */}
        {uncheckedItems.length > 0 && (
          <div className="mb-4">
            <DisplayModeToggle mode={displayMode} onChange={setDisplayMode} />
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Liste vide</p>
            <p className="text-muted-foreground text-sm">Ajoutez vos premiers articles !</p>
          </motion.div>
        )}

        {/* Items */}
        <div className="space-y-6">
          {renderGroups()}
        </div>

        {/* Checked Items */}
        {checkedItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                ✅ Terminés ({checkedCount})
              </h2>
              <button
                onClick={removeChecked}
                className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Tout supprimer
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {checkedItems.sort(sortAlpha).map(item => (
                  <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
