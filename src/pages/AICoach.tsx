import { useState, useRef, useEffect } from 'react';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from '@/components/ai/ChatMessage';
import { ChatInput } from '@/components/ai/ChatInput';
import { TypingIndicator } from '@/components/ai/TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Menu, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useGamification } from '@/contexts/GamificationContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSafetyWarning?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Suggested prompts with predefined responses
const SUGGESTED_PROMPTS = [
  {
    prompt: "What workout should I do today?",
    response: "Great question! Based on your current level and fitness journey, I'd recommend a balanced approach. If you're feeling energized, try a strength training session focusing on compound movements like squats and push-ups. If you're looking for cardio, a 20-30 minute HIIT workout will boost your endurance. Remember to listen to your body! 💪"
  },
  {
    prompt: "How can I stay motivated?",
    response: "Staying motivated is all about consistency and celebrating small wins! 🎉 Set realistic goals, track your progress, and remember why you started. Find a workout buddy or join our community challenges. Most importantly, don't aim for perfection—aim for progress. Every workout counts, even the short ones! Keep crushing it! 🔥"
  },
  {
    prompt: "Tips for building a workout habit?",
    response: "Building a habit is easier than you think! Start small—commit to just 10 minutes a day. Schedule your workouts like important meetings. Keep your workout clothes ready the night before. Stack habits: do push-ups after brushing teeth. Track your streak here in FitFlow! Remember: consistency beats intensity. You've got this! ⭐"
  },
  {
    prompt: "I'm feeling tired, should I rest?",
    response: "Listen to your body—it knows best! 🧘 Feeling tired could mean you need rest OR light active recovery like walking or stretching. If it's muscle soreness, that's normal. But if you're exhausted, have trouble sleeping, or feel burnt out, take a rest day. Recovery is when muscles grow stronger. Rest is training too! 💤"
  },
  {
    prompt: "How do I avoid overtraining?",
    response: "Smart question! 🎯 Watch for signs: constant fatigue, decreased performance, trouble sleeping, mood changes, or persistent soreness. Schedule rest days (at least 1-2 per week). Vary your workouts—don't do intense training every day. Prioritize sleep and nutrition. Listen to your body, not just your ego. Quality over quantity! 🌟"
  },
];

const AICoach = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useGamification();

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fitflow_ai_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    } else {
      // Welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hey there! 👋 I'm your AI Fitness Coach, powered by Google Gemini. I'm here to help you with workout suggestions, motivation, and healthy habits.\n\nWhat would you like to know today?`,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('fitflow_ai_chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if message matches a predefined prompt
      const predefinedPrompt = SUGGESTED_PROMPTS.find(p => p.prompt === content);
      
      if (predefinedPrompt) {
        // Use predefined response (instant, no API call)
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking time
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: predefinedPrompt.response,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // For custom messages, call the API
      const recentMessages = messages.slice(-3).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add user context
      const contextMessage = `User Level: ${user.level}, Total Workouts: ${user.totalWorkouts}, Current Streak: ${user.currentStreak} days`;
      
      const response = await fetch(`${API_URL}/api/ai/coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history: recentMessages,
          userContext: contextMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: data.timestamp || new Date().toISOString(),
        isSafetyWarning: data.isSafetyWarning,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0);

    } catch (err) {
      console.error('AI Coach error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to coach');
      
      // Show error toast
      toast({
        title: 'Connection Error',
        description: 'Could not reach the AI coach. Please check if the server is running.',
        variant: 'destructive',
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Coach is resting. Try again soon 💪\n\n(Make sure the backend server is running on port 3001)",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Chat cleared! 🧹\n\nI'm still here to help. What would you like to know?`,
      timestamp: new Date().toISOString(),
    }]);
    localStorage.removeItem('fitflow_ai_chat');
    toast({
      title: 'Chat Cleared',
      description: 'Your conversation has been reset.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="lg:ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                      AI Fitness Coach
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Powered by Gemini
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Your personal AI trainer
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              </div>

              {/* Error banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">Connection Error</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make sure the backend server is running: <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code> in the server folder
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col min-h-[600px]">
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        timestamp={message.timestamp}
                        isSafetyWarning={message.isSafetyWarning}
                      />
                    ))}
                    {isLoading && <TypingIndicator />}
                  </AnimatePresence>

                  {/* Suggested Prompts (only show when no messages) */}
                  {messages.length === 1 && (
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-3">💡 Try asking:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SUGGESTED_PROMPTS.map((item, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestedPrompt(item.prompt)}
                            className="justify-start text-left h-auto py-3 px-4"
                            disabled={isLoading}
                          >
                            {item.prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4 bg-muted/30">
                  <ChatInput
                    onSend={sendMessage}
                    disabled={isLoading}
                    isLoading={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    💡 Your coach remembers the last 3 messages for context
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AICoach;
