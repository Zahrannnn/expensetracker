'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, Send, Bot, MessageCircleIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  useAchievements,
  useCategories,
  useChatbotActions,
  useChatbotConfig,
  useChatbotMessages,
  useExpenses,
  useHydrated,
  useSavingsGoals,
} from '@/lib/useExpenseStore';
import { buildChatbotContext } from '@/lib/chatbot-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ChatRole = 'user' | 'bot';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatbotWidgetProps {
  locale: string;
}

export function ChatbotWidget({ locale }: ChatbotWidgetProps) {
  const t = useTranslations('chatbot');
  const { chatbotName, chatbotApiKey } = useChatbotConfig();
  const expenses = useExpenses();
  const goals = useSavingsGoals();
  const achievements = useAchievements();
  const categories = useCategories();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useChatbotMessages();
  const { addChatbotMessage } = useChatbotActions();

  useEffect(() => {
    if (open && messages.length === 0) {
      addChatbotMessage({
        id: crypto.randomUUID(),
        role: 'bot',
        content: t('welcome', { name: chatbotName }),
      });
    }
  }, [open, chatbotName, messages.length, t, addChatbotMessage]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const contextSummary = useMemo(
    () =>
      buildChatbotContext({
        botName: chatbotName,
        expenses,
        savingsGoals: goals,
        achievements,
        categories,
      }),
    [chatbotName, expenses, goals, achievements, categories]
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    addChatbotMessage(userMessage);
    setInput('');

    const history = [...messages, userMessage].slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (!chatbotApiKey) {
      addChatbotMessage({
        id: crypto.randomUUID(),
        role: 'bot',
        content: t('mockResponse', { name: chatbotName }),
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history,
          context: contextSummary,
          apiKey: chatbotApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      addChatbotMessage({
        id: crypto.randomUUID(),
        role: 'bot',
        content: data.message ?? t('errorResponse'),
      });
    } catch (error) {
      console.error(error);
      toast.error(t('errorTitle'), { description: t('errorDescription') });
      addChatbotMessage({
        id: crypto.randomUUID(),
        role: 'bot',
        content: t('errorResponse'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!hydrated || !chatbotApiKey) {
    return null;
  }

  const triggerSide = locale === 'ar' ? 'left' : 'right';
  const triggerPositionClass =
    triggerSide === 'left' ? 'left-6' : 'right-6';

  return (
    <>
      <div className={cn('fixed bottom-6 z-40 rounded-full', triggerPositionClass)}>
        <Button size="lg" className="gap-2 shadow-lg rounded-full size-14" onClick={() => setOpen(true)}>
          <MessageCircleIcon className="size-6" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              {t('panelTitle', { name: chatbotName })}
            </SheetTitle>
            <SheetDescription>{t('panelDescription')}</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-muted/30">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                      msg.role === 'bot'
                        ? 'bg-background border'
                        : 'bg-primary text-primary-foreground ml-auto'
                    )}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageCircle className="h-4 w-4 animate-pulse" />
                  {t('typing', { name: chatbotName })}
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            <div className="border-t bg-background p-3 space-y-2">
              {!chatbotApiKey && (
                <p className="text-xs text-amber-600">
                  {t('missingKey')}
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('inputPlaceholder')}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

