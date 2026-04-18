import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '@/types/grocery';

interface AddItemFormProps {
  onAdd: (name: string, category: string, aisle?: number, quantity?: string) => void;
  prefillName?: string;
}

export default function AddItemForm({ onAdd, prefillName = '' }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('autre');
  const [aisle, setAisle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, category, aisle ? parseInt(aisle) : undefined, quantity || undefined);
    setName('');
    setAisle('');
    setQuantity('');
    setIsOpen(false);
  };

  const handleOpen = () => {
    const candidate = prefillName.trim();
    setName((prev) => (prev.trim() ? prev : candidate));
    setIsOpen(true);
  };

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/45 backdrop-blur-[3px] z-40"
              aria-label="Fermer le formulaire d'ajout"
            />
            <motion.form
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="absolute bottom-full right-0 mb-3 w-[min(28rem,calc(100vw-2rem))] overflow-hidden z-50"
            >
              <div className="rounded-2xl bg-card border border-border p-4 shadow-xl">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de l'article..."
                    autoFocus
                    className="min-w-0 flex-1 bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantité"
                    className="w-24 flex-shrink-0 bg-secondary text-sm font-medium text-secondary-foreground rounded-xl px-3 py-2 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 sm:w-32"
                  />
                  <input
                    type="number"
                    value={aisle}
                    onChange={(e) => setAisle(e.target.value)}
                    placeholder="Rayon"
                    min={1}
                    className="w-16 flex-shrink-0 bg-secondary text-center text-sm font-semibold text-secondary-foreground rounded-xl px-2 py-2 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 sm:w-20"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        category === cat.key
                          ? 'bg-primary text-primary-foreground shadow-md scale-105'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-40 transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          layoutId="add-button"
          onClick={handleOpen}
          className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.75)] hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center"
          title="Ajouter un article"
          aria-label="Ajouter un article"
          whileTap={{ scale: 0.94 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
