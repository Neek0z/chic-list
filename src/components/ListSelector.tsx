import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, Trash2, Pencil, Check, X } from 'lucide-react';
import { GroceryList } from '@/types/grocery';

interface ListSelectorProps {
  lists: GroceryList[];
  activeList: GroceryList;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function ListSelector({ lists, activeList, onSwitch, onCreate, onDelete, onRename }: ListSelectorProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
    setCreating(false);
    setOpen(false);
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    onRename(id, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {activeList.name}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => { setOpen(false); setCreating(false); }} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-30 overflow-hidden"
            >
              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                {lists.map(list => (
                  <div
                    key={list.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      list.id === activeList.id ? 'bg-primary/10' : 'hover:bg-secondary'
                    }`}
                  >
                    {editingId === list.id ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRename(list.id)}
                          autoFocus
                          className="flex-1 bg-transparent text-sm text-foreground outline-none"
                        />
                        <button onClick={() => handleRename(list.id)} className="p-1 text-success"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => { onSwitch(list.id); setOpen(false); }}
                          className="flex-1 text-left text-sm font-medium text-foreground truncate"
                        >
                          {list.name}
                          <span className="text-muted-foreground ml-1.5 text-xs">({list.items.length})</span>
                        </button>
                        <button
                          onClick={() => { setEditingId(list.id); setEditName(list.name); }}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {lists.length > 1 && (
                          <button
                            onClick={() => onDelete(list.id)}
                            className="p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-2">
                {creating ? (
                  <div className="flex items-center gap-2 px-2">
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreate()}
                      placeholder="Nom de la liste..."
                      autoFocus
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button onClick={handleCreate} className="p-1 text-primary"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setCreating(false)} className="p-1 text-muted-foreground"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCreating(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nouvelle liste
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
