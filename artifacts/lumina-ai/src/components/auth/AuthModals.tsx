import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

type AuthModalsProps = {
  isOpen: "login" | "signup" | null;
  onClose: () => void;
  onSwitch: (to: "login" | "signup") => void;
};

type StoredAccount = { name: string; password: string };
type AccountStore = Record<string, StoredAccount>;

function getAccounts(): AccountStore {
  try { return JSON.parse(localStorage.getItem("lumina_accounts") ?? "{}"); } catch { return {}; }
}

function saveAccount(email: string, account: StoredAccount) {
  const store = getAccounts();
  store[email.toLowerCase()] = account;
  localStorage.setItem("lumina_accounts", JSON.stringify(store));
}

export function AuthModals({ isOpen, onClose, onSwitch }: AuthModalsProps) {
  const { setUser } = useAppState();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setName(""); setEmail(""); setPassword(""); setError(""); setShowPass(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) return;

    if (isOpen === "signup") {
      if (!name.trim()) { setError("Please enter your full name."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

      const existing = getAccounts()[email.toLowerCase()];
      if (existing) { setError("An account with this email already exists. Please log in."); return; }

      saveAccount(email, { name: name.trim(), password });
      setUser({ name: name.trim(), email: email.toLowerCase(), provider: "email", plan: "free" });
      toast({ title: "Account created!", description: `Welcome to Lumina AI, ${name.trim().split(" ")[0]}!` });
    } else {
      const account = getAccounts()[email.toLowerCase()];
      if (!account) { setError("No account found with this email. Please sign up first."); return; }
      if (account.password !== password) { setError("Incorrect password. Please try again."); return; }

      setUser({ name: account.name, email: email.toLowerCase(), provider: "email", plan: "free" });
      toast({ title: "Welcome back!", description: `Good to see you, ${account.name.split(" ")[0]}!` });
    }

    reset();
    onClose();
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError("");
    setTimeout(() => {
      // Simulate sign-in with the entered email, or a default
      const signInEmail = email.trim() || "user@gmail.com";
      const stored = getAccounts()[signInEmail.toLowerCase()];
      const displayName = stored?.name ?? signInEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      if (!stored) {
        saveAccount(signInEmail, { name: displayName, password: "__google__" });
      }

      setUser({
        name: stored?.name ?? displayName,
        email: signInEmail.toLowerCase(),
        avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(signInEmail)}`,
        provider: "google",
        plan: "free",
      });

      toast({ title: "Signed in with Google!", description: `Welcome, ${stored?.name ?? displayName}!` });
      setGoogleLoading(false);
      reset();
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-md glass-card rounded-2xl p-8 pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

              <Button
                variant="ghost" size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-white/5 h-8 w-8"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="text-center mb-7">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-1">
                  {isOpen === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isOpen === "login"
                    ? "Log in to access your 250k monthly points."
                    : "Sign up and get 250k points every month."}
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
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {isOpen === "signup" && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Full Name"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary h-11"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
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
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 bg-background/50 border-white/10 focus:border-primary h-11"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-1"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isOpen === "login" ? "Log In" : "Create Account"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {isOpen === "login" ? (
                  <>
                    No account?{" "}
                    <button type="button" onClick={() => { reset(); onSwitch("signup"); }} className="text-primary hover:text-primary/80 font-medium">
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => { reset(); onSwitch("login"); }} className="text-primary hover:text-primary/80 font-medium">
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
