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
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Folder className="w-12 h-12 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.sizeHuman || 'Folder'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group relative">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="bg-background/80 backdrop-blur"
        />
      </div>
      
      <div className="cursor-pointer" onClick={onClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={item.thumbnail}
            srcSet={`${item.thumbnail} 480w, ${item.previewUrl} 1200w`}
            sizes="(max-width: 600px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt={item.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <CardContent className="p-3">
        <p className="text-sm font-medium truncate mb-2">{item.name}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{item.sizeHuman}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              <Heart className={`w-4 h-4 ${item.likedByMe ? 'fill-current text-destructive' : ''}`} />
            </Button>
            {item.likeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {item.likeCount}
              </Badge>
            )}
            {item.commentCount > 0 && (
              <>
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {item.commentCount}
                </Badge>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.downloadUrl, '_blank');
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;