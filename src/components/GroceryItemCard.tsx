import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Pencil, Check, X, EllipsisVertical } from 'lucide-react';
import { GroceryItem, CATEGORIES } from '@/types/grocery';

interface GroceryItemCardProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, updates: Partial<Pick<GroceryItem, 'name' | 'category' | 'aisle' | 'quantity'>>) => void;
}

export default function GroceryItemCard({ item, onToggle, onRemove, onEdit }: GroceryItemCardProps) {
  const cat = CATEGORIES.find(c => c.key === item.category);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editAisle, setEditAisle] = useState(item.aisle?.toString() ?? '');
  const [editQuantity, setEditQuantity] = useState(item.quantity ?? '');

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleSave = () => {
    if (!editName.trim()) return;
    onEdit(item.id, {
      name: editName.trim(),
      category: editCategory,
      aisle: editAisle ? parseInt(editAisle) : undefined,
      quantity: editQuantity.trim() || undefined,
    });
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -80, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 ${
        item.checked ? 'opacity-50' : ''
      }`}
    >
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 space-y-2.5"
          >
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <div className="flex gap-1.5">
              <input
                value={editQuantity}
                onChange={e => setEditQuantity(e.target.value)}
                placeholder="Quantité"
              className="flex-1 bg-secondary text-xs text-secondary-foreground rounded-lg px-2.5 py-1 outline-none placeholder:text-muted-foreground"
              />
              <input
                type="number"
                value={editAisle}
                onChange={e => setEditAisle(e.target.value)}
                placeholder="Rayon"
                min={1}
              className="w-16 bg-secondary text-center text-xs text-secondary-foreground rounded-lg px-2 py-1 outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setEditCategory(c.key)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                    editCategory === c.key
                      ? 'bg-primary text-primary-foreground scale-105'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold py-1.5 rounded-xl text-xs">
                <Check className="w-4 h-4" /> Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5 p-3">
            <button
              onClick={() => onToggle(item.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                item.checked
                  ? 'bg-success border-success'
                  : 'border-muted-foreground/30 hover:border-primary'
              }`}
            >
              {item.checked && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-3.5 h-3.5 text-success-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium transition-all duration-300 ${
                item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {item.name}
              </span>
              {item.quantity && (
                <span className="ml-2 text-[11px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                  {item.quantity}
                </span>
              )}
            </div>

            {item.aisle != null && (
              <span className="text-[11px] font-bold bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded-lg shrink-0">
                R{item.aisle}
              </span>
            )}

            <span className="text-base shrink-0">{cat?.emoji}</span>

            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <EllipsisVertical className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden min-w-[140px]"
                  >
                    <button
                      onClick={() => {
                        setEditName(item.name);
                        setEditCategory(item.category);
                        setEditAisle(item.aisle?.toString() ?? '');
                        setEditQuantity(item.quantity ?? '');
                        setEditing(true);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Modifier
                    </button>
                    <button
                      onClick={() => { onRemove(item.id); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
