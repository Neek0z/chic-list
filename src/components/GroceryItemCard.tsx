import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { GroceryItem, CATEGORIES } from '@/types/grocery';

interface GroceryItemCardProps {
  item: GroceryItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function GroceryItemCard({ item, onToggle, onRemove }: GroceryItemCardProps) {
  const cat = CATEGORIES.find(c => c.key === item.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -80, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 ${
        item.checked ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
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
            className="w-4 h-4 text-success-foreground"
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
        <span className={`text-base font-medium transition-all duration-300 ${
          item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
        }`}>
          {item.name}
        </span>
      </div>

      {item.aisle != null && (
        <span className="text-xs font-bold bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-lg shrink-0">
          R{item.aisle}
        </span>
      )}

      <span className="text-lg shrink-0">{cat?.emoji}</span>

      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
