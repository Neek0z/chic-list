import { DisplayMode } from '@/types/grocery';
import { LayoutGrid, ArrowDownNarrowWide, List, ShoppingCart } from 'lucide-react';

interface DisplayModeToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  shoppingMode: boolean;
  onToggleShoppingMode: () => void;
}

const modes: { key: DisplayMode; label: string; icon: React.ReactNode }[] = [
  { key: 'category', label: 'Catégories', icon: <LayoutGrid className="w-4 h-4" /> },
  { key: 'aisle', label: 'Rayons', icon: <ArrowDownNarrowWide className="w-4 h-4" /> },
  { key: 'all', label: 'Tout', icon: <List className="w-4 h-4" /> },
];

export default function DisplayModeToggle({
  mode,
  onChange,
  shoppingMode,
  onToggleShoppingMode,
}: DisplayModeToggleProps) {
  return (
    <div className="flex w-full bg-secondary rounded-xl p-1 gap-0.5 justify-center">
      {modes.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === m.key
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onToggleShoppingMode}
        title="Mode course"
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          shoppingMode
            ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-500'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline">Mode course</span>
      </button>
    </div>
  );
}
