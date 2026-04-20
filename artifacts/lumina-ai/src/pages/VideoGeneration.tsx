import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, Lock, Download, Loader2, Zap, Film, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState, VIDEO_POINT_COST, FREE_POINTS_PER_MONTH } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

const VIDEO_MODELS = [
  { id: "lumina-2.5", name: "Lumina 2.5", tag: "Best Quality", pro: false },
  { id: "runway-gen2", name: "Runway Gen-2", tag: "Cinematic", pro: false },
  { id: "pika-labs", name: "Pika Labs", tag: "Creative", pro: false },
  { id: "stable-video", name: "Stable Video", tag: "Open Source", pro: false },
  { id: "haiper", name: "Haiper", tag: "Realistic", pro: false },
  { id: "ltx-studio", name: "LTX Studio", tag: "Storytelling", pro: false },
  { id: "sora", name: "Sora", tag: "Pro Only", pro: true },
];

const LOADING_STEPS = [
  "Initializing video model...",
  "Analyzing your prompt...",
  "Generating key frames...",
  "Rendering motion sequences...",
  "Applying cinematic effects...",
  "Finalizing your video...",
];

const RANDOM_PROMPTS = [
  "A serene ocean wave crashing on a tropical beach at golden hour, slow motion",
  "A time-lapse of a flower blooming in a sunlit meadow, macro photography",
  "A cyberpunk city at night with flying cars and neon rain, cinematic",
  "Lava flowing into the ocean at dusk, creating clouds of steam, epic",
  "An astronaut walking on the surface of Mars, 4K cinematic drone shot",
  "Cherry blossoms falling in a Japanese garden at sunrise, peaceful",
  "A lightning storm over a mountain range, dramatic time-lapse",
  "Underwater coral reef with colorful fish swimming, documentary style",
  "A spaceship launching from Earth, leaving a trail of fire, epic",
  "Northern lights dancing over a snowy forest, long exposure style",
  "A wolf howling at the moon in a dark forest, cinematic 4K",
  "City skyline transitioning from day to night, hyperlapse photography",
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
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [resultFilename, setResultFilename] = useState("lumina-video.mp4");

  const fillRandomPrompt = useCallback(() => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
    toast({ title: "Random prompt loaded!", description: 'Press "Generate Video" or Ctrl+Enter to create.' });
  }, [toast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (textareaFocused) return;
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        fillRandomPrompt();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [textareaFocused, fillRandomPrompt]);

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
    setProgress(5);

    const spent = spendPoints(VIDEO_POINT_COST);
    if (!spent) { setIsGenerating(false); return; }

    // Animate progress while waiting (steps every 12s since polling is 30 attempts × 3s = 90s max)
    const stepMs = 12000;
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, LOADING_STEPS.length - 1);
      setLoadingStep(stepIdx);
      setProgress((prev) => Math.min(prev + 12, 88));
    }, stepMs);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100000);

      const response = await fetch(
        `/api/generate?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" })) as { error?: string };
        throw new Error(err.error ?? `HTTP ${response.status}`);
      }

      const data = await response.json() as { status?: string; url?: string; filename?: string; error?: string };

      if (data.status === "success" && data.url) {
        setProgress(100);
        setResult(data.url);
        setResultFilename(data.filename ?? `lumina-video-${Date.now()}.mp4`);
        addHistory({ type: "video", prompt, model: VIDEO_MODELS.find(m2 => m2.id === model)?.name ?? "Unknown", url: data.url });
        toast({ title: "Video generated!", description: "Your cinematic creation is ready." });
      } else {
        throw new Error(data.error ?? "Generation returned no video");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("abort") || message.includes("Timeout")) {
        toast({ title: "Generation timeout", description: "The request took too long. Try a shorter prompt.", variant: "destructive" });
      } else {
        toast({ title: "Generation failed", description: message || "Could not generate video. Please try again.", variant: "destructive" });
      }
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const filename = resultFilename || `lumina-video-${Date.now()}.mp4`;
    try {
      const proxyUrl = `${import.meta.env.BASE_URL}api/download?url=${encodeURIComponent(result)}&filename=${filename}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) throw new Error("proxy failed");
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast({ title: "Downloaded!" });
    } catch {
      const a = document.createElement("a");
      a.href = result;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: "Download started!" });
    }
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
              {typeof pointsBalance === "number" && isFinite(pointsBalance)
                ? `${pointsBalance.toLocaleString()} / ${FREE_POINTS_PER_MONTH.toLocaleString()}`
                : "Unlimited"}{" "}
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
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-muted-foreground">Your prompt</label>
              <button
                onClick={fillRandomPrompt}
                title="Random prompt (press R)"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors px-2 py-1 rounded-lg hover:bg-secondary/10"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Random
                <kbd className="ml-0.5 text-[10px] px-1 py-0.5 rounded bg-white/10 border border-white/10 font-mono">R</kbd>
              </button>
            </div>
            <Textarea
              placeholder="A serene ocean wave crashing on a tropical beach at golden hour, slow motion cinematic..."
              className="min-h-[140px] bg-background/50 border-white/10 focus:border-secondary resize-none text-base leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setTextareaFocused(true)}
              onBlur={() => setTextareaFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
              }}
            />
            <p className="text-xs text-muted-foreground/50 mt-2">Ctrl+Enter to generate · R for random prompt · ~30–60 sec wait</p>
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
                  } ${m.pro && !user ? "opacity-60" : ""}`}
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
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all"
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
          <div className="glass-card rounded-2xl overflow-hidden aspect-square relative">
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
                {/* Download button — bottom-left corner, always visible */}
                <button
                  onClick={handleDownload}
                  className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/70 border border-white/20 hover:bg-black/90 backdrop-blur-sm transition-all text-xs font-medium text-white shadow-lg"
                  title="Download video"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
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
                    {LOADING_STEPS[loadingStep]}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Using {VIDEO_MODELS.find(m => m.id === model)?.name} · ~30–60 seconds
                  </p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-secondary to-accent rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-2">{Math.round(progress)}% complete</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-background/20 text-muted-foreground/30">
                <Film className="w-16 h-16 opacity-20" />
                <p className="text-sm">Your video will appear here</p>
                <p className="text-xs opacity-60">Press R for a random prompt to get started</p>
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
