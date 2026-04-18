import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, LogOut, ShoppingCart, Sparkles, Search } from 'lucide-react';
import { useGroceryList } from '@/hooks/useGroceryList';
import { useDarkMode } from '@/hooks/useDarkMode';
import { CATEGORIES, DisplayMode, GroceryItem } from '@/types/grocery';
import AddItemForm from '@/components/AddItemForm';
import GroceryItemCard from '@/components/GroceryItemCard';
import ListSelector from '@/components/ListSelector';
import DisplayModeToggle from '@/components/DisplayModeToggle';
import DarkModeToggle from '@/components/DarkModeToggle';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';

function sortAlpha(a: GroceryItem, b: GroceryItem) {
  return a.name.localeCompare(b.name, 'fr');
}

const Index = () => {
  const {
    lists, activeList, items,
    addItem, editItem, toggleItem, removeChecked, removeItem,
    createList, leaveList, renameList, switchList, joinByShareCode,
    uncheckedCount, checkedCount,
  } = useGroceryList();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('category');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingMode, setShoppingMode] = useState(false);
  const { signOutUser } = useAuth();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleItems = normalizedQuery
    ? items.filter(i => i.name.toLowerCase().includes(normalizedQuery))
    : items;
  const displayItems = shoppingMode ? visibleItems.filter(i => !i.checked) : visibleItems;

  // Éviter le crash quand les listes ne sont pas encore chargées (Firestore)
  if (!activeList) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des listes…</p>
      </div>
    );
  }

  const renderGroups = () => {
    if (displayMode === 'category') {
      const grouped = CATEGORIES.map(cat => ({
        ...cat,
        items: displayItems.filter(i => i.category === cat.key).sort(sortAlpha),
      })).filter(g => g.items.length > 0);

      return grouped.map(group => (
        <div key={group.key}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {group.emoji} {group.label}
          </h2>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {group.items.map(item => (
                <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} onEdit={editItem} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ));
    }

    if (displayMode === 'aisle') {
      const aisleMap = new Map<number | 'none', GroceryItem[]>();
      displayItems.forEach(item => {
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
                <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} onEdit={editItem} />
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
          {[...displayItems].sort(sortAlpha).map(item => (
            <GroceryItemCard key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} onEdit={editItem} />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header (sticky pour rester visible au scroll) */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-background pb-2 -mx-4 px-4 pt-1 mb-2"
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
                  onLeave={leaveList}
                  onRename={renameList}
                  onJoin={joinByShareCode}
                />
                <p className="text-sm text-muted-foreground">
                  {uncheckedCount === 0
                    ? 'Tout est fait ! 🎉'
                    : `${uncheckedCount} article${uncheckedCount > 1 ? 's' : ''} restant${uncheckedCount > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NavLink
                to="/infos"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                activeClassName="bg-secondary text-foreground"
              >
                <Info className="w-4 h-4" />
              </NavLink>
              <DarkModeToggle dark={dark} onToggle={toggleDark} />
              <button
                type="button"
                onClick={signOutUser}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Progress bar + search */}
          {items.length > 0 && (
            <div className="mt-2 pb-1">
              <div className="mt-1 flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {checkedCount}/{items.length} complété{checkedCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(prev => {
                      const next = !prev;
                      if (!next) setSearchQuery('');
                      return next;
                    });
                  }}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] transition-colors ${
                    searchOpen
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:bg-secondary'
                  }`}
                  title="Rechercher dans la liste"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {searchOpen && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un article..."
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.header>

        {/* Mode course */}
        {items.length > 0 && (
          <div className="pb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShoppingMode(prev => !prev)}
              title="Mode course"
              className={`flex-shrink-0 flex items-center justify-center rounded-2xl px-3 py-3 transition-all ${
                shoppingMode
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Display mode */}
        {items.length > 0 && (
          <div className="mb-4 flex justify-center">
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
      </div>
      <div className="fixed right-5 z-40 bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] sm:right-6 sm:bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        <AddItemForm onAdd={addItem} prefillName={searchQuery} />
      </div>
    </div>
  );
};

export default Index;
