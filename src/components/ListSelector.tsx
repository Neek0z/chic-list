import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, LogOut, Pencil, Check, X, Copy, UserPlus, Share2 } from 'lucide-react';
import { GroceryList } from '@/types/grocery';
import { toast } from 'sonner';

interface ListSelectorProps {
  lists: GroceryList[];
  activeList: GroceryList;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onLeave: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function ListSelector({ lists, activeList, onSwitch, onCreate, onLeave, onRename }: ListSelectorProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmLeaveId, setConfirmLeaveId] = useState<string | null>(null);

  const listToLeave = confirmLeaveId ? lists.find(l => l.id === confirmLeaveId) : null;

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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copié !');
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    toast.info(`Rejoindre la liste "${code}" — à brancher avec Supabase`);
    setJoinCode('');
    setJoining(false);
  };

  const handleConfirmLeave = () => {
    if (confirmLeaveId) {
      onLeave(confirmLeaveId);
      setConfirmLeaveId(null);
      toast.success('Vous avez quitté la liste');
    }
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

      {/* Confirmation popup */}
      <AnimatePresence>
        {confirmLeaveId && listToLeave && (
          <>
            <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" onClick={() => setConfirmLeaveId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-2xl shadow-xl p-6 max-w-sm w-full pointer-events-auto">
                <h3 className="text-lg font-semibold text-foreground mb-2">Quitter la liste ?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Voulez-vous vraiment quitter <span className="font-semibold text-foreground">« {listToLeave.name} »</span> ? Vous pourrez la rejoindre à nouveau avec le code <span className="font-mono font-bold">{listToLeave.shareCode}</span>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmLeaveId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-muted transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmLeave}
                    className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 transition-all"
                  >
                    Quitter
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => { setOpen(false); setCreating(false); setJoining(false); }} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-lg z-30 overflow-hidden"
            >
              {/* Share code for active list */}
              <div className="px-3 py-2.5 border-b border-border bg-secondary/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Code de partage :</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(activeList.shareCode)}
                    className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm font-bold tracking-widest text-foreground">{activeList.shareCode}</span>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

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
                        <span className="text-[10px] font-mono text-muted-foreground">{list.shareCode}</span>
                        <button
                          onClick={() => { setEditingId(list.id); setEditName(list.name); }}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {lists.length > 1 && (
                          <button
                            onClick={() => { setConfirmLeaveId(list.id); setOpen(false); }}
                            className="p-1 text-muted-foreground hover:text-destructive"
                            title="Quitter la liste"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-2 space-y-1">
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
                ) : joining ? (
                  <div className="flex items-center gap-2 px-2">
                    <input
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleJoin()}
                      placeholder="Code (ex: A3B7K2)"
                      autoFocus
                      maxLength={6}
                      className="flex-1 bg-transparent text-sm font-mono tracking-widest text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button onClick={handleJoin} className="p-1 text-primary"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setJoining(false)} className="p-1 text-muted-foreground"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCreating(true)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Nouvelle liste
                    </button>
                    <button
                      onClick={() => setJoining(true)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Rejoindre
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
