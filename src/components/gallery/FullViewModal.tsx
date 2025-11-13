import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/lib/api';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showCommentSection, setShowCommentSection] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      <DialogContent className="max-w-[100vw] h-[100vh] sm:max-w-7xl sm:h-[95vh] p-0 gap-0 sm:rounded-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-card/95 backdrop-blur">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Badge variant="outline" className="text-xs shrink-0">
                {currentIndex + 1} / {total}
              </Badge>
              <span className="text-xs sm:text-sm font-medium truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onLike(item)}>
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${item.likedByMe ? 'fill-current text-destructive' : ''}`} />
              </Button>
              {!isMobile && <Badge variant="secondary" className="text-xs">{item.likeCount}</Badge>}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => setShowCommentSection(!showCommentSection)}
              >
                <MessageCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${showCommentSection ? 'fill-current text-primary' : ''}`} />
              </Button>
              {!isMobile && <Badge variant="secondary" className="text-xs">{item.commentCount}</Badge>}

              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => window.open(item.downloadUrl, '_blank')}>
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {!isMobile && (
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={handleShare}>
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}

              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onClose}>
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 relative flex items-center justify-center bg-black/95 p-2 sm:p-4 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur h-10 w-10 sm:h-12 sm:w-12 rounded-full"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <img
              src={item.previewUrl}
              alt={item.name}
              className="max-w-full max-h-full object-contain select-none"
              loading="lazy"
              onContextMenu={(e) => e.preventDefault()}
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur h-10 w-10 sm:h-12 sm:w-12 rounded-full"
              onClick={handleNext}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          {/* Comment Section */}
          {showCommentSection && (
            <div className="p-3 sm:p-4 border-t bg-card/95 backdrop-blur space-y-3 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={preset} onValueChange={setPreset}>
                  <SelectTrigger className="w-full sm:w-48 h-9">
                    <SelectValue placeholder="Select preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 min-h-[60px] sm:min-h-[80px] resize-none text-sm"
                  />
                  <Button onClick={handleSubmitComment} className="h-auto">
                    <MessageCircle className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Comment</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullViewModal;
