import { MediaItem } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Folder, Heart, MessageCircle, Download } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onLike: () => void;
}

const MediaCard = ({ item, selected, onSelect, onClick, onLike }: MediaCardProps) => {
  if (item.type === 'folder') {
    return (
      <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50" 
            style={{ background: 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--muted)))' }}
            onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-vr-purple-start to-vr-purple-end">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Folder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border/50"
          style={{ 
            boxShadow: 'var(--card-shadow)',
            background: 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--muted)/0.3))'
          }}>
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="bg-background/90 backdrop-blur border-2"
        />
      </div>
      
      {/* Badges overlay */}
      {item.likeCount > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-red-500/95 text-white border-0 backdrop-blur flex items-center gap-1 px-2 py-1">
            <Heart className="w-3 h-3 fill-white" />
            <span className="text-xs font-semibold">{item.likeCount}</span>
          </Badge>
        </div>
      )}
      
      <div className="cursor-pointer" onClick={onClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={item.thumbnail}
            srcSet={`${item.thumbnail} 480w, ${item.previewUrl} 1200w`}
            sizes="(max-width: 600px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent p-2">
            <p className="text-white text-xs font-medium truncate">{item.name}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{item.sizeHuman}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              <Heart className={`w-4 h-4 ${item.likedByMe ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
            {item.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium text-blue-500">{item.commentCount}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.downloadUrl, '_blank');
              }}
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;