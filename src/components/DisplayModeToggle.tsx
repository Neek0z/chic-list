import { DisplayMode } from '@/types/grocery';
import { LayoutGrid, ArrowDownNarrowWide, List } from 'lucide-react';

interface DisplayModeToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

const modes: { key: DisplayMode; label: string; icon: React.ReactNode }[] = [
  { key: 'category', label: 'Catégories', icon: <LayoutGrid className="w-4 h-4" /> },
  { key: 'aisle', label: 'Rayons', icon: <ArrowDownNarrowWide className="w-4 h-4" /> },
  { key: 'all', label: 'Tout', icon: <List className="w-4 h-4" /> },
];

export default function DisplayModeToggle({ mode, onChange }: DisplayModeToggleProps) {
  return (
    <div className="flex bg-secondary rounded-xl p-1 gap-0.5">
      {modes.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === m.key
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
