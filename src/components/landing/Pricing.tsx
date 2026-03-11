import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    color: "muted",
    cta: "Start Free",
    ctaVariant: "outline" as const,
    features: [
      "3 videos per month",
      "TikTok & YouTube Shorts",
      "Basic templates",
      "Auto-sync",
      "LyricWave watermark",
      "720p export",
    ],
    notIncluded: ["All formats", "Premium templates", "No watermark"],
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$9.99",
    period: "/month",
    description: "For serious creators",
    color: "primary",
    popular: true,
    cta: "Get Pro",
    ctaVariant: "default" as const,
    features: [
      "50 videos per month",
      "All 4 export formats",
      "Premium templates",
      "Auto & manual sync",
      "No watermark",
      "1080p export",
      "Karaoke word-highlight",
      "Priority support",
    ],
    notIncluded: [],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "$49.99",
    period: "/month",
    description: "For labels & agencies",
    color: "secondary",
    cta: "Contact Us",
    ctaVariant: "outline" as const,
    features: [
      "Unlimited videos",
      "All formats & quality",
      "Custom templates",
      "Custom branding",
      "API access",
      "Bulk generation",
      "Team collaboration",
      "Dedicated support",
    ],
    notIncluded: [],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="font-heading text-4xl md:text-5xl font-black mt-2 mb-4">
            Simple,{" "}
            <span className="gradient-text">Transparent</span>{" "}
            Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start for free. Upgrade when you're ready to scale your music content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative glass rounded-2xl p-8 border flex flex-col ${
                  plan.popular
                    ? "border-primary/60 glow-primary scale-105"
                    : "border-border/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular ? "bg-primary/20 text-primary" :
                    plan.color === "secondary" ? "bg-secondary/20 text-secondary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-lg">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">{plan.description}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-heading text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/create">
                  <Button
                    className={`w-full font-semibold ${
                      plan.popular
                        ? "bg-gradient-primary text-primary-foreground border-0 hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
