'use client';

import { useState } from 'react';
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
import { HydrationGuard } from '@/components/HydrationGuard';
import { toast } from 'sonner';

export default function SettingsPage() {
  const expenses = useExpenses();
  const { clearExpenses } = useExpenseActions();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClear = () => {
    const count = expenses.length;
    clearExpenses();
    setDialogOpen(false);
    toast.success('All expenses cleared', {
      description: `Deleted ${count} expense${count !== 1 ? 's' : ''}`,
    });
  };

  const handleExportJSON = () => {
    exportToJSON(expenses);
    toast.success('Exported to JSON', {
      description: `${expenses.length} expenses exported`,
    });
  };

  const handleExportCSV = () => {
    exportToCSV(expenses);
    toast.success('Exported to CSV', {
      description: `${expenses.length} expenses exported`,
    });
  };

  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your expense data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your expense data in JSON or CSV format
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
                  Export as JSON
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleExportCSV}
                  disabled={expenses.length === 0}
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
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
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Expenses
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete all
                    your expenses from local storage.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleClear}>
                    Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">Next.js 16</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </HydrationGuard>
  );
}

