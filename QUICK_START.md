# Quick Start Guide 🚀

## Installation Complete ✅

All dependencies have been installed and the application is ready to use!

## Running the Application

The development server should already be running. If not, start it with:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Quick Feature Tour

### 1. Dashboard (Home Page)
**What you'll see:**
- Budget Overview with 3 cards showing your financial health
- Monthly Summary with spending insights
- Debt List showing any borrowed money
- Expense Table with all your transactions
- Floating "+" button to add expenses

**Quick actions:**
- Click "Add Income" (top right) to record income
- Click "Add Debt" (top right) to record borrowed money
- Click the floating "+" button to add an expense

### 2. Income Page
**Navigate:** Click "Income" in the sidebar

**Features:**
- View all income entries grouped by month
- See monthly totals
- Add new income sources
- Delete income entries

**Try it:**
1. Click "Add Income"
2. Enter $5000, select "Salary", pick today's date
3. Submit and watch the confetti! 🎉

### 3. Analytics Page
**Navigate:** Click "Analytics" in the sidebar

**What you'll see:**
- Income vs Expenses bar chart (last 6 months)
- Spending by Category pie chart
- Spending Over Time line chart

**Tip:** Add some income and expenses to see meaningful charts!

### 4. Settings Page
**Navigate:** Click "Settings" in the sidebar

**Features:**
- Export all data to JSON or CSV
- Clear all expenses
- View app information

## Try These Workflows

### Set Up Your Budget
1. Add your monthly income (Dashboard → "Add Income")
2. Add some expenses (Dashboard → Floating "+" button)
3. Check your Budget Overview to see spending percentage
4. View the progress ring showing how much of your income you've spent

### Track a Debt
1. Click "Add Debt" on the dashboard
2. Enter: Amount ($1000), Borrowed From ("John"), Reason ("Emergency loan")
3. Set borrowed date and optional due date
4. Submit to see it in the Debt List
5. When paid back, click the checkmark icon → Confetti celebration! 🎉

### View Financial Health
1. Ensure you have both income and expenses
2. Dashboard shows:
   - Budget Status (circular progress)
   - Total Income this month
   - Remaining balance and savings rate
3. Analytics page shows income vs expenses trend

## Key Features at a Glance

### 💰 Income Tracking
- Multiple sources: Salary, Freelance, Business, Investment, Gift, Other
- Monthly grouping and totals
- Automatic date tracking

### 🤝 Debt Management
- Record borrowed money
- Track creditor, amount, reason, dates
- Mark as paid with celebration
- View unpaid vs paid history

### 📊 Budget Visualization
- Spending percentage progress ring
- Real-time budget calculations
- Savings rate tracking
- Debt impact on net balance

### 🎉 Celebrations
- Confetti on income addition
- Confetti on expense addition
- Confetti on debt payment
- Toast notifications for all actions

### 📈 Analytics
- Income vs Expenses comparison (6 months)
- Category breakdown pie chart
- Spending trends line chart
- Net savings calculation

## Data Persistence

All your data is saved to your browser's LocalStorage:
- **Expenses**: Every transaction you add
- **Income**: All income entries
- **Debts**: Borrowed money records

**Note:** Data is stored locally in your browser. Clearing browser data will delete all records.

## Theme Switching

Click the theme dropdown in the sidebar footer to switch between:
- 🌞 Light mode
- 🌙 Dark mode
- 💻 System (auto-detects your OS preference)

## Keyboard Shortcuts

- `Esc` - Close any open modal
- `Tab` - Navigate form fields
- Arrow keys - Navigate sidebar menu

## Tips for Best Experience

1. **Add Income First**: Set up your monthly income before tracking expenses to see meaningful budget percentages
2. **Categorize Expenses**: Use appropriate categories for better analytics
3. **Track Debts Promptly**: Record borrowed money immediately to keep accurate financial picture
4. **Check Analytics Weekly**: Review your spending patterns and adjust as needed
5. **Use Notes**: Add notes to expenses for better context later

## Sample Data Scenario

Want to see all features in action? Try this:

1. **Add Income:**
   - $5000 from "Salary" on the 1st of this month
   - $500 from "Freelance" on the 15th of this month

2. **Add Expenses:**
   - $1200 for "Bills & Utilities"
   - $400 for "Groceries"
   - $100 for "Entertainment"
   - $200 for "Transportation"

3. **Add a Debt:**
   - $500 borrowed from "Friend" for "Car repair"

4. **Check Dashboard:**
   - Budget Overview shows 40% spending rate (2000/6000)
   - Remaining: $4000 (with $500 debt noted)
   - Savings rate: 60%

5. **View Analytics:**
   - Bar chart shows income vs expenses this month
   - Pie chart breaks down spending by category

6. **Pay Off Debt:**
   - Click checkmark on the debt → Confetti! 🎉

## Troubleshooting

### Charts not showing?
- Add some expenses first (they need data to display)
- Ensure you have expenses in the current/recent months

### Budget showing 0%?
- Add income entries first
- Budget percentage = (Expenses / Income) × 100

### Confetti not appearing?
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Data not persisting?
- Check if browser allows LocalStorage
- Don't use private/incognito mode
- Check browser storage settings

## Need Help?

Check these files for detailed documentation:
- `FEATURE_UPDATES.md` - Complete feature documentation
- `IMPLEMENTATION_COMPLETE.md` - Technical implementation details
- `README.md` - Project overview

## Enjoy Your Financial Journey! 💰✨

Track your expenses, manage your income, pay off debts, and watch your savings grow with motivational celebrations along the way!

