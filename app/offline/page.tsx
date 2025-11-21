'use client';

import { motion } from 'framer-motion';
import { WifiOff, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const copy = {
  en: {
    title: "You're offline",
    subtitle: 'No worries—your progress is safe. We’ll sync everything once you reconnect.',
    chipSafety: 'Local data safe',
    chipSync: 'Auto-sync on return',
    encouragement: 'Tip: You can still review past data while offline.',
    retry: 'Reconnect now',
    help: 'Offline tips',
  },
  ar: {
    title: 'أنت حالياً بدون إنترنت',
    subtitle: 'ما تقلقش، بياناتك محفوظة وهتتزامن أول ما الشبكة ترجع.',
    chipSafety: 'البيانات محفوظة محلياً',
    chipSync: 'هنتزامن تلقائياً',
    encouragement: 'ملاحظة: تقدر تراجع بياناتك القديمة حتى من غير إنترنت.',
    retry: 'إعادة المحاولة',
    help: 'نصائح الاستخدام بدون إنترنت',
  },
};

export default function OfflinePage() {
  const userLang =
    typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() : 'en';
  const isArabic = userLang?.startsWith('ar');
  const text = isArabic ? copy.ar : copy.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{text.encouragement}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="w-full border-white/10 bg-white/5 backdrop-blur">
            <CardContent className="space-y-8 p-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-amber-400/30 blur-3xl"
                    animate={{ opacity: [0.6, 0.2, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative rounded-full border border-white/20 bg-white/10 p-4">
                    <WifiOff className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold">{text.title}</h1>
                  <p className="mt-2 text-base text-white/70">{text.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <StatusChip icon={ShieldCheck} label={text.chipSafety} />
                <StatusChip icon={RotateCcw} label={text.chipSync} />
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <Button
                  className="flex-1 text-base"
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  {text.retry}
                </Button>
                <Button
                  className="flex-1 text-base"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <a
                    href="https://support.google.com/chrome/answer/187367"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {text.help}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface StatusChipProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function StatusChip({ icon: Icon, label }: StatusChipProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border border-white/15',
        'bg-white/5 px-4 py-2 text-sm text-white/80'
      )}
    >
      <Icon className="h-4 w-4 text-emerald-300" />
      <span>{label}</span>
    </div>
  );
}

