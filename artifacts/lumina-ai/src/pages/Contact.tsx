import { motion } from "framer-motion";
import { Mail, Facebook, Send } from "lucide-react";

// WhatsApp icon as SVG path
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
      sublabel: "@ProRayhan",
      href: "https://t.me/ProRayhan",
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      sublabel: "+88 01823-160723",
      href: "https://wa.me/8801823160723",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: Facebook,
      label: "Facebook",
      sublabel: "Visit profile",
      href: "https://www.facebook.com/profile.php?id=61578057322919",
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
            <span className="text-4xl font-bold font-heading text-white">PR</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold font-heading mb-2">ProRayhan</h1>
        <p className="text-primary font-medium mb-8">Founder & Lead Developer</p>

        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          Passionate about building futuristic, highly crafted web experiences.
          Have a question about Lumina AI or want to collaborate? Get in touch below.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.bg} ${link.color} mr-4 group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.sublabel}</div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
