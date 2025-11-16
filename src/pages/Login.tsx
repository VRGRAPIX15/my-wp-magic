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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" 
         style={{ background: 'var(--gradient-primary)' }}>
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.03"/><circle cx="90" cy="40" r="1" fill="%23ffffff" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')` 
           }} 
      />

      <div className="w-full max-w-md relative z-10 px-4 py-4">
        {/* Login Card */}
        <Card className="w-full bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vr-purple-start via-vr-purple-end to-pink-400" />
          
          <CardContent className="p-8 sm:p-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-vr-purple-start to-vr-purple-end shadow-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-vr-purple-start to-vr-purple-end bg-clip-text text-transparent">
                  VR-GRAPIX15
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign in to your gallery
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-foreground font-medium text-sm">User ID</Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-vr-purple-start to-vr-purple-end hover:opacity-90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* PWA Install Button */}
            {showPWAPrompt && (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Download className="w-4 h-4" />
                  <span>Install for best experience</span>
                </div>
                <Button 
                  onClick={handleInstallPWA}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 hover:bg-primary/10"
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
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-white/30 p-2.5">
              <div className="flex flex-col items-center text-center space-y-1">
                <Chrome className="w-4 h-4 text-vr-purple-start" />
                <p className="text-[10px] font-medium text-foreground">iOS/Safari</p>
                <p className="text-[9px] text-muted-foreground leading-tight">
                  Share → Home
                </p>
              </div>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-white/30 p-2.5">
              <div className="flex flex-col items-center text-center space-y-1">
                <Download className="w-4 h-4 text-vr-purple-end" />
                <p className="text-[10px] font-medium text-foreground">Android</p>
                <p className="text-[9px] text-muted-foreground leading-tight">
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
