import { Camera, Heart, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  counts?: {
    totalLikes: number;
    totalComments: number;
  };
}

const TopBar = ({ counts }: TopBarProps) => {
  return (
    <header className="h-14 border-b shadow-sm flex items-center px-4" 
            style={{ 
              background: 'var(--gradient-primary)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}>
      <div className="container-fluid flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">VR-GRAPIX15</h1>
        </div>

        {/* Header Counts */}
        {counts && (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5" title="Liked items">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="hidden sm:inline text-xs font-semibold text-white/90">Likes:</span>
              <Badge variant="secondary" className="bg-red-500 text-white border-0 text-xs px-2 py-0.5">
                {counts.totalLikes}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5" title="Comments">
              <MessageCircle className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span className="hidden sm:inline text-xs font-semibold text-white/90">Comments:</span>
              <Badge variant="secondary" className="bg-blue-500 text-white border-0 text-xs px-2 py-0.5">
                {counts.totalComments}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
