import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, LogOut, Menu, X, Zap, History, Info, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState, FREE_POINTS_PER_MONTH, PHOTO_POINT_COST } from "@/hooks/use-local-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

type NavbarProps = {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
};

const MAIN_LINKS = [
  { href: "/photo", label: "Photo" },
  { href: "/video", label: "Video" },
  { href: "/gallery", label: "Gallery" },
];

const DRAWER_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: History },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar({ onOpenLogin, onOpenSignup }: NavbarProps) {
  const [location] = useLocation();
  const { user, setUser, pointsBalance, pointsPercent } = useAppState();
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    toast({ title: "Logged out", description: "See you next time!" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.8)] transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight gradient-text">
              Lumina AI
            </span>
          </Link>

          {/* Main Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {MAIN_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-t-full" />
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Points badge for free users */}
            {!user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">
                    {typeof pointsBalance === "number" && isFinite(pointsBalance)
                      ? `${(pointsBalance / 1000).toFixed(0)}k`
                      : "∞"}
                  </span>
                  <span className="text-muted-foreground">pts</span>
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                      style={{ width: `${Math.max(0, 100 - pointsPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  {user.avatar && <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium leading-none">{user.name}</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Unlimited
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground hover:bg-white/5 h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex border-white/10 hover:bg-white/5 text-sm"
                  onClick={onOpenLogin}
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all text-sm"
                  onClick={onOpenSignup}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Hamburger — always visible, top-right */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ml-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile bottom nav strip */}
        <div className="md:hidden border-t border-border/30 flex overflow-x-auto">
          {MAIN_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="flex-1">
              <div
                className={`px-4 py-2.5 text-xs font-medium text-center transition-colors ${
                  location === link.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Low-points warning */}
        {!user && typeof pointsBalance === "number" && isFinite(pointsBalance) && pointsBalance < PHOTO_POINT_COST * 5 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:block absolute top-full right-16 mt-2 px-3 py-2 glass-card rounded-xl text-xs text-muted-foreground border border-destructive/20 z-30"
          >
            <span className="text-destructive font-medium">Low points!</span> Sign in for unlimited access.
          </motion.div>
        )}
      </header>

      {/* Hamburger Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 z-50 bg-background/95 border-l border-border/60 backdrop-blur-xl flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-heading font-bold gradient-text">Menu</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {DRAWER_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = location === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {link.label}
                        {active && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer footer — user info or sign-in */}
              <div className="px-4 py-5 border-t border-border/40">
                {user ? (
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-9 w-9 border border-primary/30 shrink-0">
                      {user.avatar && <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-xs text-emerald-400">Unlimited access</div>
                    </div>
                    <button onClick={() => { handleLogout(); setDrawerOpen(false); }} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90" onClick={() => { onOpenSignup(); setDrawerOpen(false); }}>
                      Sign Up Free
                    </Button>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={() => { onOpenLogin(); setDrawerOpen(false); }}>
                      Log In
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
