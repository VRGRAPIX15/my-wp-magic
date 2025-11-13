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
  // Use a pure-CSS masonry (columns) layout for responsiveness.
  // Keep all handlers and logic intact – we only change the layout wrapper.
  return (
    <div className="masonry" aria-live="polite">
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