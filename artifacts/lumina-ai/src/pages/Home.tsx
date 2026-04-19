import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Video, Lock, Download, Share2, Maximize2, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

const PHOTO_MODELS = [
  { id: "perchance", name: "Perchance", pro: false },
  { id: "stable-xl", name: "Stable XL", pro: false },
  { id: "dalle-3", name: "DALL-E 3", pro: false },
  { id: "midjourney-v6", name: "Midjourney V6", pro: false },
  { id: "flux-pro", name: "Flux Pro", pro: true },
  { id: "ideogram", name: "Ideogram", pro: true },
];

const VIDEO_MODELS = [
  { id: "lumina-2.5", name: "Lumina 2.5 Pro", pro: false },
  { id: "runway-gen2", name: "Runway Gen-2", pro: false },
  { id: "pika-labs", name: "Pika Labs", pro: false },
  { id: "stable-video", name: "Stable Video", pro: false },
  { id: "haiper", name: "Haiper", pro: false },
  { id: "ltx-studio", name: "LTX Studio", pro: false },
  { id: "sora", name: "Sora", pro: true },
];

export default function Home() {
  const { user, isLimitReached, addHistory, usageCount, maxFreeLimit } = useAppState();
  const { toast } = useToast();
  
  const [photoPrompt, setPhotoPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  
  const [photoModel, setPhotoModel] = useState(PHOTO_MODELS[0].id);
  const [videoModel, setVideoModel] = useState(VIDEO_MODELS[0].id);
  
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  const [photoResult, setPhotoResult] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  const handleModelClick = (model: any, type: "photo" | "video") => {
    if (model.pro && !user) {
      toast({
        title: "Pro Model Locked",
        description: "Sign up to unlock this model.",
        variant: "destructive",
      });
      return;
    }
    if (type === "photo") setPhotoModel(model.id);
    else setVideoModel(model.id);
  };

  const handleGeneratePhoto = async () => {
    if (!photoPrompt.trim()) return;
    if (isLimitReached) {
      toast({
        title: "Limit Reached",
        description: "Sign up to generate unlimited images.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPhoto(true);
    setPhotoResult(null);

    try {
      // Simulate API call using Perchance format
      const response = await fetch(`https://image.perchance.org/api/generate?prompt=${encodeURIComponent(photoPrompt)}&resolution=512x512&cfg=8&steps=25`);
      if (!response.ok) throw new Error("API failed");
      
      const data = await response.json();
      const imageUrl = data.imageUrl || `https://picsum.photos/seed/${Math.random()}/512/512`; // Fallback if API doesn't return imageUrl
      
      setPhotoResult(imageUrl);
      addHistory({
        type: "photo",
        prompt: photoPrompt,
        model: PHOTO_MODELS.find(m => m.id === photoModel)?.name || "Unknown",
        url: imageUrl,
      });
    } catch (error) {
      console.error(error);
      // Fallback to random image if API fails
      const fallbackUrl = `https://picsum.photos/seed/${Math.random()}/512/512`;
      setPhotoResult(fallbackUrl);
      addHistory({
        type: "photo",
        prompt: photoPrompt,
        model: PHOTO_MODELS.find(m => m.id === photoModel)?.name || "Unknown",
        url: fallbackUrl,
      });
      toast({
        title: "Warning",
        description: "Using fallback image generator due to API error.",
      });
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    if (isLimitReached) {
      toast({
        title: "Limit Reached",
        description: "Sign up to generate unlimited videos.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingVideo(true);
    setVideoResult(null);

    try {
      // Call backend API for video
      const response = await fetch(`/api/generate?prompt=${encodeURIComponent(videoPrompt)}`);
      if (!response.ok) throw new Error("API failed");
      
      // In a real app this would poll for status, but we'll assume it returns the URL directly or after a wait
      // For now we'll simulate the wait if it doesn't wait
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Placeholder video
      setVideoResult(videoUrl);
      addHistory({
        type: "video",
        prompt: videoPrompt,
        model: VIDEO_MODELS.find(m => m.id === videoModel)?.name || "Unknown",
        url: videoUrl,
      });
    } catch (error) {
      console.error(error);
      const fallbackUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
      setVideoResult(fallbackUrl);
      addHistory({
        type: "video",
        prompt: videoPrompt,
        model: VIDEO_MODELS.find(m => m.id === videoModel)?.name || "Unknown",
        url: fallbackUrl,
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownload = (url: string) => {
    toast({ title: "Download started!" });
    // Simulate download
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumina-creation";
    a.click();
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Lumina 2.5 Pro is now live</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-heading tracking-tight"
        >
          Create with <span className="gradient-text">Lumina AI</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground"
        >
          Step into the future of creativity. Generate stunning photos and cinematic videos from text in seconds.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-8 pt-4"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">50+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Models</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">10M+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Creations</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</div>
          </div>
        </motion.div>
      </div>

      {/* Generators Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Photo Generator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading">Photo Generator</h2>
          </div>

          <Textarea
            placeholder="Describe the image you want to create... (e.g. A cyberpunk city at night with neon lights)"
            className="min-h-[120px] bg-background/50 border-white/10 focus:border-primary resize-none mb-6 text-base"
            value={photoPrompt}
            onChange={(e) => setPhotoPrompt(e.target.value)}
          />

          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-3 block">Select Model</label>
            <div className="grid grid-cols-3 gap-2">
              {PHOTO_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelClick(model, "photo")}
                  className={`relative p-2 rounded-xl border text-xs font-medium transition-all ${
                    photoModel === model.id
                      ? "bg-primary/20 border-primary text-foreground shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "bg-background/50 border-white/5 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {model.name}
                  {model.pro && (
                    <Lock className="w-3 h-3 absolute top-1 right-1 text-secondary opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGeneratePhoto}
            disabled={isGeneratingPhoto || !photoPrompt.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-6"
          >
            {isGeneratingPhoto ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" /> Generate Photo
              </>
            )}
          </Button>

          <div className="flex-1 bg-background/50 rounded-2xl border border-white/5 relative overflow-hidden group min-h-[300px] flex items-center justify-center">
            {photoResult ? (
              <>
                <img src={photoResult} alt={photoPrompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20" onClick={() => handleDownload(photoResult)}>
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20" onClick={() => {
                    navigator.clipboard.writeText(photoResult);
                    toast({ title: "Link copied!" });
                  }}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20" onClick={() => window.open(photoResult, "_blank")}>
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : isGeneratingPhoto ? (
              <div className="flex flex-col items-center text-primary">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm animate-pulse">Crafting your masterpiece...</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground/50 p-6">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Your creation will appear here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Video Generator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-3xl p-6 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary/20 text-secondary rounded-lg">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading">Video Generator</h2>
          </div>

          <Textarea
            placeholder="Describe the video you want to create... (e.g. A cinematic drone shot flying over a futuristic city)"
            className="min-h-[120px] bg-background/50 border-white/10 focus:border-secondary resize-none mb-6 text-base"
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
          />

          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-3 block">Select Model</label>
            <div className="grid grid-cols-3 gap-2">
              {VIDEO_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelClick(model, "video")}
                  className={`relative p-2 rounded-xl border text-xs font-medium transition-all ${
                    videoModel === model.id
                      ? "bg-secondary/20 border-secondary text-foreground shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                      : "bg-background/50 border-white/5 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {model.name}
                  {model.pro && (
                    <Lock className="w-3 h-3 absolute top-1 right-1 text-primary opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo || !videoPrompt.trim()}
            className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-lg font-medium shadow-[0_0_20px_rgba(236,72,153,0.3)] mb-6"
          >
            {isGeneratingVideo ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" /> Generate Video
              </>
            )}
          </Button>

          <div className="flex-1 bg-background/50 rounded-2xl border border-white/5 relative overflow-hidden group min-h-[300px] flex items-center justify-center">
            {videoResult ? (
              <>
                <video src={videoResult} controls autoPlay loop className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 text-white" onClick={() => handleDownload(videoResult)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : isGeneratingVideo ? (
              <div className="flex flex-col items-center text-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm animate-pulse">Rendering video sequence...</p>
                <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground/50 p-6">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Your cinematic sequence will appear here</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Free Usage Badge */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 glass-card rounded-2xl p-4 shadow-2xl border-primary/20 z-40 max-w-xs"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Free Usage</span>
            <span className="text-xs text-muted-foreground">{usageCount}/{maxFreeLimit}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div 
              className={`h-full rounded-full transition-all ${usageCount >= maxFreeLimit ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-secondary'}`}
              style={{ width: `${Math.min((usageCount / maxFreeLimit) * 100, 100)}%` }}
            />
          </div>
          {usageCount >= maxFreeLimit && (
            <p className="text-xs text-destructive mt-2">Limit reached. Please sign up to continue.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
