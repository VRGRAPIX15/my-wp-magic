import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { 
  Folder, 
  Heart, 
  MessageSquare, 
  Download, 
  Search, 
  Grid3x3, 
  CheckSquare,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface TutorialStep {
  icon: any;
  title: string;
  description: string;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    icon: Sparkles,
    title: "Welcome to Your Gallery",
    description: "Your premium photo management experience. Let's take a quick tour of the key features."
  },
  {
    icon: Folder,
    title: "Browse Folders & Files",
    description: "Navigate through your folders using breadcrumbs. Click on any folder to explore its contents or click on a photo to view it in full screen."
  },
  {
    icon: Heart,
    title: "Like Your Favorites",
    description: "Click the heart icon on any photo to mark it as a favorite. Use the filter in the top bar to view only liked photos."
  },
  {
    icon: MessageSquare,
    title: "Add Comments",
    description: "Open any photo and add comments. Use preset tags like 'Important' or 'Bride Family' for quick categorization."
  },
  {
    icon: CheckSquare,
    title: "Select & Submit",
    description: "Select multiple photos using checkboxes, then use 'Submit Selected' to send your choices. You can also download selected photos as a ZIP file."
  },
  {
    icon: Search,
    title: "Search & Filter",
    description: "Use the search bar to find photos by name. Filter by likes, comments, or sort by name, size, and date."
  },
  {
    icon: Grid3x3,
    title: "Customize Your View",
    description: "Adjust grid size from the profile menu. Choose between compact, comfortable, or spacious layouts to suit your preference."
  },
  {
    icon: Download,
    title: "Download Options",
    description: "Download individual photos, selected items, or your entire gallery as a ZIP file. All your photos, your way."
  },
  {
    icon: SlidersHorizontal,
    title: "Theme & Settings",
    description: "Switch between light, dark, or auto theme modes. Access all settings from the profile dropdown in the top-right corner."
  }
];

export const OnboardingTutorial = () => {
  const [open, setOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl border-luxury-gold/20 bg-card backdrop-blur-xl p-0 gap-0 overflow-hidden">
        <VisuallyHidden.Root>
          <DialogTitle>Gallery Tutorial</DialogTitle>
        </VisuallyHidden.Root>
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
            <div 
              className="h-full bg-gradient-to-r from-luxury-gold to-luxury-green transition-all duration-300"
              style={{ width: `${((current + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {tutorialSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center text-center p-8 sm:p-12 space-y-6 min-h-[400px] sm:min-h-[500px] justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-luxury-gold to-luxury-green flex items-center justify-center shadow-lg">
                      <step.icon className="w-10 h-10 sm:w-12 sm:h-12 text-background" />
                    </div>
                    
                    <div className="space-y-3 max-w-xl">
                      <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-green bg-clip-text text-transparent">
                        {step.title}
                      </h3>
                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      {tutorialSteps.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === current 
                              ? 'w-8 bg-gradient-to-r from-luxury-gold to-luxury-green' 
                              : 'w-2 bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {current > 0 && (
              <CarouselPrevious className="left-4 border-luxury-gold/20 bg-card/80 backdrop-blur-sm hover:bg-card" />
            )}
            {current < tutorialSteps.length - 1 && (
              <CarouselNext className="right-4 border-luxury-gold/20 bg-card/80 backdrop-blur-sm hover:bg-card" />
            )}
          </Carousel>

          <div className="flex items-center justify-between p-4 sm:p-6 border-t border-border bg-card">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Skip Tutorial
            </Button>

            <div className="flex items-center gap-3">
              {current < tutorialSteps.length - 1 ? (
                <Button
                  onClick={() => api?.scrollNext()}
                  className="bg-gradient-to-r from-luxury-gold to-luxury-green hover:opacity-90 text-background font-semibold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-luxury-gold to-luxury-green hover:opacity-90 text-background font-semibold"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
