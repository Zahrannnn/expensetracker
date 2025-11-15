'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Trash2, Settings as SettingsIcon, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useExpenses, useExpenseActions } from '@/lib/useExpenseStore';
import { exportToJSON, exportToCSV } from '@/lib/helpers';
import { HydrationGuard } from '@/components/shared/HydrationGuard';
import { toast } from 'sonner';
import { APP_INFO } from '@/lib/constants';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tToast = useTranslations('toast');
  const expenses = useExpenses();
  const { clearExpenses } = useExpenseActions();
  const [dialogOpen, setDialogOpen] = useState(false);

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
              <span className="font-medium">1.0.0</span>
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

