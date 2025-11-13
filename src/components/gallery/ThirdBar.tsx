import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Search, ArrowUpDown, FolderOpen, FileImage } from 'lucide-react';

interface ThirdBarProps {
  folderCount: number;
  fileCount: number;
  likedCount: number;
  commentCount: number;
  sort: string;
  onSortChange: (sort: string) => void;
  showLikedOnly: boolean;
  onToggleLikedOnly: () => void;
  showCommentsOnly: boolean;
  onToggleCommentsOnly: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string, scope: 'this' | 'all') => void;
}

const ThirdBar = ({ 
  folderCount, 
  fileCount, 
  likedCount, 
  commentCount, 
  sort, 
  onSortChange,
  showLikedOnly,
  onToggleLikedOnly,
  showCommentsOnly,
  onToggleCommentsOnly,
  searchQuery,
  onSearchChange,
  onSearch
}: ThirdBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (scope: 'this' | 'all') => {
    onSearch(searchQuery, scope);
    setSearchOpen(false);
  };

  return (
    <div className="h-12 border-b bg-card flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="w-4 h-4" />
          <span>{folderCount}</span>
          <FileImage className="w-4 h-4 ml-2" />
          <span>{fileCount}</span>
        </div>

        <Button
          variant={showLikedOnly ? "default" : "ghost"}
          size="sm"
          onClick={onToggleLikedOnly}
          className="gap-2"
        >
          <Heart className={`w-4 h-4 ${showLikedOnly ? 'fill-current' : ''}`} />
          <Badge variant="secondary">{likedCount}</Badge>
        </Button>

        <Button
          variant={showCommentsOnly ? "default" : "ghost"}
          size="sm"
          onClick={onToggleCommentsOnly}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <Badge variant="secondary">{commentCount}</Badge>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu open={searchOpen} onOpenChange={setSearchOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover p-4">
            <div className="space-y-2">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch('this');
                  }
                }}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSearch('this')}
                >
                  This Folder
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleSearch('all')}
                >
                  All Folders
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onSortChange('name_asc')}>
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name_desc')}>
              Name (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('size')}>
              Size
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('created')}>
              Date Created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ThirdBar;
