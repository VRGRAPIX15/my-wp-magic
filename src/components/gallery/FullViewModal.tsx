import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/lib/api';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import ZoomableImage from './ZoomableImage';

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
      <DialogContent 
        className="max-w-[100vw] h-[100vh] sm:max-w-[95vw] sm:h-[95vh] p-0 gap-0 sm:rounded-lg overflow-hidden"
        hideClose={true}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{item.name}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="flex flex-col h-full w-full">
          {/* Sticky Header with gradient */}
          <div className="sticky top-0 z-50 flex items-center justify-between p-2 sm:p-3 border-b backdrop-blur-xl shrink-0"
               style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)' }}>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Badge variant="outline" className="text-xs shrink-0 bg-white/20 border-white/30 text-white backdrop-blur">
                {currentIndex + 1} / {total}
              </Badge>
              <span className="text-xs sm:text-sm font-medium truncate text-white">{item.name}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/20 text-white" 
                onClick={() => onLike(item)}
              >
                <Heart className={`w-4 h-4 ${item.likedByMe ? 'fill-current text-red-400' : ''}`} />
              </Button>
              {!isMobile && <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">{item.likeCount}</Badge>}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/20 text-white"
                onClick={() => setShowCommentSection(!showCommentSection)}
              >
                <MessageCircle className={`w-4 h-4 ${showCommentSection ? 'fill-current' : ''}`} />
              </Button>
              {!isMobile && <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">{item.commentCount}</Badge>}

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/20 text-white" 
                onClick={() => window.open(item.downloadUrl, '_blank')}
              >
                <Download className="w-4 h-4" />
              </Button>

              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/20 text-white" 
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-500/20 text-white hover:text-red-400" 
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Container with Zoom/Pan */}
          <div className="flex-1 relative bg-black overflow-hidden min-h-0">
            <ZoomableImage
              src={item.previewUrl}
              alt={item.name}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full disabled:opacity-30 transition-all"
              style={{ background: 'rgba(102, 126, 234, 0.9)', backdropFilter: 'blur(10px)' }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full disabled:opacity-30 transition-all"
              style={{ background: 'rgba(118, 75, 162, 0.9)', backdropFilter: 'blur(10px)' }}
              onClick={handleNext}
              disabled={currentIndex === total - 1}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Button>
          </div>

          {/* Sticky Comment Section */}
          {showCommentSection && (
            <div className="sticky bottom-0 z-50 p-3 sm:p-4 border-t backdrop-blur-xl space-y-3 shrink-0"
                 style={{ background: 'rgba(102, 126, 234, 0.95)' }}>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={preset} onValueChange={setPreset}>
                  <SelectTrigger className="w-full sm:w-48 h-9 bg-white/10 border-white/30 text-white backdrop-blur">
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
                    className="flex-1 min-h-[60px] sm:min-h-[80px] resize-none text-sm bg-white/10 border-white/30 text-white placeholder:text-white/60 backdrop-blur"
                  />
                  <Button 
                    onClick={handleSubmitComment} 
                    className="h-auto bg-white text-vr-purple-start hover:bg-white/90"
                  >
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
