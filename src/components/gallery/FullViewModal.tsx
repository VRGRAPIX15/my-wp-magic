import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/lib/api';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FullViewModalProps {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
  onLike: (item: MediaItem) => void;
  onComment: (item: MediaItem, text: string, preset: string) => void;
}

const PRESETS = ['Half sheet', 'Important', 'Bride Family', 'Groom Family'];

const FullViewModal = ({ item, items, onClose, onNavigate, onLike, onComment }: FullViewModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [preset, setPreset] = useState(item.preset || '');
  const { toast } = useToast();

  const currentIndex = items.findIndex(i => i.id === item.id);
  const total = items.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
      setCommentText('');
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      onNavigate(items[currentIndex + 1]);
      setCommentText('');
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() && !preset) {
      toast({ title: 'Error', description: 'Please enter a comment or select a preset', variant: 'destructive' });
      return;
    }
    onComment(item, commentText, preset);
    setCommentText('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          url: item.url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(item.url);
      toast({ title: 'Link copied', description: 'Image link copied to clipboard' });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {currentIndex + 1} / {total}
              </Badge>
              <span className="text-sm font-medium truncate max-w-md">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => onLike(item)}>
                <Heart className={`w-5 h-5 ${item.likedByMe ? 'fill-current text-destructive' : ''}`} />
              </Button>
              <Badge variant="secondary">{item.likeCount}</Badge>
              
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Badge variant="secondary">{item.commentCount}</Badge>

              <Button variant="ghost" size="icon" onClick={() => window.open(item.downloadUrl, '_blank')}>
                <Download className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 relative flex items-center justify-center bg-muted p-4 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <img
              src={item.previewUrl}
              alt={item.name}
              className="max-w-full max-h-full object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
              onClick={handleNext}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Comment Section */}
          <div className="p-4 border-t bg-card space-y-3">
            <div className="flex gap-2">
              <Select value={preset} onValueChange={setPreset}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select preset..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 min-h-[60px] resize-none"
              />
              <Button onClick={handleSubmitComment}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullViewModal;
