import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState, FREE_POINTS_PER_MONTH } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

type AuthModalsProps = {
  isOpen: "login" | "signup" | null;
  onClose: () => void;
  onSwitch: (to: "login" | "signup") => void;
};

// Mock Google profiles used for demo Google sign-in
const MOCK_GOOGLE_PROFILES = [
  { name: "Alex Johnson", email: "alex.johnson@gmail.com", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=alex" },
  { name: "Jordan Smith", email: "jordan.smith@gmail.com", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=jordan" },
  { name: "Taylor Chen", email: "taylor.chen@gmail.com", avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=taylor" },
];

export function AuthModals({ isOpen, onClose, onSwitch }: AuthModalsProps) {
  const { setUser } = useAppState();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpen === "signup" && !name.trim()) return;
    if (!email || !password) return;

    setUser({
      name: isOpen === "signup" ? name.trim() : email.split("@")[0],
      email,
      provider: "email",
    });

    toast({
      title: isOpen === "signup" ? "Account created!" : "Welcome back!",
      description: "Unlimited generations unlocked.",
    });

    setName("");
    setEmail("");
    setPassword("");
    onClose();
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);

    // Simulate Google OAuth popup delay
    setTimeout(() => {
      const profile = MOCK_GOOGLE_PROFILES[Math.floor(Math.random() * MOCK_GOOGLE_PROFILES.length)];
      setUser({
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        provider: "google",
      });

      toast({
        title: "Signed in with Google!",
        description: `Welcome, ${profile.name}. Unlimited generations unlocked.`,
      });

      setGoogleLoading(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-md glass-card rounded-2xl p-8 pointer-events-auto relative overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

              {/* Close */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-white/5 h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-1">
                  {isOpen === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isOpen === "login"
                    ? "Log in to unlock unlimited generations."
                    : `Sign up and get ${(FREE_POINTS_PER_MONTH / 1000).toLocaleString()}k free points every month.`}
                </p>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium mb-4 disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {googleLoading ? "Connecting to Google..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {isOpen === "signup" && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Full Name"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary h-11"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10 bg-background/50 border-white/10 focus:border-primary h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-background/50 border-white/10 focus:border-primary h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
                >
                  {isOpen === "login" ? "Log In" : "Create Account"}
                </Button>
              </form>

              {/* Switch */}
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {isOpen === "login" ? (
                  <>
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => onSwitch("signup")}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => onSwitch("login")}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
