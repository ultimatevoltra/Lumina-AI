import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Lock, Download, Share2, Maximize2, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState, PHOTO_POINT_COST, FREE_POINTS_PER_MONTH } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

const PHOTO_MODELS = [
  { id: "pollinations", name: "Pollinations", tag: "Free · Fast", pro: false },
  { id: "stable-xl", name: "Stable XL", tag: "High Quality", pro: false },
  { id: "dalle-3", name: "DALL·E 3", tag: "Creative", pro: false },
  { id: "midjourney-v6", name: "Midjourney V6", tag: "Artistic", pro: true },
  { id: "flux-pro", name: "Flux Pro", tag: "Pro Only", pro: true },
  { id: "ideogram", name: "Ideogram", tag: "Pro Only", pro: true },
];

export default function PhotoGeneration() {
  const { user, addHistory, spendPoints, canGenerate, pointsBalance } = useAppState();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(PHOTO_MODELS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleModelClick = (m: (typeof PHOTO_MODELS)[0]) => {
    if (m.pro && !user) {
      toast({ title: "Pro Model", description: "Sign in to unlock this model.", variant: "destructive" });
      return;
    }
    setModel(m.id);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!canGenerate(PHOTO_POINT_COST)) {
      toast({
        title: "Not enough points",
        description: `You need ${PHOTO_POINT_COST.toLocaleString()} points to generate a photo. Sign in for unlimited access.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    const spent = spendPoints(PHOTO_POINT_COST);
    if (!spent) {
      setIsGenerating(false);
      return;
    }

    try {
      const seed = Math.floor(Math.random() * 999999);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&seed=${seed}&nologo=true&enhance=true`;

      // Pre-load the image
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = imageUrl;
        setTimeout(() => reject(new Error("Timeout")), 30000);
      });

      setResult(imageUrl);
      addHistory({ type: "photo", prompt, model: PHOTO_MODELS.find(m => m.id === model)?.name ?? "Unknown", url: imageUrl });
      toast({ title: "Photo generated!", description: "Your creation has been saved to Gallery." });
    } catch {
      const fallback = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&seed=${Math.floor(Math.random() * 999999)}&nologo=true`;
      setResult(fallback);
      addHistory({ type: "photo", prompt, model: PHOTO_MODELS.find(m => m.id === model)?.name ?? "Unknown", url: fallback });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `lumina-photo-${Date.now()}.jpg`;
    a.target = "_blank";
    a.click();
    toast({ title: "Download started!" });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Photo Generation</h1>
            <p className="text-muted-foreground text-sm">Transform your words into stunning AI-generated images</p>
          </div>
        </div>

        {!user && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>
              {pointsBalance === Infinity
                ? "Unlimited"
                : `${pointsBalance.toLocaleString()} / ${FREE_POINTS_PER_MONTH.toLocaleString()}`}{" "}
              points remaining — each photo costs {PHOTO_POINT_COST.toLocaleString()} pts
            </span>
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-2xl p-6">
            <label className="text-sm font-medium text-muted-foreground block mb-3">Your prompt</label>
            <Textarea
              placeholder="A futuristic cityscape at sunset with flying cars and neon lights reflecting on rain-soaked streets..."
              className="min-h-[140px] bg-background/50 border-white/10 focus:border-primary resize-none text-base leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
              }}
            />
            <p className="text-xs text-muted-foreground/50 mt-2">Press Ctrl+Enter to generate</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <label className="text-sm font-medium text-muted-foreground block mb-4">Select Model</label>
            <div className="grid grid-cols-3 gap-2">
              {PHOTO_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModelClick(m)}
                  className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                    model === m.id
                      ? "bg-primary/20 border-primary shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-background/30 border-white/5 hover:bg-white/5 hover:border-white/10"
                  } ${m.pro && !user ? "opacity-50" : ""}`}
                >
                  <div className="text-xs font-semibold leading-tight mb-0.5">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.tag}</div>
                  {m.pro && !user && (
                    <Lock className="w-2.5 h-2.5 absolute top-2 right-2 text-secondary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-13 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Crafting your image...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />Generate Photo</>
            )}
          </Button>
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="glass-card rounded-2xl overflow-hidden aspect-square relative group">
            {result ? (
              <>
                <img
                  src={result}
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button
                    onClick={handleDownload}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(result); toast({ title: "Link copied!" }); }}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    title="Copy link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-background/50">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-primary/30 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full border-2 border-primary/50 flex items-center justify-center relative">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-primary animate-pulse">Generating your image...</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take 10–20 seconds</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-background/20 text-muted-foreground/30">
                <ImageIcon className="w-16 h-16 opacity-20" />
                <p className="text-sm">Your image will appear here</p>
              </div>
            )}
          </div>

          {result && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mt-3 text-center italic line-clamp-2"
            >
              "{prompt}"
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && result && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <img src={result} alt={prompt} className="max-w-full max-h-full object-contain rounded-xl" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
