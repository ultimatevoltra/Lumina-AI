import { motion } from "framer-motion";
import { Mail, Github, Facebook, Send } from "lucide-react";

export default function Contact() {
  const links = [
    {
      icon: Mail,
      label: "Email",
      sublabel: "rayan.bro.bd@gmail.com",
      href: "mailto:rayan.bro.bd@gmail.com",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: Send,
      label: "Telegram",
      sublabel: "@rayan_bro_bd",
      href: "https://t.me/rayan_bro_bd",
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      icon: Github,
      label: "GitHub",
      sublabel: "rayan-bro-bd",
      href: "https://github.com/rayan-bro-bd",
      color: "text-white",
      bg: "bg-white/10",
    },
    {
      icon: Facebook,
      label: "Facebook",
      sublabel: "rayan.bro.bd",
      href: "https://facebook.com/rayan.bro.bd",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-primary via-secondary to-accent">
          <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center border-4 border-background">
            <span className="text-4xl font-bold font-heading text-white">RB</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold font-heading mb-2">Rayan Bro</h1>
        <p className="text-primary font-medium mb-8">Founder & Lead Developer</p>

        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          Passionate about building futuristic, highly crafted web experiences. 
          Have a question about Lumina AI or want to collaborate? Get in touch below.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.bg} ${link.color} mr-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">{link.label}</div>
                <div className="text-xs text-muted-foreground">{link.sublabel}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
