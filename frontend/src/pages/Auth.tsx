import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Music2, Radio, Headphones, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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
              { icon: Radio, label: "Fil d'actualité", sub: "Partagez & découvrez" },
              { icon: Mic2, label: "Mode karaoké", sub: "Mot par mot" },
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
            {/* Toggle tabs */}
            <div className="flex rounded-xl bg-muted/50 p-1 mb-8 gap-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    mode === m
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Se connecter" : "S'inscrire"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-black mb-1">
                    {mode === "login" ? "Bon retour ! 👋" : "Rejoignez LyricWave 🎵"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {mode === "login"
                      ? "Connectez-vous pour accéder à vos projets."
                      : "Créez votre compte et commencez gratuitement."}
                  </p>
                </div>

                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Votre nom d'artiste"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-muted/50 border-border/50 focus:border-primary/60 h-12 rounded-xl"
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary/60 h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary/60 h-12 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-primary hover:underline">
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold text-base rounded-xl gap-2 mt-2"
                >
                  {mode === "login" ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Se connecter
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Créer mon compte
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs text-muted-foreground bg-card px-3">
                    ou continuer avec
                  </div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 fill-foreground" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </motion.form>
            </AnimatePresence>

            <p className="text-center text-xs text-muted-foreground mt-6">
              {mode === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">
                    S'inscrire gratuitement
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                    Se connecter
                  </button>
                </>
              )}
            </p>
          </motion.div>

          <p className="text-center text-xs text-muted-foreground/50 mt-6">
            En continuant, vous acceptez nos{" "}
            <a href="#" className="hover:text-muted-foreground">Conditions d'utilisation</a>{" "}
            et notre{" "}
            <a href="#" className="hover:text-muted-foreground">Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
