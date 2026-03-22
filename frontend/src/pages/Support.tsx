import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, HelpCircle, Mail, MessageCircle, Zap, Book,
  ChevronDown, ChevronUp, Send, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const faqs = [
  {
    q: "Comment créer ma première vidéo lyrics ?",
    a: "Cliquez sur « Créer un Projet », uploadez votre fichier audio (MP3 ou WAV), ajoutez vos paroles, choisissez la synchronisation automatique ou manuelle, personnalisez le style et générez votre vidéo. Le tout en moins de 5 minutes !",
  },
  {
    q: "Quels formats audio sont supportés ?",
    a: "LyricWave supporte les formats MP3, WAV, M4A et AAC. La taille maximale par fichier est de 50 MB. La durée maximale est de 10 minutes pour le plan Gratuit, illimitée pour les plans payants.",
  },
  {
    q: "Mes vidéos auront-elles un filigrane ?",
    a: "Le plan Gratuit ajoute un filigrane discret « Made with LyricWave ». Les plans Pro et Entreprise suppriment totalement le filigrane pour un rendu 100% professionnel.",
  },
  {
    q: "Puis-je exporter pour YouTube (format 16:9) ?",
    a: "Oui ! LyricWave supporte 5 formats d'export : TikTok/Reels (9:16), YouTube Shorts (9:16), YouTube Standard (16:9), Instagram (1:1). Tous disponibles dès le plan Pro.",
  },
  {
    q: "Comment fonctionne la synchronisation automatique ?",
    a: "Notre algorithme analyse le fichier audio pour détecter les silences et transitions. Il distribue ensuite intelligemment les timestamps de vos paroles selon la densité de mots et les pauses naturelles.",
  },
  {
    q: "Puis-je annuler mon abonnement ?",
    a: "Oui, vous pouvez annuler à tout moment depuis les paramètres de votre compte. L'annulation prend effet à la fin de la période de facturation en cours.",
  },
  {
    q: "Mes fichiers audio sont-ils sécurisés ?",
    a: "Vos fichiers sont stockés de manière sécurisée et chiffrée. Les fichiers audio sont automatiquement supprimés après 30 jours. Consultez notre politique de confidentialité pour plus de détails.",
  },
  {
    q: "Comment partager sur le Fil d'actualité ?",
    a: "Après avoir généré votre vidéo, cliquez sur « Partager sur le Fil » dans l'étape finale de création. Votre vidéo apparaîtra sur le fil public LyricWave visible par toute la communauté.",
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Aide & Support</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black mb-2">
            Comment pouvons-nous <span className="gradient-text">vous aider ?</span>
          </h1>
          <p className="text-muted-foreground mb-12 text-base">
            Notre équipe est disponible 7j/7 pour vous accompagner. / Our team is available 24/7 to help you.
          </p>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              {
                icon: MessageCircle,
                title: "Chat en direct",
                desc: "Réponse en moins de 5 min",
                badge: "En ligne",
                color: "primary",
              },
              {
                icon: Mail,
                title: "Email",
                desc: "support@lyricwave.app",
                badge: "< 24h",
                color: "secondary",
              },
              {
                icon: Book,
                title: "Documentation",
                desc: "Guides et tutoriels",
                badge: "Gratuit",
                color: "accent",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ scale: 1.02 }}
                  className="glass border border-border/40 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:border-primary/40 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    card.color === "primary" ? "bg-primary/20 text-primary" :
                    card.color === "secondary" ? "bg-secondary/20 text-secondary" :
                    "bg-accent/20 text-accent"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold">{card.title}</p>
                    <p className="text-xs text-muted-foreground">{card.desc}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                    card.color === "primary" ? "bg-primary/20 text-primary" :
                    card.color === "secondary" ? "bg-secondary/20 text-secondary" :
                    "bg-accent/20 text-accent"
                  }`}>
                    {card.badge}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mb-14">
            <h2 className="font-heading text-2xl font-black mb-6">
              Questions <span className="gradient-text">Fréquentes</span>
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="glass border border-border/40 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left group"
                  >
                    <span className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors pr-4">
                      {faq.q}
                    </span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 sm:px-5 pb-4 sm:pb-5"
                    >
                      <p className="text-muted-foreground text-sm leading-relaxed border-t border-border/30 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="glass border border-border/40 rounded-2xl p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-black mb-2">
              Envoyer un <span className="gradient-text">Message</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Vous n'avez pas trouvé la réponse ? Écrivez-nous directement. / Didn't find your answer? Write to us directly.
            </p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-10"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold">Message envoyé !</h3>
                <p className="text-muted-foreground text-sm text-center">
                  Nous vous répondrons dans les 24 heures. Merci de nous faire confiance ! 🎵
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Nom</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Sujet</label>
                  <input
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Décrivez votre problème en détail..."
                    className="w-full bg-background/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/40 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 font-semibold gap-2 w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  Envoyer le Message
                </Button>
              </form>
            )}
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">Conditions d'utilisation</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Politique de confidentialité</Link>
            <span>·</span>
            <Link to="/feed" className="hover:text-foreground transition-colors">Fil d'actualité</Link>
            <span>·</span>
            <Link to="/create" className="hover:text-primary transition-colors font-semibold">Créer une vidéo</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Support;
