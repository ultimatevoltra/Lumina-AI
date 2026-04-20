import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, Flame, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState, VALID_COUPON } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/ month",
    icon: Zap,
    color: "from-slate-500 to-slate-400",
    border: "border-white/10",
    glow: "",
    badge: null,
    points: "250,000",
    features: [
      "250k points per month",
      "3 free models (Photo)",
      "6 free models (Video)",
      "Gallery with 50 saves",
      "Standard generation speed",
      "Watermark-free output",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/ month",
    icon: Star,
    color: "from-primary to-blue-500",
    border: "border-primary/40",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]",
    badge: null,
    points: "2,000,000",
    features: [
      "2M points per month",
      "All 6 photo models unlocked",
      "All 7 video models unlocked",
      "Unlimited gallery saves",
      "Priority generation queue",
      "HD output (1024×1024)",
      "Email support",
    ],
    cta: "Get Pro",
    disabled: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    period: "/ month",
    icon: Crown,
    color: "from-secondary to-pink-400",
    border: "border-secondary/40",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.25)]",
    badge: "Popular",
    points: "5,000,000",
    features: [
      "5M points per month",
      "All models + early access",
      "Ultra HD output (2048×2048)",
      "Batch generation (4 at once)",
      "Custom style presets",
      "Priority support",
      "API access (100 req/day)",
    ],
    cta: "Get Premium",
    disabled: false,
  },
  {
    id: "max",
    name: "Max",
    price: "$39.99",
    period: "/ month",
    icon: Flame,
    color: "from-orange-500 to-amber-400",
    border: "border-orange-500/40",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.2)]",
    badge: null,
    points: "15,000,000",
    features: [
      "15M points per month",
      "All Premium features",
      "4K video generation",
      "Advanced prompt controls",
      "Batch generation (10 at once)",
      "API access (1000 req/day)",
      "Dedicated support channel",
      "Commercial license",
    ],
    cta: "Get Max",
    disabled: false,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$79.99",
    period: "/ month",
    icon: Sparkles,
    color: "from-accent to-emerald-400",
    border: "border-accent/40",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    badge: "Best Value",
    points: "Unlimited",
    features: [
      "Truly unlimited points",
      "All Max features",
      "White-label output",
      "Team seats (up to 5)",
      "Unlimited API access",
      "SLA uptime guarantee",
      "Dedicated account manager",
      "Custom model fine-tuning",
    ],
    cta: "Get Ultra",
    disabled: false,
  },
];

export default function Pricing() {
  const { applyCoupon, couponUnlocked, appliedCoupon } = useAppState();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;
    setApplying(true);
    setTimeout(() => {
      const success = applyCoupon(coupon.trim());
      if (success) {
        toast({ title: "Coupon applied!", description: "You now have unlimited access. Enjoy Lumina AI!" });
        setCoupon("");
      } else {
        toast({ title: "Invalid coupon", description: "The code you entered is not valid.", variant: "destructive" });
      }
      setApplying(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-20 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
          <Crown className="w-4 h-4" />
          Choose your plan
        </div>
        <h1 className="text-5xl font-bold font-heading mb-4">
          Simple, <span className="gradient-text">transparent</span> pricing
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Start free with 250k points per month. Upgrade anytime for more power, more models, and more creative freedom.
        </p>
      </motion.div>

      {/* Coupon redeemed banner */}
      {couponUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center gap-3 text-sm font-medium"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          Coupon <span className="font-mono text-primary">{appliedCoupon}</span> is active — you have unlimited access!
        </motion.div>
      )}

      {/* Plans grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-16">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative glass-card rounded-2xl p-5 border ${plan.border} ${plan.glow} flex flex-col`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-secondary to-primary text-white text-xs font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="mb-1 text-lg font-bold font-heading">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-5">
                <span className="text-primary font-medium">{plan.points}</span> pts/mo
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full text-sm font-semibold ${
                  plan.disabled
                    ? "bg-white/5 text-muted-foreground cursor-default border border-white/10"
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                }`}
                disabled={plan.disabled}
                variant={plan.disabled ? "ghost" : "default"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Coupon code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-md mx-auto glass-card rounded-2xl p-6 border border-white/10 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-lg">Have a coupon code?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your code below to unlock special access.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code..."
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            className="bg-background/50 border-white/10 focus:border-primary font-mono"
            disabled={couponUnlocked}
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={!coupon.trim() || applying || couponUnlocked}
            className="bg-primary hover:bg-primary/90 text-white px-5 shrink-0"
          >
            {applying ? "..." : couponUnlocked ? "Applied" : "Apply"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
