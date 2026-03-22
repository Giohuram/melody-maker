import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import LyricWaveLoader from "@/components/ui/LyricWaveLoader";

const section = (title: string, content: string | React.ReactNode) => (
  <div className="mb-8">
    <h2 className="font-heading text-xl font-bold mb-3 gradient-text">{title}</h2>
    <div className="text-muted-foreground leading-relaxed text-sm sm:text-base">{content}</div>
  </div>
);

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 container mx-auto px-4 sm:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Légal</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black mb-2">
            Conditions <span className="gradient-text">d'Utilisation</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-10">
            Dernière mise à jour : 12 mars 2025 · <span className="text-foreground/60">Terms of Use (English below)</span>
          </p>

          <div className="glass border border-border/40 rounded-2xl p-6 sm:p-8 mb-8">
            {section("1. Acceptation des conditions", (
              <p>
                En accédant à LyricWave et en utilisant nos services, vous acceptez d'être lié par les présentes Conditions d'Utilisation.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme. LyricWave est exploité par Giovanni Huram.
              </p>
            ))}
            {section("2. Description du service", (
              <p>
                LyricWave est une plateforme web permettant aux artistes, créateurs de contenu et labels musicaux de créer
                des vidéos lyrics professionnelles avec synchronisation automatique ou manuelle, exportables pour TikTok,
                YouTube Shorts, Instagram Reels et YouTube.
              </p>
            ))}
            {section("3. Création de compte", (
              <ul className="list-disc list-inside space-y-2">
                <li>Vous devez avoir au moins 13 ans pour utiliser LyricWave.</li>
                <li>Vous êtes responsable de la confidentialité de votre mot de passe.</li>
                <li>Toute activité réalisée sous votre compte vous est imputable.</li>
                <li>Vous devez fournir des informations exactes lors de l'inscription.</li>
              </ul>
            ))}
            {section("4. Contenu & droits musicaux", (
              <ul className="list-disc list-inside space-y-2">
                <li>Vous êtes seul responsable du contenu que vous uploadez (audio, paroles, images).</li>
                <li>Vous déclarez détenir tous les droits nécessaires sur les œuvres musicales utilisées.</li>
                <li>LyricWave n'assume aucune responsabilité en cas de violation des droits d'auteur.</li>
                <li>Nous nous réservons le droit de supprimer tout contenu signalé comme illicite.</li>
              </ul>
            ))}
            {section("5. Utilisation acceptable", (
              <p>
                Il est interdit d'utiliser LyricWave pour diffuser du contenu haineux, illégal, obscène ou portant atteinte
                à des tiers. Tout usage automatisé non autorisé (bots, scraping) est strictement prohibé.
              </p>
            ))}
            {section("6. Plans & abonnements", (
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Gratuit :</strong> 3 vidéos/mois avec filigrane LyricWave.</li>
                <li><strong className="text-foreground">Pro ($9.99/mois) :</strong> 50 vidéos/mois, sans filigrane, formats premium.</li>
                <li><strong className="text-foreground">Entreprise ($49.99/mois) :</strong> vidéos illimitées, API, branding personnalisé.</li>
                <li>Les abonnements sont renouvelés automatiquement. Annulation possible à tout moment.</li>
              </ul>
            ))}
            {section("7. Limitation de responsabilité", (
              <p>
                LyricWave est fourni "en l'état". Nous ne garantissons pas une disponibilité continue du service.
                Notre responsabilité est limitée au montant payé au cours des 30 derniers jours.
              </p>
            ))}
            {section("8. Modifications", (
              <p>
                LyricWave se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés
                par email ou via l'interface de la plateforme.
              </p>
            ))}
            {section("9. Contact", (
              <p>
                Pour toute question relative aux conditions d'utilisation, contactez-nous via la page{" "}
                <Link to="/support" className="text-primary hover:underline">Support</Link>.
              </p>
            ))}
          </div>

          {/* English version */}
          <div className="glass border border-border/40 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">English Version</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            {section("1. Acceptance of Terms", (
              <p>By accessing and using LyricWave, you agree to be bound by these Terms of Use. If you do not accept these terms, please do not use the platform. LyricWave is operated by Giovanni Huram.</p>
            ))}
            {section("2. Service Description", (
              <p>LyricWave is a web platform enabling artists, content creators and music labels to create professional lyrics videos with automatic or manual sync, exportable for TikTok, YouTube Shorts, Instagram Reels and YouTube.</p>
            ))}
            {section("3. Music Content & Rights", (
              <ul className="list-disc list-inside space-y-2">
                <li>You are solely responsible for the content you upload (audio, lyrics, images).</li>
                <li>You declare you hold all necessary rights over the musical works used.</li>
                <li>LyricWave assumes no liability for copyright infringement.</li>
              </ul>
            ))}
            {section("4. Contact", (
              <p>For questions about these terms, contact us via the <Link to="/support" className="text-primary hover:underline">Support</Link> page.</p>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfUse;
