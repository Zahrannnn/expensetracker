# Quick Start Guide

## 🚀 Run the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Quick Usage Guide

### 1. Add Your First Expense

1. On the home page, fill in the form:
   - Enter an amount (e.g., 50.00)
   - Select today's date
   - Choose a category (e.g., "Food & Dining")
   - Add a note like "Lunch at restaurant"
2. Click "Add Expense"

### 2. View Your Dashboard

The home page shows:
- **Monthly Summary Cards**: Total spending, top category, daily average
- **Expense List**: All your expenses with filters
- **Filters**: Filter by month or category

### 3. Edit or Delete Expenses

- Click the **pencil icon** to edit an expense inline
- Click the **trash icon** to delete an expense

### 4. View Analytics

1. Click **Analytics** in the navigation
2. See:
   - Pie chart of spending by category
   - Line chart of spending over time

### 5. Export Your Data

1. Click **Settings** in the navigation
2. Choose export format:
   - Click "Export as JSON" for backup
   - Click "Export as CSV" for spreadsheets

### 6. Clear All Data (Optional)

In Settings → Danger Zone → "Clear All Expenses"
⚠️ This action cannot be undone!

## 🎨 Features to Try

1. **Add multiple expenses** across different categories
2. **Filter by month** to see specific periods
3. **Filter by category** to see spending patterns
4. **Edit expenses** by clicking the pencil icon
5. **View charts** to visualize your spending
6. **Export data** before clearing to create backups

## 💡 Tips

- Data is stored in your browser's LocalStorage
- Export regularly to create backups
- Use descriptive notes to remember what each expense was for
- Check the Analytics page to identify spending patterns

## 🐛 Troubleshooting

**If you see a blank page:**
- Make sure all dependencies are installed: `npm install`
- Clear browser cache and LocalStorage
- Restart the development server

**If charts don't show:**
- Add at least 2-3 expenses in different categories
- Charts only appear when there's data to display

## 🏗️ Project Structure Reference

```
Key Files:
├── app/page.tsx          → Home/Dashboard
├── app/analytics/        → Analytics Charts
├── app/settings/         → Settings & Export
├── components/           → UI Components
├── lib/useExpenseStore.ts → State Management
└── types/expense.ts      → TypeScript Types
```

## 🎯 Next Steps

1. Customize categories in `types/expense.ts`
2. Adjust the theme in `app/globals.css`
3. Add more expense categories
4. Modify summary calculations in `lib/helpers.ts`

Enjoy tracking your expenses! 🎉

