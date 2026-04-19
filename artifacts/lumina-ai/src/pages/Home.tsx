import { motion } from "framer-motion";
import { Link } from "wouter";
import { Sparkles, Image as ImageIcon, Film, FolderOpen, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState, FREE_POINTS_PER_MONTH, PHOTO_POINT_COST, VIDEO_POINT_COST } from "@/hooks/use-local-state";

const FEATURES = [
  {
    icon: Zap,
    title: "250k Points Free",
    description: `Every month you get ${(FREE_POINTS_PER_MONTH / 1000).toLocaleString()}k points. Each image uses ${PHOTO_POINT_COST / 1000}k points — that's up to 250 photos free.`,
    gradient: "from-primary to-primary/50",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    icon: Shield,
    title: "Safe Generation",
    description: "All content is filtered and moderated to ensure a safe creative environment for everyone.",
    gradient: "from-emerald-500 to-emerald-500/50",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: Clock,
    title: "Monthly Reset",
    description: "Points reset every month automatically. Sign in for completely unlimited generations with no caps.",
    gradient: "from-accent to-accent/50",
    glow: "rgba(6,182,212,0.3)",
  },
];

export default function Home() {
  const { user, history } = useAppState();

  return (
    <div className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lumina 2.5 Pro is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold font-heading tracking-tight leading-[1.05]"
        >
          Create with{" "}
          <span className="gradient-text">Lumina AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Transform your words into stunning AI-generated photos and cinematic videos.
          {user ? " Welcome back — your generations are unlimited." : ` Free users get ${(FREE_POINTS_PER_MONTH / 1000).toLocaleString()}k points every month.`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Link href="/photo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 h-12 text-base font-semibold shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Generate Photos
            </Button>
          </Link>
          <Link href="/video">
            <Button
              size="lg"
              variant="outline"
              className="border-white/15 hover:bg-white/5 px-8 h-12 text-base font-semibold"
            >
              <Film className="w-5 h-5 mr-2" />
              Generate Videos
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-8 pt-4"
        >
          <div className="text-center">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Models</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold">10M+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Creations</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</div>
          </div>
        </motion.div>
      </div>

      {/* 3 Quick Access Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid md:grid-cols-3 gap-6 mb-20"
      >
        <Link href="/photo">
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Photo Generation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Turn text into stunning, high-resolution AI photos. Choose from 6 models including Stable XL, DALL·E 3, and Midjourney.
            </p>
            <div className="mt-4 text-xs text-primary font-medium">
              {PHOTO_POINT_COST.toLocaleString()} pts per image →
            </div>
          </div>
        </Link>

        <Link href="/video">
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-secondary/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all">
              <Film className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Video Generation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bring your imagination to life with cinematic AI-generated videos. Powered by Lumina 2.5 Pro, Runway, Pika, and more.
            </p>
            <div className="mt-4 text-xs text-secondary font-medium">
              {VIDEO_POINT_COST.toLocaleString()} pts per video →
            </div>
          </div>
        </Link>

        <Link href="/gallery">
          <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              <FolderOpen className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Gallery</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All your creations saved in one place. Browse, download, and manage your photos and videos with smart filtering.
            </p>
            <div className="mt-4 text-xs text-accent font-medium">
              {history.length} creation{history.length !== 1 ? "s" : ""} saved →
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold font-heading text-center mb-10">
          Everything you need to create
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/5"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4`}
                  style={{ boxShadow: `0 0 15px ${feat.glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
