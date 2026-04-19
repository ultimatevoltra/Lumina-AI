import { motion } from "framer-motion";

export function Background() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-40 left-1/2 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl animate-float-slow transform -translate-x-1/2" />
      </div>
      
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[100px]" />
    </div>
  );
}
