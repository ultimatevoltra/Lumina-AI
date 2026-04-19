import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Lock, Download, Loader2, Zap, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState, VIDEO_POINT_COST, FREE_POINTS_PER_MONTH } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

const VIDEO_MODELS = [
  { id: "lumina-2.5", name: "Lumina 2.5 Pro", tag: "Best Quality", pro: false },
  { id: "runway-gen2", name: "Runway Gen-2", tag: "Cinematic", pro: false },
  { id: "pika-labs", name: "Pika Labs", tag: "Creative", pro: false },
  { id: "stable-video", name: "Stable Video", tag: "Open Source", pro: false },
  { id: "haiper", name: "Haiper", tag: "Realistic", pro: false },
  { id: "ltx-studio", name: "LTX Studio", tag: "Storytelling", pro: false },
  { id: "sora", name: "Sora", tag: "Pro Only", pro: true },
];

const LOADING_MESSAGES = [
  "Initializing video model...",
  "Analyzing your prompt...",
  "Generating key frames...",
  "Rendering motion sequences...",
  "Applying cinematic effects...",
  "Finalizing your video...",
];

export default function VideoGeneration() {
  const { user, addHistory, spendPoints, canGenerate, pointsBalance } = useAppState();
  const { toast } = useToast();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(VIDEO_MODELS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleModelClick = (m: (typeof VIDEO_MODELS)[0]) => {
    if (m.pro && !user) {
      toast({ title: "Pro Model", description: "Sign in to unlock this model.", variant: "destructive" });
      return;
    }
    setModel(m.id);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!canGenerate(VIDEO_POINT_COST)) {
      toast({
        title: "Not enough points",
        description: `Videos cost ${VIDEO_POINT_COST.toLocaleString()} points. Sign in for unlimited access.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setLoadingStep(0);
    setProgress(0);

    const spent = spendPoints(VIDEO_POINT_COST);
    if (!spent) {
      setIsGenerating(false);
      return;
    }

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        const next = prev + 1;
        if (next >= LOADING_MESSAGES.length) {
          clearInterval(stepInterval);
          return prev;
        }
        return next;
      });
      setProgress((prev) => Math.min(prev + 15, 90));
    }, 5000);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json() as { status?: string; url?: string; error?: string };

      if (data.status === "success" && data.url) {
        setProgress(100);
        setResult(data.url);
        addHistory({ type: "video", prompt, model: VIDEO_MODELS.find(m => m.id === model)?.name ?? "Unknown", url: data.url });
        toast({ title: "Video generated!", description: "Your cinematic creation is ready." });
      } else {
        throw new Error(data.error ?? "Unknown error");
      }
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message.includes("aborted") || message.includes("Timeout")) {
        toast({
          title: "Generation timeout",
          description: "Video generation took too long. Try a shorter, simpler prompt.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate video. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `lumina-video-${Date.now()}.mp4`;
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Video Generation</h1>
            <p className="text-muted-foreground text-sm">Bring your imagination to life with AI-generated cinematic videos</p>
          </div>
        </div>

        {!user && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
            <Zap className="w-3.5 h-3.5 text-secondary" />
            <span>
              {pointsBalance === Infinity
                ? "Unlimited"
                : `${typeof pointsBalance === "number" ? pointsBalance.toLocaleString() : "∞"} / ${FREE_POINTS_PER_MONTH.toLocaleString()}`}{" "}
              points remaining — each video costs {VIDEO_POINT_COST.toLocaleString()} pts
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
              placeholder="A serene ocean wave crashing on a tropical beach at golden hour, slow motion cinematic..."
              className="min-h-[140px] bg-background/50 border-white/10 focus:border-secondary resize-none text-base leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
              }}
            />
            <p className="text-xs text-muted-foreground/50 mt-2">Press Ctrl+Enter to generate · Videos take ~30 seconds</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <label className="text-sm font-medium text-muted-foreground block mb-4">Select Model</label>
            <div className="grid grid-cols-3 gap-2">
              {VIDEO_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModelClick(m)}
                  className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                    model === m.id
                      ? "bg-secondary/20 border-secondary shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                      : "bg-background/30 border-white/5 hover:bg-white/5 hover:border-white/10"
                  } ${m.pro && !user ? "opacity-50" : ""}`}
                >
                  <div className="text-xs font-semibold leading-tight mb-0.5">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.tag}</div>
                  {m.pro && !user && (
                    <Lock className="w-2.5 h-2.5 absolute top-2 right-2 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-13 text-base font-semibold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Rendering...</>
            ) : (
              <><Video className="w-5 h-5 mr-2" />Generate Video</>
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
                <video
                  src={result}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleDownload}
                    className="w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-sm"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-background/50 p-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-secondary/20 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full border-2 border-secondary/50 flex items-center justify-center relative">
                    <Film className="w-8 h-8 text-secondary animate-pulse" />
                  </div>
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-medium text-secondary animate-pulse mb-1">
                    {LOADING_MESSAGES[loadingStep]}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">Please wait — this takes ~30 seconds</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-secondary to-accent rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-background/20 text-muted-foreground/30">
                <Film className="w-16 h-16 opacity-20" />
                <p className="text-sm">Your video will appear here</p>
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
    </div>
  );
}
