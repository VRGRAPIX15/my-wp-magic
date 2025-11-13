import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Sparkles, Shield, Zap, Download, Chrome } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { login } = useAuth();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPWAPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPWAPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(userId, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Camera,
      title: "Professional Gallery",
      description: "Browse your photos in stunning masonry layout with instant previews"
    },
    {
      icon: Sparkles,
      title: "Smart Organization",
      description: "Folders, likes, comments, and intelligent search all in one place"
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Your photos are protected with enterprise-grade security"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for smooth browsing even with thousands of photos"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-dark via-luxury-deep to-luxury-dark p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-luxury-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-luxury-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side - Carousel */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-purple bg-clip-text text-transparent">
              Client Gallery
            </h1>
            <p className="text-lg text-muted-foreground">
              Your premium photo management experience
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <Card className="border-luxury-gold/20 bg-card/50 backdrop-blur-xl">
                    <CardContent className="flex flex-col items-start p-8 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-purple flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-luxury-dark" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-luxury-gold/20 bg-card/50 backdrop-blur-xl" />
            <CarouselNext className="border-luxury-gold/20 bg-card/50 backdrop-blur-xl" />
          </Carousel>

          {/* PWA Install Prompt */}
          {showPWAPrompt && (
            <Card className="border-luxury-purple/20 bg-luxury-purple/5 backdrop-blur-xl animate-fade-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-luxury-purple/20 flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-luxury-purple" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-foreground">Install App</h4>
                    <p className="text-sm text-muted-foreground">
                      Install our PWA for offline access and a native app experience
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleInstallPWA}
                  className="w-full bg-gradient-to-r from-luxury-gold to-luxury-purple hover:opacity-90 text-luxury-dark font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-luxury-gold/20 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-purple shadow-lg">
                  <Camera className="w-10 h-10 text-luxury-dark" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-purple bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground">
                    Sign in to access your gallery
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-foreground font-medium">User ID</Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    className="h-12 bg-background/50 border-border focus:border-luxury-gold transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-background/50 border-border focus:border-luxury-gold transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-luxury-gold to-luxury-purple hover:opacity-90 text-luxury-dark font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-luxury-dark/20 border-t-luxury-dark rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Mobile PWA Install */}
              {showPWAPrompt && (
                <div className="lg:hidden pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Chrome className="w-4 h-4" />
                    <span>Install app for better experience</span>
                  </div>
                  <Button 
                    onClick={handleInstallPWA}
                    variant="outline"
                    className="w-full border-luxury-purple/20 hover:bg-luxury-purple/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install PWA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile feature cards */}
        <div className="lg:hidden col-span-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <Card className="border-luxury-gold/20 bg-card/50 backdrop-blur-xl">
                    <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-luxury-gold to-luxury-purple flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-luxury-dark" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Login;
