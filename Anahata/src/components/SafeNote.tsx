import { useState } from 'react';
import { motion } from 'framer-motion';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { Heart, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const SafeNote = () => {
  const { isConfidential } = useConfidentialMode();
  const [note, setNote] = useState(() => {
    if (isConfidential) return '';
    return localStorage.getItem('safeNote') || '';
  });
  const [showNote, setShowNote] = useState(false);

  const savedNote = localStorage.getItem('safeNote');

  const handleSave = () => {
    if (!isConfidential) {
      localStorage.setItem('safeNote', note);
      localStorage.setItem('safeNoteDate', new Date().toISOString());
    }
  };

  const handleShowNote = () => {
    const saved = localStorage.getItem('safeNote');
    if (saved) {
      setNote(saved);
      setShowNote(true);
    }
  };

  return (
    <div className="card-3d p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Heart className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">Safe-Note to Self</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Write something you want to remember. Shown during low-mood periods.
          </p>
          
          {!savedNote ? (
            <div className="space-y-3">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note to your future self..."
                className="min-h-[100px]"
                disabled={isConfidential}
              />
              <Button
                onClick={handleSave}
                disabled={!note.trim() || isConfidential}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
              {isConfidential && (
                <p className="text-xs text-muted-foreground">
                  Confidential Mode: Notes cannot be saved
                </p>
              )}
            </div>
          ) : (
            <Dialog open={showNote} onOpenChange={setShowNote}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" onClick={handleShowNote}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Your Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Note to Self</DialogTitle>
                  <DialogDescription>
                    Written on {new Date(localStorage.getItem('safeNoteDate') || '').toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{savedNote}</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeNote;

