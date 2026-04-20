import { useState } from "react";
import { Link } from "wouter";
import { Sparkles, Tag, Github, Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppState, VALID_COUPON } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const { applyCoupon, couponUnlocked } = useAppState();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    if (!coupon.trim()) return;
    setApplying(true);
    setTimeout(() => {
      const ok = applyCoupon(coupon.trim());
      if (ok) {
        toast({ title: "Coupon applied!", description: "Unlimited access unlocked. Enjoy creating!" });
        setCoupon("");
      } else {
        toast({ title: "Invalid code", description: "That coupon code is not recognized.", variant: "destructive" });
      }
      setApplying(false);
    }, 700);
  };

  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-heading font-bold gradient-text">Lumina AI</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered photo and video creation for everyone. Start for free, create endlessly.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: "Photo Generation", href: "/photo" },
                { label: "Video Generation", href: "/video" },
                { label: "Gallery", href: "/gallery" },
                { label: "Pricing", href: "/pricing" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coupon */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Coupon Code
            </h4>
            {couponUnlocked ? (
              <div className="text-xs text-emerald-400 font-medium py-1">
                Code active — unlimited access!
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter code..."
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  className="h-8 text-xs bg-background/50 border-white/10 focus:border-primary font-mono"
                />
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={!coupon.trim() || applying}
                  className="w-full h-7 text-xs bg-primary hover:bg-primary/90 text-white"
                >
                  {applying ? "Checking..." : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lumina AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:rayan.bro.bd@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com/rayan-bro-bd" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://t.me/rayan_bro_bd" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
