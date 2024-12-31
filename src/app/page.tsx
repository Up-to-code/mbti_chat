'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Sun, Send, User, Bot, RefreshCw, Square } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

export default function Chat() {
  const [mbtiType, setMbtiType] = useState('INTJ')
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
    api: '/api/chat',
    body: { mbtiType },
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode')
    setIsDarkMode(darkModePreference === 'true')
    document.documentElement.classList.toggle('dark', darkModePreference === 'true')
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 transition-colors duration-200">
      <Card className="m-4 flex flex-col h-[calc(100vh-2rem)] shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-t-lg border-b border-zinc-200 dark:border-zinc-700">
          <CardTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">MBTI AI Assistant</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={mbtiType} onValueChange={setMbtiType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select MBTI Type" />
              </SelectTrigger>
              <SelectContent>
                {mbtiTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={toggleDarkMode} variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle dark mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    m.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-zinc-300 dark:bg-zinc-600 mr-2'
                  }`}>
                    {m.role === 'user' ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />}
                  </div>
                  <div className={`p-4 rounded-lg ${
                    m.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100'
                  } shadow-md transition-all duration-200 hover:shadow-lg`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[80%]">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600 mr-2">
                  <Bot className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-md">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 bg-white dark:bg-zinc-800 rounded-b-lg border-t border-zinc-200 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex space-x-2">
              <Input 
                value={input} 
                onChange={handleInputChange} 
                placeholder="Type your message here..."
                className="flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" disabled={isLoading}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => reload()} variant="outline" size="sm" disabled={isLoading || messages.length === 0}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reload
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reload conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={stop} variant="outline" size="sm" disabled={!isLoading}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stop generating</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

