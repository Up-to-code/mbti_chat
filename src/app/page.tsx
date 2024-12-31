"use client";

import { useState, useRef, useEffect, memo } from "react";
import { useChat, type Message as ChatMessage } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Send, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP", 
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ", 
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const fadeInOut = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const MessageBubble = memo(({ message }: { message: ChatMessage }) => (
  <motion.div {...fadeInOut}
    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[85%] items-end gap-2 
      ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`px-4 py-2 rounded-2xl text-sm
        ${message.role === "user" 
          ? "bg-indigo-600 text-white rounded-br-sm" 
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm"}`}>
        {message.content}
      </div>
      <time className="text-xs text-zinc-500 dark:text-zinc-400">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </div>
  </motion.div>
));

MessageBubble.displayName = "MessageBubble";

const TypingIndicator = memo(() => (
  <motion.div {...fadeInOut} className="flex gap-1 p-2">
    {[0, 0.2, 0.4].map((delay, i) => (
      <div key={i}
        className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 animate-bounce"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}
  </motion.div>
));

TypingIndicator.displayName = "TypingIndicator";

export default function Chat() {
  const [mbtiType, setMbtiType] = useState("INTJ");
  const [isDark, setIsDark] = useState(() => 
    typeof window !== "undefined" ? localStorage.getItem("dark") === "true" : false
  );
  const endRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: "/api/chat",
    body: { mbtiType },
    onFinish: () => {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("dark", String(isDark));
  }, [isDark]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 
      transition-colors duration-200">
      <header className="fixed top-0 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm 
        border-b border-zinc-200 dark:border-zinc-800 z-10">
        <nav className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Select value={mbtiType} onValueChange={setMbtiType}>
            <SelectTrigger className="w-32 text-zinc-900 dark:text-zinc-100 border-zinc-200 
              dark:border-zinc-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MBTI_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDark(x => !x)}
              className="text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 
                dark:hover:bg-zinc-800"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => reload()}
              disabled={!messages.length}
              className="text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 
                dark:hover:bg-zinc-800"
            >
              <RefreshCw size={18} />
            </Button>
            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div>
        </nav>
      </header>

      <main className="max-w-2xl h-full mx-auto pt-14 pb-16">
        <div className="h-full overflow-y-auto px-4 py-6 space-y-4 
          scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          <AnimatePresence initial={false}>
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
            {isLoading && <TypingIndicator />}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-white/80 dark:bg-zinc-900/80 
        backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto p-4">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Message..."
              maxLength={1000}
              className="flex-1 bg-transparent border-zinc-200 dark:border-zinc-800 
                text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 
                dark:placeholder:text-zinc-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}