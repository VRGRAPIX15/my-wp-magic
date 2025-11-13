import Masonry from 'react-masonry-css';
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
  const breakpointColumns = {
    default: gridSize,
    1536: Math.min(gridSize, 6),
    1280: Math.min(gridSize, 5),
    1024: Math.min(gridSize, 4),
    768: Math.min(gridSize, 3),
    640: Math.min(gridSize, 2),
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {items.map((item) => (
        <MediaCard
          key={item.id}
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
      ))}
    </Masonry>
  );
};

export default MasonryGrid;
