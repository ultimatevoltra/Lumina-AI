import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, LogOut, Menu, X, Zap, History, Info, Mail, BookOpen, Briefcase, DollarSign, ChevronDown, User, Calendar } from "lucide-react";
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
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

function getCurrentMonthLabel() {
  return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function Navbar({ onOpenLogin, onOpenSignup }: NavbarProps) {
  const [location] = useLocation();
  const { user, setUser, pointsBalance, pointsPercent, pointsUsed, isUnlimited, couponUnlocked } = useAppState();
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    toast({ title: "Logged out", description: "See you next time!" });
  };

  // Close account popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const planLabel = user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : (isUnlimited ? "Coupon" : "Free");

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
            {!isUnlimited && (
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
              <div className="flex items-center gap-2 relative" ref={accountRef}>
                {/* Clickable account button */}
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    {user.avatar && <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />}
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium leading-none">{user.name.split(" ")[0]}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{planLabel}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Account details popup */}
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-64 glass-card rounded-2xl border border-border/60 shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-border/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border border-primary/30">
                            {user.avatar && <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />}
                            <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-3.5 h-3.5" />
                            Plan
                          </div>
                          <span className="font-semibold text-primary capitalize">{planLabel}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            Billing cycle
                          </div>
                          <span className="font-medium">{getCurrentMonthLabel()}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="w-3.5 h-3.5" />
                            Points limit
                          </div>
                          <span className="font-medium text-emerald-400">Unlimited</span>
                        </div>

                        {user.provider && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Provider</span>
                            <span className="capitalize font-medium">{user.provider}</span>
                          </div>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => { handleLogout(); setAccountOpen(false); }}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

            {/* Hamburger */}
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
        {!isUnlimited && typeof pointsBalance === "number" && isFinite(pointsBalance) && pointsBalance < PHOTO_POINT_COST * 5 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:block absolute top-full right-16 mt-2 px-3 py-2 glass-card rounded-xl text-xs text-muted-foreground border border-destructive/20 z-30"
          >
            <span className="text-destructive font-medium">Low points!</span> Sign in for unlimited access.
          </motion.div>
        )}
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 z-50 bg-background/95 border-l border-border/60 backdrop-blur-xl flex flex-col shadow-2xl"
            >
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

              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {DRAWER_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = location === link.href;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {link.label}
                        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </Link>
                  );
                })}
              </nav>

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
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setDrawerOpen(false); }}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    >
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
