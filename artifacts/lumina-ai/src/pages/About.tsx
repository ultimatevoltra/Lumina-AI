import { motion } from "framer-motion";
import { Rocket, Shield, Zap, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Rocket,
      title: "Our Mission",
      subtitle: "Democratizing Creativity",
      description: "We believe everyone has a unique vision. Lumina AI breaks down the technical barriers between your imagination and reality, empowering you to create without limits.",
      color: "from-primary to-blue-500",
    },
    {
      icon: Shield,
      title: "Safety First",
      subtitle: "Responsible AI Generation",
      description: "Our platform is built with robust safety guardrails. We continuously monitor and filter content to ensure a safe, respectful environment for all creators.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      subtitle: "Optimized Infrastructure",
      description: "Powered by state-of-the-art GPU clusters, our generation pipelines deliver stunning results in seconds, not minutes. Keep your creative flow uninterrupted.",
      color: "from-secondary to-orange-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      subtitle: "Built with Creators",
      description: "Lumina AI evolves based on the feedback of our vibrant community. Share your creations, learn from others, and shape the future of the platform together.",
      color: "from-accent to-cyan-300",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold font-heading mb-6"
        >
          About <span className="gradient-text">Lumina AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          Lumina AI is a futuristic creative studio designed for the next generation of digital artists. 
          We combine cutting-edge generative models with an intuitive, electric interface to make 
          creation feel magical again.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg mb-6`}>
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-foreground mb-1">{feature.title}</h3>
            <div className="text-sm font-medium text-primary mb-4">{feature.subtitle}</div>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
