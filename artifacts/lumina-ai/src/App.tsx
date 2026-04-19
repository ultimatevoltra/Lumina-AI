import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Background } from "@/components/layout/Background";
import { Navbar } from "@/components/layout/Navbar";
import { AuthModals } from "@/components/auth/AuthModals";

import PhotoGeneration from "@/pages/PhotoGeneration";
import VideoGeneration from "@/pages/VideoGeneration";
import Gallery from "@/pages/Gallery";
import Home from "@/pages/Home";
import About from "@/pages/About";
import History from "@/pages/History";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/photo" component={PhotoGeneration} />
      <Route path="/video" component={VideoGeneration} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="/history" component={History} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] flex flex-col selection:bg-primary/30 text-foreground">
            <Background />
            <Navbar
              onOpenLogin={() => setAuthModal("login")}
              onOpenSignup={() => setAuthModal("signup")}
            />
            <main className="flex-1 w-full">
              <Router />
            </main>
            <AuthModals
              isOpen={authModal}
              onClose={() => setAuthModal(null)}
              onSwitch={(to) => setAuthModal(to)}
            />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
