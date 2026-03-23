import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Music2, Headphones, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import logoImg from "@/assets/lyricwave-logo.png";

const FloatingNote = ({ x, y, delay, symbol }: { x: string; y: string; delay: number; symbol: string }) => (
  <motion.div
    className="absolute text-primary/20 font-heading font-black select-none pointer-events-none"
    style={{ left: x, top: y, fontSize: "clamp(1.2rem, 3vw, 2rem)" }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: [0, 0.4, 0], y: [-10, -40, -70] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }}
  >
    {symbol}
  </motion.div>
);

const WaveBar = ({ delay, height }: { delay: number; height: number }) => (
  <div
    className="w-0.5 bg-gradient-primary rounded-full wave-bar opacity-40"
    style={{ height: `${height}px`, animationDelay: `${delay}s` }}
  />
);

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ name: string; email: string } | null>(null);
  
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const googleInitialized = useRef(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Load Google Identity Services script if not loaded
      if (!(window as any).google?.accounts) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Google script"));
          document.head.appendChild(script);
        });
      }

      const google = (window as any).google;
      
      // Only initialize once
      if (!googleInitialized.current) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "233486388749-2b2qke42cj5iseqblj1bffkfli63b2l8.apps.googleusercontent.com",
          callback: async (response: any) => {
            try {
              const result = await api.auth.googleLogin(response.credential);
              localStorage.setItem("auth_token", result.token);
              
              if (result.isNewUser) {
                setPendingGoogleUser({ name: result.user.name, email: result.user.email });
                setShowNewUserModal(true);
              } else {
                navigate("/dashboard");
              }
            } catch (err) {
              console.error("Google auth API error:", err);
              alert("Erreur d'authentification. Veuillez réessayer.");
            } finally {
              setIsLoading(false);
            }
          },
        });
        googleInitialized.current = true;
      }

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "outline", size: "large", width: "100%" }
          );
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
      alert("Erreur lors du chargement de Google Sign-In");
    }
  };

  const handleNewUserConfirm = async () => {
    if (!pendingGoogleUser) return;
    
    try {
      setShowNewUserModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("New user confirmation error:", error);
    }
  };

  const notes = ["♪", "♫", "♩", "♬", "🎵", "🎶", "🎸", "🥁", "🎹", "🎤"];
  const floatingNotes = [
    { x: "5%", y: "15%", delay: 0, symbol: "♪" },
    { x: "90%", y: "20%", delay: 0.8, symbol: "♫" },
    { x: "15%", y: "75%", delay: 1.5, symbol: "🎵" },
    { x: "85%", y: "65%", delay: 0.4, symbol: "♬" },
    { x: "50%", y: "8%", delay: 1.2, symbol: "♩" },
    { x: "70%", y: "85%", delay: 0.6, symbol: "🎶" },
    { x: "30%", y: "90%", delay: 1.8, symbol: "🎤" },
    { x: "95%", y: "50%", delay: 2.1, symbol: "🎸" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden relative">
      {/* Floating musical notes */}
      {floatingNotes.map((note, i) => (
        <FloatingNote key={i} {...note} />
      ))}

      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

        {/* Wave visualizer */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-32 px-4 overflow-hidden">
          {Array.from({ length: 60 }, (_, i) => (
            <WaveBar key={i} delay={i * 0.04} height={Math.random() * 60 + 10} />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="w-20 h-20 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-60 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
              <img src={logoImg} alt="LyricWave" className="w-12 h-12 object-contain" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-5xl font-black mb-4"
          >
            <span className="gradient-text">LyricWave</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg leading-relaxed mb-8"
          >
            Transformez votre musique en vidéos lyrics virales pour TikTok, YouTube, Instagram et plus.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Headphones, label: "Sync automatique", sub: "Algorithme IA" },
              { icon: Music2, label: "Multi-formats", sub: "TikTok, YouTube…" },
              { icon: Mic2, label: "Mode karaoké", sub: "Mot par mot" },
              { icon: Zap, label: "Export rapide", sub: "HD qualité" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="glass rounded-xl p-4 border border-border/40 text-left">
                <Icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <img src={logoImg} alt="LyricWave" className="w-8 h-8 object-contain" />
            <span className="font-heading font-black text-2xl gradient-text">LyricWave</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-heavy rounded-2xl p-8 border border-border/40"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-black mb-1">
                  Bienvenue sur LyricWave 🎵
                </h2>
                <p className="text-muted-foreground text-sm">
                  Connectez-vous avec Google pour commencer à créer des vidéos lyrics incroyables.
                </p>
              </div>

              {/* Google Sign-In Button */}
              <div id="google-signin-btn" className="w-full"></div>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-background border border-border/60 hover:bg-muted/50 font-semibold text-base rounded-xl gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? "Connexion en cours..." : "Continuer avec Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs text-muted-foreground bg-card px-3">
                  Connexion sécurisée via Google
                </div>
              </div>
            </motion.div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              En continuant, vous acceptez nos{" "}
              <a href="#" className="hover:text-muted-foreground">Conditions d'utilisation</a>{" "}
              et notre{" "}
              <a href="#" className="hover:text-muted-foreground">Politique de confidentialité</a>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* New User Modal */}
      <Dialog open={showNewUserModal} onOpenChange={setShowNewUserModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bienvenue sur LyricWave ! 🎉</DialogTitle>
            <DialogDescription>
              {pendingGoogleUser && (
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Bonjour <strong>{pendingGoogleUser.name}</strong> ! Nous sommes ravis de vous accueillir.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Votre compte Google ({pendingGoogleUser.email}) a été connecté avec succès.
                    Vous pouvez maintenant commencer à créer des vidéos lyrics incroyables.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowNewUserModal(false)}
              className="flex-1"
            >
              Plus tard
            </Button>
            <Button
              onClick={handleNewUserConfirm}
              className="flex-1 bg-gradient-primary text-primary-foreground border-0"
            >
              Commencer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
