import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Download, Chrome } from 'lucide-react';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-br from-luxury-dark via-luxury-deep to-luxury-dark relative overflow-hidden">
      {/* Optimized background for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-luxury-gold/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-luxury-green/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10 px-3 sm:px-4 py-4">
        {/* Login Form */}
        <Card className="w-full bg-card/90 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-green bg-clip-text text-transparent">
                Client Gallery
              </h1>
            </div>

            {/* Welcome section */}
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-luxury-gold to-luxury-green shadow-lg">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-luxury-dark" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-green bg-clip-text text-transparent">
                  Welcome
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sign in to access your gallery
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-foreground font-medium text-sm sm:text-base">User ID</Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="h-11 sm:h-12 bg-background/50 border-border focus:border-luxury-gold transition-colors text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 sm:h-12 bg-background/50 border-border focus:border-luxury-gold transition-colors text-base"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-luxury-gold to-luxury-green hover:opacity-90 text-luxury-dark font-semibold text-base transition-all duration-300 shadow-lg"
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

            {/* PWA Install Button */}
            {showPWAPrompt && (
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center">
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Install for best experience</span>
                </div>
                <Button 
                  onClick={handleInstallPWA}
                  variant="outline"
                  size="sm"
                  className="w-full border-luxury-green/30 hover:bg-luxury-green/10 text-sm"
                >
                  Install App
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PWA Install Guide - Compact */}
      {!showPWAPrompt && (
        <div className="fixed bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-40">
          <div className="grid grid-cols-2 gap-2 max-w-xs sm:max-w-sm mx-auto">
            <Card className="bg-card/95 backdrop-blur-sm border-border/30 p-2 sm:p-2.5">
              <div className="flex flex-col items-center text-center space-y-0.5 sm:space-y-1">
                <Chrome className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-gold" />
                <p className="text-[9px] sm:text-[10px] font-medium text-foreground">iOS/Safari</p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground leading-tight">
                  Share → Home
                </p>
              </div>
            </Card>
            <Card className="bg-card/95 backdrop-blur-sm border-border/30 p-2 sm:p-2.5">
              <div className="flex flex-col items-center text-center space-y-0.5 sm:space-y-1">
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-green" />
                <p className="text-[9px] sm:text-[10px] font-medium text-foreground">Android</p>
                <p className="text-[8px] sm:text-[9px] text-muted-foreground leading-tight">
                  Menu → Install
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
