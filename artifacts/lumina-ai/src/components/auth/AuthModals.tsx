import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

type AuthModalsProps = {
  isOpen: "login" | "signup" | null;
  onClose: () => void;
  onSwitch: (to: "login" | "signup") => void;
};

export function AuthModals({ isOpen, onClose, onSwitch }: AuthModalsProps) {
  const { setUser } = useAppState();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpen === "signup" && !name) return;
    if (!email || !password) return;

    setUser({
      name: isOpen === "signup" ? name : email.split("@")[0],
      email,
    });

    toast({
      title: isOpen === "signup" ? "Account created!" : "Welcome back!",
      description: "You are now logged in and have unlimited generations.",
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-md glass-card rounded-2xl p-6 pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-white/5"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-heading mb-2">
                  {isOpen === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isOpen === "login"
                    ? "Log in to access unlimited generations."
                    : "Join Lumina AI to unlock your creative potential."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isOpen === "signup" && (
                  <div className="space-y-2">
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Full Name"
                        className="pl-10 bg-background/50 border-white/10 focus:border-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10 bg-background/50 border-white/10 focus:border-primary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white mt-6">
                  {isOpen === "login" ? "Log In" : "Sign Up"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isOpen === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => onSwitch("signup")}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Sign up
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
