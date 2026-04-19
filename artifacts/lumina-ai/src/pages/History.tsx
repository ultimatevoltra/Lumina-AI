import { motion } from "framer-motion";
import { format } from "date-fns";
import { Image as ImageIcon, Video, FolderOpen, Download } from "lucide-react";
import { useAppState } from "@/hooks/use-local-state";
import { Button } from "@/components/ui/button";

export default function History() {
  const { history } = useAppState();

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">Your <span className="gradient-text">Creations</span></h1>
            <p className="text-muted-foreground">Browse and download your past generated media.</p>
          </div>
          <div className="hidden sm:block text-sm font-medium px-4 py-2 rounded-full bg-white/5 border border-white/10">
            {history.length} {history.length === 1 ? 'Item' : 'Items'}
          </div>
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">No history yet</h3>
            <p className="text-muted-foreground">
              Your generated photos and videos will appear here. Head over to the home page to start creating.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-square bg-black/50 overflow-hidden">
                  {item.type === "photo" ? (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5 border border-white/10">
                      {item.type === "photo" ? <ImageIcon className="w-3 h-3 text-primary" /> : <Video className="w-3 h-3 text-secondary" />}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Button
                      variant="secondary"
                      className="bg-white text-black hover:bg-white/90"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.url;
                        a.download = `lumina-${item.type}-${item.id}`;
                        a.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-sm text-foreground line-clamp-2 mb-3 flex-1" title={item.prompt}>
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-white/5">
                    <span>{item.model}</span>
                    <span>{format(item.timestamp, "MMM d, yyyy")}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
