'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Send } from 'lucide-react'

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

export default function Chat() {
  const [mbtiType, setMbtiType] = useState('INTJ')
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { mbtiType },
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-200">
      <header className="flex justify-between items-center p-4 bg-white dark:bg-zinc-800 shadow-md">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">MBTI ChatBot</h1>
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
          <Button onClick={toggleDarkMode} variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${
              m.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-md'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-lg bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-md">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-zinc-800 shadow-md">
        <div className="flex space-x-4">
          <Input 
            value={input} 
            onChange={handleInputChange} 
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}