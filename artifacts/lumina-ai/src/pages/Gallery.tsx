import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Film, Trash2, Download, X, Clock, SlidersHorizontal } from "lucide-react";
import { useAppState } from "@/hooks/use-local-state";
import { useToast } from "@/hooks/use-toast";

type Filter = "all" | "photo" | "video";

export default function Gallery() {
  const { history, setHistory } = useAppState();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<"photo" | "video">("photo");

  const filtered = filter === "all" ? history : history.filter((h) => h.type === filter);

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    toast({ title: "Removed from Gallery" });
  };

  const handleDownload = async (url: string, type: "photo" | "video") => {
    const ext = type === "video" ? "mp4" : "jpg";
    const filename = `lumina-${type}-${Date.now()}.${ext}`;
    try {
      const proxyUrl = `${import.meta.env.BASE_URL}api/download?url=${encodeURIComponent(url)}&filename=${filename}`;
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
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: "Download started!" });
    }
  };

  const openLightbox = (url: string, type: "photo" | "video") => {
    setLightbox(url);
    setLightboxType(type);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-1">Gallery</h1>
            <p className="text-muted-foreground text-sm">
              {history.length === 0
                ? "Your creations will appear here"
                : `${history.length} creation${history.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 glass-card rounded-xl p-1">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground ml-2" />
            {(["all", "photo", "video"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {f}
                {f !== "all" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({history.filter((h) => h.type === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-muted-foreground/40"
        >
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
            <ImageIcon className="w-10 h-10 opacity-30" />
          </div>
          <p className="text-lg font-medium mb-2">
            {filter === "all" ? "No creations yet" : `No ${filter}s generated yet`}
          </p>
          <p className="text-sm">
            {filter === "all"
              ? "Generate your first photo or video to see it here"
              : `Go to ${filter} generation to create something`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer aspect-square"
                onClick={() => openLightbox(item.url, item.type)}
              >
                {item.type === "photo" ? (
                  <img
                    src={item.url}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-background/50 flex items-center justify-center relative">
                    <Film className="w-10 h-10 text-secondary opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                        <Film className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      item.type === "photo"
                        ? "bg-primary/30 text-primary border border-primary/30"
                        : "bg-secondary/30 text-secondary border border-secondary/30"
                    }`}>
                      {item.type === "photo" ? "Photo" : "Video"}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="w-7 h-7 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center hover:bg-destructive/40 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/80 line-clamp-2 mb-2 leading-relaxed">
                      {item.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDate(item.timestamp)}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(item.url, item.type); }}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl max-h-[80vh] rounded-2xl overflow-hidden"
            >
              {lightboxType === "photo" ? (
                <img src={lightbox} alt="" className="w-full h-full object-contain" />
              ) : (
                <video src={lightbox} controls autoPlay className="w-full h-full" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
