'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCategories, useCategoryActions, useExpenses } from '@/lib/useExpenseStore';
import { CategoryIconPicker } from '@/components/forms/CategoryIconPicker';
import { CategoryColorPicker } from '@/components/forms/CategoryColorPicker';
import { toast } from 'sonner';
import { categoryNameExists, countExpensesByCategory } from '@/lib/category-helpers';
import type { CustomCategory } from '@/types/expense';

export function CategoryManager() {
  const t = useTranslations('categoryManager');
  const tActions = useTranslations('actions');
  const categories = useCategories();
  const expenses = useExpenses();
  const { addCategory, updateCategory, deleteCategory } = useCategoryActions();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('MoreHorizontal');
  const [color, setColor] = useState('#a4de6c');

  const resetForm = () => {
    setName('');
    setIcon('MoreHorizontal');
    setColor('#a4de6c');
  };

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error(t('errors.missingName'));
      return;
    }

    if (categoryNameExists(categories, name)) {
      toast.error(t('errors.duplicateName'));
      return;
    }

    addCategory({
      name: name.trim(),
      icon,
      color,
      isDefault: false,
    });

    toast.success(t('toast.created'));
    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = () => {
    if (!editingCategory) return;

    if (!name.trim()) {
      toast.error(t('errors.missingName'));
      return;
    }

    if (categoryNameExists(categories, name, editingCategory.id)) {
      toast.error(t('errors.duplicateName'));
      return;
    }

    updateCategory(editingCategory.id, {
      name: name.trim(),
      icon,
      color,
    });

    toast.success(t('toast.updated'));
    resetForm();
    setIsEditOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (category: CustomCategory) => {
    if (category.isDefault) {
      toast.error(t('errors.cantDeleteDefault'));
      return;
    }

    const expenseCount = countExpensesByCategory(expenses, category.id);
    if (expenseCount > 0) {
      toast.error(t('errors.cantDeleteWithExpenses', { count: expenseCount }));
      return;
    }

    deleteCategory(category.id);
    toast.success(t('toast.deleted'));
  };

  const openEditDialog = (category: CustomCategory) => {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon);
    setColor(category.color);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addButton')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('createDialog.title')}</DialogTitle>
              <DialogDescription>{t('createDialog.description')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">
                  {t('fields.nameLabel')} *
                </Label>
                <Input
                  id="category-name"
                  placeholder={t('fields.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <CategoryIconPicker value={icon} onChange={setIcon} />
              <CategoryColorPicker value={color} onChange={setColor} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                {tActions('cancel')}
              </Button>
              <Button onClick={handleAdd}>{t('createButton')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {categories.map((category) => {
          const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
          const expenseCount = countExpensesByCategory(expenses, category.id);

          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-md"
                  style={{ backgroundColor: category.color + '20', color: category.color }}
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.name}</span>
                    {category.isDefault && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {t('badges.default')}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t('expenseCount', { count: expenseCount })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!category.isDefault && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={expenseCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editDialog.title')}</DialogTitle>
            <DialogDescription>{t('editDialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">
                {t('fields.nameLabel')} *
              </Label>
              <Input
                id="edit-category-name"
                placeholder={t('fields.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <CategoryIconPicker value={icon} onChange={setIcon} />
            <CategoryColorPicker value={color} onChange={setColor} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {tActions('cancel')}
            </Button>
            <Button onClick={handleEdit}>{t('saveChanges')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('emptyState')}</p>
        </div>
      )}
    </div>
  );
}
