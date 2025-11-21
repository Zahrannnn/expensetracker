'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Trash2, Settings as SettingsIcon, FileJson, FileText, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  useChatbotActions,
  useChatbotConfig,
  useExpenses,
  useExpenseActions,
  useOnboardingActions,
  useReminderActions,
  useReminderSettings,
} from '@/lib/useExpenseStore';
import { exportToJSON, exportToCSV } from '@/lib/helpers';
import { HydrationGuard } from '@/components/shared/HydrationGuard';
import { CategoryManager } from '@/components/settings/CategoryManager';
import { CategoryBudgets } from '@/components/budgets/CategoryBudgets';
import { toast } from 'sonner';
import { APP_INFO } from '@/lib/constants';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tToast = useTranslations('toast');
  const expenses = useExpenses();
  const { clearExpenses } = useExpenseActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { chatbotName, chatbotApiKey } = useChatbotConfig();
  const { setChatbotConfig, clearChatbotMessages } = useChatbotActions();
  const { resetOnboarding } = useOnboardingActions();
  const { remindersEnabled } = useReminderSettings();
  const { setRemindersEnabled, clearDismissedReminders } = useReminderActions();
  const [botName, setBotName] = useState(() => chatbotName);
  const [apiKey, setApiKey] = useState(() => chatbotApiKey);
  const [savingBot, setSavingBot] = useState(false);

  const handleChatbotSave = () => {
    setSavingBot(true);
    const cleanName = botName.trim() || 'Nova';
    const cleanKey = apiKey.trim();
    setChatbotConfig({ name: cleanName, apiKey: cleanKey });
    setBotName(cleanName);
    setApiKey(cleanKey);
    toast.success(t('chatbot.toastSaved'));
    setSavingBot(false);
  };

  const handleShowKey = () => {
    if (chatbotApiKey) {
      toast.info(t('chatbot.keyVisible'), {
        description: chatbotApiKey,
        duration: 5000,
      });
    }
  };

  const handleClearKey = () => {
    setChatbotConfig({ apiKey: '' });
    clearChatbotMessages();
    toast.success(t('chatbot.toastCleared'));
  };

  const handleToggleReminders = () => {
    setRemindersEnabled(!remindersEnabled);
  };

  const handleClear = () => {
    const count = expenses.length;
    clearExpenses();
    setDialogOpen(false);
    toast.success(tToast('allExpensesCleared'), {
      description: tToast('deletedCount', { count }),
    });
  };

  const handleExportJSON = () => {
    exportToJSON(expenses);
    toast.success(tToast('exportedToJSON'), {
      description: `${expenses.length} expenses exported`,
    });
  };

  const handleExportCSV = () => {
    exportToCSV(expenses);
    toast.success(tToast('exportedToCSV'), {
      description: `${expenses.length} expenses exported`,
    });
  };

  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <Card>
        
          <CardContent>
            <CategoryManager />
          </CardContent>
        </Card>

        <CategoryBudgets />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('chatbot.title')}
            </CardTitle>
            <CardDescription>{t('chatbot.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bot-name">{t('chatbot.nameLabel')}</Label>
                <Input
                  id="bot-name"
                  placeholder={t('chatbot.namePlaceholder')}
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-key">{t('chatbot.keyLabel')}</Label>
                <Input
                  id="bot-key"
                  type="password"
                  placeholder="AIzzA..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('chatbot.instructions')}
            </p>
            {!chatbotApiKey && (
              <p className="text-xs text-primary">
                {t.rich('chatbot.keyHelp', {
                  link: (chunks) => (
                    <a
                      href="https://aistudio.google.com/api-keys"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline font-medium"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            )}
            {chatbotApiKey ? (
              <div className="space-y-3 rounded-lg border bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary">
                  {t('chatbot.activeHelper', { name: chatbotName })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleShowKey}>
                    {t('chatbot.showKey')}
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleClearKey}>
                    {t('chatbot.clearKey')}
                  </Button>
                  <Button onClick={handleChatbotSave} disabled={savingBot}>
                    {t('chatbot.updateButton')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleChatbotSave} disabled={savingBot}>
                {t('chatbot.saveButton')}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t('guidance.title')}
            </CardTitle>
            <CardDescription>{t('guidance.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('guidance.notificationsHint')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={resetOnboarding}>
                {t('guidance.replay')}
              </Button>
              <Button
                type="button"
                variant={remindersEnabled ? 'default' : 'outline'}
                onClick={handleToggleReminders}
              >
                {remindersEnabled ? t('guidance.remindersOn') : t('guidance.remindersOff')}
              </Button>
              <Button type="button" variant="ghost" onClick={clearDismissedReminders}>
                {t('guidance.clearDismissed')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('exportData')}
            </CardTitle>
            <CardDescription>
              {t('exportDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleExportJSON}
                  disabled={expenses.length === 0}
                  variant="outline"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  {t('exportJSON', { ns: 'actions' })}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleExportCSV}
                  disabled={expenses.length === 0}
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('exportCSV', { ns: 'actions' })}
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} available for export
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              {t('dangerZone')}
            </CardTitle>
            <CardDescription>
              {t('clearDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('clearAllExpenses')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('confirmClear')}</DialogTitle>
                  <DialogDescription>
                    {t('confirmClearDescription', { count: expenses.length })}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t('cancelClear')}
                  </Button>
                  <Button variant="destructive" onClick={handleClear}>
                    {t('clearAll', { ns: 'actions' })}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('version')}</span>
              <span className="font-medium">1.2.0</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('storage')}</span>
              <span className="font-medium">{t('localStorage')}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('madeBy')}</span>
              <span className="font-medium">{APP_INFO.MADE_BY}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </HydrationGuard>
  );
}

