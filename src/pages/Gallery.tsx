import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, MediaItem, BreadcrumbItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import TopBar from '@/components/gallery/TopBar';
import SecondBar from '@/components/gallery/SecondBar';
import ThirdBar from '@/components/gallery/ThirdBar';
import MasonryGrid from '@/components/gallery/MasonryGrid';
import FullViewModal from '@/components/gallery/FullViewModal';


const Gallery = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [items, setItems] = useState<MediaItem[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('name_asc');
  const [gridSize, setGridSize] = useState(3);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [showCommentsOnly, setShowCommentsOnly] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [fullViewItem, setFullViewItem] = useState<MediaItem | null>(null);
  const [totalCounts, setTotalCounts] = useState({ totalLikes: 0, totalComments: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  const loadFolder = async (folderId: string, sortBy?: string) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.list(token, folderId, sortBy || sort);
      if (response.ok) {
        setItems(response.items);
        setBreadcrumb(response.breadcrumb);
        setCurrentFolderId(response.folderId);
        setTotalCounts(response.counts);
      } else {
        toast({ title: 'Error', description: response.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load folder', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.folderId) {
      loadFolder(user.folderId);
    }
  }, [user]);

  const handleFolderClick = (folderId: string) => {
    loadFolder(folderId);
    setSearchQuery('');
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    loadFolder(currentFolderId, newSort);
  };

  const handleSearch = async (query: string, scope: 'this' | 'all') => {
    if (!token) return;
    
    if (!query.trim()) {
      loadFolder(currentFolderId);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.search(token, currentFolderId, query, scope);
      if (response.ok) {
        setItems(response.items);
        toast({ title: 'Search completed', description: `Found ${response.items.length} items` });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Search failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const displayItems = items.filter(item => {
    if (item.type === 'folder') return true;
    if (showLikedOnly && !item.likedByMe) return false;
    if (showCommentsOnly && item.commentCount === 0) return false;
    return true;
  });

  const folderCount = items.filter(i => i.type === 'folder').length;
  const fileCount = items.filter(i => i.type !== 'folder').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50">
        <TopBar counts={totalCounts} />
        <SecondBar
        breadcrumb={breadcrumb}
        onBreadcrumbClick={handleFolderClick}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        selectedItems={selectedItems}
        currentFolderId={currentFolderId}
        showLikedOnly={showLikedOnly}
        onToggleLikedOnly={() => setShowLikedOnly(!showLikedOnly)}
      />
      <ThirdBar
        folderCount={folderCount}
        fileCount={fileCount}
        likedCount={totalCounts.totalLikes}
        commentCount={totalCounts.totalComments}
        sort={sort}
        onSortChange={handleSortChange}
        showLikedOnly={showLikedOnly}
        onToggleLikedOnly={() => setShowLikedOnly(!showLikedOnly)}
        showCommentsOnly={showCommentsOnly}
        onToggleCommentsOnly={() => setShowCommentsOnly(!showCommentsOnly)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      </div>
      <main className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <MasonryGrid
            items={displayItems}
            gridSize={gridSize}
            selectedItems={selectedItems}
            onSelectItem={(id) => {
              const newSelected = new Set(selectedItems);
              if (newSelected.has(id)) {
                newSelected.delete(id);
              } else {
                newSelected.add(id);
              }
              setSelectedItems(newSelected);
            }}
            onFolderClick={handleFolderClick}
            onItemClick={(item) => setFullViewItem(item)}
            onLike={(item) => {
              if (!token) return;
              const newLiked = !item.likedByMe;
              api.like(token, currentFolderId, item.id, newLiked).then(() => {
                setItems(prev => prev.map(i => 
                  i.id === item.id 
                    ? { ...i, likedByMe: newLiked, likeCount: i.likeCount + (newLiked ? 1 : -1) }
                    : i
                ));
              });
            }}
          />
        )}
      </main>
      {fullViewItem && (
        <FullViewModal
          item={fullViewItem}
          items={displayItems.filter(i => i.type !== 'folder')}
          onClose={() => setFullViewItem(null)}
          onNavigate={(newItem) => setFullViewItem(newItem)}
          onLike={(item) => {
            if (!token) return;
            const newLiked = !item.likedByMe;
            api.like(token, currentFolderId, item.id, newLiked).then(() => {
              setItems(prev => prev.map(i => 
                i.id === item.id 
                  ? { ...i, likedByMe: newLiked, likeCount: i.likeCount + (newLiked ? 1 : -1) }
                  : i
              ));
              setFullViewItem(prev => prev ? { ...prev, likedByMe: newLiked, likeCount: prev.likeCount + (newLiked ? 1 : -1) } : null);
            });
          }}
          onComment={(item, text, preset) => {
            if (!token) return;
            Promise.all([
              api.comment(token, currentFolderId, item.id, text),
              preset ? api.setPreset(token, currentFolderId, item.id, preset) : Promise.resolve()
            ]).then(() => {
              setItems(prev => prev.map(i => 
                i.id === item.id 
                  ? { ...i, commentCount: i.commentCount + 1, preset: preset || i.preset }
                  : i
              ));
              setFullViewItem(prev => prev ? { ...prev, commentCount: prev.commentCount + 1, preset: preset || prev.preset } : null);
              toast({ title: 'Comment added' });
            });
          }}
        />
      )}
    </div>
  );
};

export default Gallery;
