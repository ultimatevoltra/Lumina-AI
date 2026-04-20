import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Users, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLES = [
  {
    title: "Senior ML Engineer",
    department: "AI Research",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    color: "from-primary to-blue-500",
  },
  {
    title: "Frontend Engineer (React/TypeScript)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    level: "Mid–Senior",
    color: "from-secondary to-pink-400",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    level: "Mid–Senior",
    color: "from-accent to-cyan-400",
  },
  {
    title: "DevOps / Platform Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    color: "from-orange-500 to-amber-400",
  },
  {
    title: "Content & Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    color: "from-emerald-500 to-teal-400",
  },
  {
    title: "AI Safety Researcher",
    department: "AI Research",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    color: "from-violet-500 to-purple-400",
  },
];

const PERKS = [
  { icon: Zap, title: "Remote-First", desc: "Work from anywhere in the world, on your schedule." },
  { icon: Heart, title: "Health & Wellness", desc: "Full health insurance and a $500 annual wellness budget." },
  { icon: Users, title: "Inclusive Culture", desc: "Diverse team, open communication, no corporate hierarchy." },
  { icon: Briefcase, title: "Equity Package", desc: "Meaningful equity so you own a piece of what we're building." },
];

export default function Careers() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-sm font-medium text-secondary mb-4">
          <Briefcase className="w-4 h-4" />
          We're hiring
        </div>
        <h1 className="text-5xl font-bold font-heading mb-4">
          Build the future of <span className="gradient-text">creative AI</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We're a small, ambitious team building tools that give everyone the power to create. Join us and help shape what generative AI looks like for millions of creators.
        </p>
      </motion.div>

      {/* Perks */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {PERKS.map((perk, i) => {
          const Icon = perk.icon;
          return (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5 border border-white/5 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{perk.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Open roles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold font-heading mb-6">Open Positions</h2>
        <div className="space-y-3">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shrink-0`}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{role.title}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{role.department}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{role.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />{role.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                      {role.level}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-all"
              >
                Apply <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-center text-sm text-muted-foreground"
      >
        Don't see a role that fits?{" "}
        <a href="mailto:careers@lumina.ai" className="text-primary hover:underline font-medium">
          Send us your CV
        </a>{" "}
        and we'll keep you in mind for future openings.
      </motion.div>
    </div>
  );
}
