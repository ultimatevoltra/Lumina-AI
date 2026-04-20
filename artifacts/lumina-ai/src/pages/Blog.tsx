import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Tag } from "lucide-react";

const POSTS = [
  {
    id: 1,
    title: "Introducing Lumina 2.5 Pro: A New Era of AI Video",
    excerpt: "Today we're launching our most powerful video model yet — faster generation, sharper motion, and cinematic quality that rivals professional studios.",
    date: "April 15, 2026",
    tag: "Product",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    readTime: "3 min read",
    gradient: "from-primary/20 to-secondary/10",
  },
  {
    id: 2,
    title: "How to Write Better AI Prompts for Video Generation",
    excerpt: "Learn the techniques our team uses to craft prompts that produce stunning, consistent results every time. From scene-setting to camera direction.",
    date: "April 10, 2026",
    tag: "Tutorial",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    readTime: "7 min read",
    gradient: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    id: 3,
    title: "Behind the Model: How Our Photo AI Sees the World",
    excerpt: "A deep dive into the architecture behind our photo generation models, and why prompt language matters more than you might think.",
    date: "April 5, 2026",
    tag: "Engineering",
    tagColor: "text-accent bg-accent/10 border-accent/20",
    readTime: "10 min read",
    gradient: "from-accent/20 to-blue-500/10",
  },
  {
    id: 4,
    title: "The 2026 Creator Economy: Why AI Art is Taking Over",
    excerpt: "We surveyed 10,000 digital creators. Here's what they told us about how generative AI has changed their workflow, income, and creative process.",
    date: "March 28, 2026",
    tag: "Industry",
    tagColor: "text-secondary bg-secondary/10 border-secondary/20",
    readTime: "5 min read",
    gradient: "from-secondary/20 to-orange-500/10",
  },
  {
    id: 5,
    title: "Points System Explained: Getting the Most From Lumina AI",
    excerpt: "Everything you need to know about our monthly points system — how they reset, how to earn bonus points, and which operations use the fewest.",
    date: "March 20, 2026",
    tag: "Guide",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    readTime: "4 min read",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: 6,
    title: "Lumina AI x Community Showcase: March 2026",
    excerpt: "A handpicked gallery of the most breathtaking creations from our community this month. From macro photography to sci-fi epics — all AI-generated.",
    date: "March 15, 2026",
    tag: "Community",
    tagColor: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    readTime: "2 min read",
    gradient: "from-pink-500/20 to-secondary/10",
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-heading">Blog</h1>
            <p className="text-muted-foreground text-sm">Updates, tutorials, and insights from the Lumina AI team</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POSTS.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all group cursor-pointer"
          >
            {/* Card banner */}
            <div className={`h-32 bg-gradient-to-br ${post.gradient} flex items-center justify-center border-b border-white/5`}>
              <BookOpen className="w-10 h-10 text-white/20" />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${post.tagColor}`}>
                  {post.tag}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
              </div>

              <h2 className="font-heading font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
