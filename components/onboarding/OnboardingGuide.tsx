'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHydrated, useOnboardingActions, useOnboardingState } from '@/lib/useExpenseStore';

const STEP_ICONS = {
  dashboard: Home,
  chatbot: MessageCircle,
  savings: PiggyBank,
} as const;

type StepKey = keyof typeof STEP_ICONS;

const STEPS: StepKey[] = ['dashboard', 'chatbot', 'savings'];

export function OnboardingGuide() {
  const t = useTranslations('onboarding');
  const { hasCompletedOnboarding, showOnboardingGuide } = useOnboardingState();
  const { startOnboarding, completeOnboarding } = useOnboardingActions();
  const [currentStep, setCurrentStep] = useState(0);
  const hydrated = useHydrated();
  const hasRequestedStart = useRef(false);

  useEffect(() => {
    if (
      hydrated &&
      !hasCompletedOnboarding &&
      !showOnboardingGuide &&
      !hasRequestedStart.current
    ) {
      startOnboarding();
      hasRequestedStart.current = true;
    }
  }, [hydrated, hasCompletedOnboarding, showOnboardingGuide, startOnboarding]);

  useEffect(() => {
    if (!showOnboardingGuide) {
      setCurrentStep(0);
      hasRequestedStart.current = false;
    }
  }, [showOnboardingGuide]);

  const stepData = useMemo(() => {
    const key = STEPS[currentStep];
    const Icon = STEP_ICONS[key];
    return {
      key,
      Icon,
      title: t(`steps.${key}.title`),
      description: t(`steps.${key}.description`),
    };
  }, [currentStep, t]);

  if (!hydrated || !showOnboardingGuide) {
    return null;
  }

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t('title')}
              </p>
              <h2 className="text-2xl font-semibold">{stepData.title}</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <stepData.Icon className="h-6 w-6" />
              </div>
              <p className="text-muted-foreground">{stepData.description}</p>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-4">
              <div className="flex gap-2">
                {!isFirst && (
                  <Button variant="outline" onClick={handleBack}>
                    {t('back')}
                  </Button>
                )}
                <Button variant="ghost" onClick={handleSkip}>
                  {t('skip')}
                </Button>
              </div>
              <Button onClick={handleNext}>
                {isLast ? t('finish') : t('next')}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

