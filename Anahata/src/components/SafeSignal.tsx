import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const SafeSignal = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('safeSignals');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "I'm not okay, can we talk?", isDefault: true },
    ];
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleSave = () => {
    localStorage.setItem('safeSignals', JSON.stringify(messages));
  };

  const handleSend = (text: string) => {
    if (navigator.share) {
      navigator.share({
        text: text,
      });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleEdit = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = (id: number) => {
    setMessages(messages.map((msg) => 
      msg.id === id ? { ...msg, text: editText } : msg
    ));
    setEditingId(null);
    setEditText('');
    handleSave();
  };

  const handleDelete = (id: number) => {
    setMessages(messages.filter((msg) => msg.id !== id || msg.isDefault));
    handleSave();
  };

  return (
    <div className="card-3d p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">Safe-Signal Messages</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pre-written messages you can send when you need help. One-tap send, no explanation needed.
          </p>
          
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                {editingId === msg.id ? (
                  <>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 min-h-[60px]"
                    />
                    <Button size="sm" onClick={() => handleSaveEdit(msg.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-sm text-foreground">{msg.text}</p>
                    <Button
                      size="sm"
                      onClick={() => handleSend(msg.text)}
                      className="bg-primary"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    {!msg.isDefault && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(msg.id, msg.text)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(msg.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSignal;

