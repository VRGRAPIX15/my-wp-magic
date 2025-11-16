import { MediaItem } from '@/lib/api';
import MediaCard from './MediaCard';
import './masonry.css';

interface MasonryGridProps {
  items: MediaItem[];
  gridSize: number;
  selectedItems: Set<string>;
  onSelectItem: (id: string) => void;
  onFolderClick: (folderId: string) => void;
  onItemClick: (item: MediaItem) => void;
  onLike: (item: MediaItem) => void;
}

const MasonryGrid = ({ items, gridSize, selectedItems, onSelectItem, onFolderClick, onItemClick, onLike }: MasonryGridProps) => {
  return (
    <div className="masonry" data-grid-size={gridSize} aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className="masonry-item">
          <MediaCard
            item={item}
            selected={selectedItems.has(item.id)}
            onSelect={() => onSelectItem(item.id)}
            onClick={() => {
              if (item.type === 'folder') {
                onFolderClick(item.id);
              } else {
                onItemClick(item);
              }
            }}
            onLike={() => onLike(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;