import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ dark, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-muted transition-all"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
    </button>
  );
}
