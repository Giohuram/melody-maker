import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const section = (title: string, content: React.ReactNode) => (
  <div className="mb-8">
    <h2 className="font-heading text-xl font-bold mb-3 gradient-text">{title}</h2>
    <div className="text-muted-foreground leading-relaxed text-sm sm:text-base">{content}</div>
  </div>
);

const PrivacyPolicy = () => {
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
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Légal</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black mb-2">
            Politique de <span className="gradient-text">Confidentialité</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-10">
            Dernière mise à jour : 12 mars 2025 · <span className="text-foreground/60">Privacy Policy (English below)</span>
          </p>

          <div className="glass border border-border/40 rounded-2xl p-6 sm:p-8 mb-8">
            {section("1. Données collectées", (
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Données de compte :</strong> nom, adresse email, mot de passe (hashé).</li>
                <li><strong className="text-foreground">Données d'utilisation :</strong> projets créés, formats utilisés, templates sélectionnés.</li>
                <li><strong className="text-foreground">Fichiers uploadés :</strong> fichiers audio, images de couverture (temporairement stockés).</li>
                <li><strong className="text-foreground">Données techniques :</strong> adresse IP, type de navigateur, pages visitées.</li>
              </ul>
            ))}
            {section("2. Utilisation des données", (
              <ul className="list-disc list-inside space-y-2">
                <li>Fournir et améliorer nos services de génération de vidéos lyrics.</li>
                <li>Envoyer des communications liées au compte (confirmation, reset de mot de passe).</li>
                <li>Analyser l'utilisation de la plateforme pour en améliorer les performances.</li>
                <li>Respecter nos obligations légales.</li>
              </ul>
            ))}
            {section("3. Partage des données", (
              <p>
                Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers à des fins
                commerciales. Vos données peuvent être partagées uniquement avec nos prestataires techniques
                (hébergement, paiement) dans la stricte mesure nécessaire à la fourniture du service.
              </p>
            ))}
            {section("4. Cookies", (
              <p>
                LyricWave utilise des cookies essentiels pour le fonctionnement de la plateforme (session, authentification)
                ainsi que des cookies analytiques anonymisés (Plausible Analytics). Vous pouvez refuser les cookies
                non essentiels via les paramètres de votre navigateur.
              </p>
            ))}
            {section("5. Conservation des données", (
              <ul className="list-disc list-inside space-y-2">
                <li>Les données de compte sont conservées tant que le compte est actif.</li>
                <li>Les fichiers audio sont supprimés automatiquement après 30 jours.</li>
                <li>Les vidéos générées sont conservées 90 jours après leur création.</li>
                <li>En cas de suppression du compte, toutes les données sont effacées sous 30 jours.</li>
              </ul>
            ))}
            {section("6. Vos droits (RGPD)", (
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Droit d'accès :</strong> demander une copie de vos données.</li>
                <li><strong className="text-foreground">Droit de rectification :</strong> corriger vos données inexactes.</li>
                <li><strong className="text-foreground">Droit à l'effacement :</strong> supprimer votre compte et vos données.</li>
                <li><strong className="text-foreground">Droit à la portabilité :</strong> exporter vos données au format JSON.</li>
              </ul>
            ))}
            {section("7. Sécurité", (
              <p>
                Nous protégeons vos données via le chiffrement HTTPS, le hachage des mots de passe (bcrypt),
                des tokens JWT à durée limitée et un accès restreint aux serveurs de production.
              </p>
            ))}
            {section("8. Contact DPO", (
              <p>
                Pour exercer vos droits ou signaler un incident, contactez-nous via la page{" "}
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
            {section("1. Data We Collect", (
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Account data:</strong> name, email address, hashed password.</li>
                <li><strong className="text-foreground">Usage data:</strong> projects created, formats used, templates selected.</li>
                <li><strong className="text-foreground">Uploaded files:</strong> audio files, cover images (temporarily stored).</li>
              </ul>
            ))}
            {section("2. Your Rights (GDPR)", (
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Right of access:</strong> request a copy of your data.</li>
                <li><strong className="text-foreground">Right to erasure:</strong> delete your account and data.</li>
                <li><strong className="text-foreground">Data portability:</strong> export your data in JSON format.</li>
              </ul>
            ))}
            {section("3. Contact", (
              <p>To exercise your rights, contact us via the <Link to="/support" className="text-primary hover:underline">Support</Link> page.</p>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
