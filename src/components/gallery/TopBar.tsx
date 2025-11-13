import { Camera } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-center px-4">
      <div className="flex items-center gap-2">
        <Camera className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Client Gallery</h1>
      </div>
    </header>
  );
};

export default TopBar;
