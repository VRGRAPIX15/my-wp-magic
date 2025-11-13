import { BreadcrumbItem } from '@/lib/api';
import { Breadcrumb, BreadcrumbItem as BItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, Sun, Moon, Monitor, Grid3x3, Download, BookOpen, Send, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import JSZip from 'jszip';
import { useIsMobile } from '@/hooks/use-mobile';

interface SecondBarProps {
  breadcrumb: BreadcrumbItem[];
  onBreadcrumbClick: (folderId: string) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  selectedItems: Set<string>;
  currentFolderId: string;
  showLikedOnly: boolean;
  onToggleLikedOnly: () => void;
}

const SecondBar = ({ breadcrumb, onBreadcrumbClick, gridSize, onGridSizeChange, selectedItems, currentFolderId, showLikedOnly, onToggleLikedOnly }: SecondBarProps) => {
  const { user, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDownloadAll = async () => {
    toast({ title: 'Feature coming soon', description: 'Download all functionality will be available soon' });
  };

  const handleDownloadSelected = async () => {
    if (selectedItems.size === 0) {
      toast({ title: 'No items selected', description: 'Please select items to download', variant: 'destructive' });
      return;
    }
    
    if (!token) return;
    
    try {
      toast({ title: 'Preparing download...', description: 'Creating ZIP file' });
      const response = await api.zip(token, currentFolderId, Array.from(selectedItems));
      if (response.ok && response.url) {
        window.open(response.url, '_blank');
        toast({ title: 'Download ready', description: 'Opening download link' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create download', variant: 'destructive' });
    }
  };

  const handleSubmitSelected = async () => {
    if (selectedItems.size === 0) {
      toast({ title: 'No items selected', description: 'Please select items to submit', variant: 'destructive' });
      return;
    }
    
    if (!token) return;
    
    try {
      const response = await api.submitSelected(token, currentFolderId, Array.from(selectedItems));
      if (response.ok) {
        toast({ title: 'Submitted successfully', description: `${selectedItems.size} items submitted` });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit', variant: 'destructive' });
    }
  };

  return (
    <div className="h-12 border-b bg-card flex items-center justify-between px-2 sm:px-4 gap-2">
      <Breadcrumb className="flex-1 min-w-0">
        <BreadcrumbList className="flex-wrap">
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BItem>
                {index === breadcrumb.length - 1 ? (
                  <BreadcrumbPage className="text-xs sm:text-sm">{isMobile && item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href="#" 
                    className="text-xs sm:text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onBreadcrumbClick(item.id);
                    }}
                  >
                    {isMobile && item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
                  </BreadcrumbLink>
                )}
              </BItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover">
          <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onToggleLikedOnly}>
            <Heart className={`mr-2 h-4 w-4 ${showLikedOnly ? 'fill-current' : ''}`} />
            <span>{showLikedOnly ? 'Show All' : 'Show Liked'}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as any)}>
            <DropdownMenuRadioItem value="light">
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="auto">
              <Monitor className="mr-2 h-4 w-4" />
              Auto
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Grid Size</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={String(gridSize)} onValueChange={(v) => onGridSizeChange(Number(v))}>
            <DropdownMenuRadioItem value="2">2 Columns</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3">3 Columns</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="4">4 Columns</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="5">5 Columns</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownloadAll}>
            <Download className="mr-2 h-4 w-4" />
            Download All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadSelected} disabled={selectedItems.size === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Selected ({selectedItems.size})
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <BookOpen className="mr-2 h-4 w-4" />
            Flipbook (Coming Soon)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSubmitSelected} disabled={selectedItems.size === 0}>
            <Send className="mr-2 h-4 w-4" />
            Submit Selected ({selectedItems.size})
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SecondBar;
