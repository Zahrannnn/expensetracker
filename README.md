# Expense Tracker

A modern, production-quality expense tracking application built with Next.js 16, TypeScript, and Zustand for state management.

## Features

- **Full CRUD Operations**: Add, edit, delete, and clear expenses
- **Smart Filtering**: Filter expenses by month and category
- **Monthly Summary**: View total spending, top category, and daily average for the current month
- **Visual Analytics**: 
  - Pie chart showing spending breakdown by category
  - Line chart displaying spending trends over time
- **Data Export**: Export your expenses to JSON or CSV format
- **LocalStorage Persistence**: All data is stored locally in your browser
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Built-in dark mode with shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with persist middleware
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
expensetracker/
├── app/                      # Next.js app directory
│   ├── analytics/           # Analytics page with charts
│   ├── settings/            # Settings page
│   ├── layout.tsx           # Root layout with navbar
│   └── page.tsx             # Home/dashboard page
├── components/              # React components
│   ├── charts/              # Chart components
│   │   ├── PieChartComponent.tsx
│   │   └── LineChartComponent.tsx
│   ├── ui/                  # shadcn/ui components
│   ├── AddExpenseForm.tsx
│   ├── CategoryFilter.tsx
│   ├── ExpenseRow.tsx
│   ├── ExpenseTable.tsx
│   ├── HydrationGuard.tsx
│   ├── MonthlyFilter.tsx
│   ├── MonthlySummary.tsx
│   └── Navbar.tsx
├── lib/                     # Utility functions
│   ├── helpers.ts           # Helper functions
│   ├── useExpenseStore.ts   # Zustand store
│   └── utils.ts             # shadcn utils
├── types/                   # TypeScript types
│   └── expense.ts
└── public/                  # Static assets
```

## Usage

### Adding an Expense

1. Navigate to the home page
2. Fill in the expense form:
   - **Amount**: Enter the expense amount
   - **Date**: Select the date of the expense
   - **Category**: Choose from predefined categories
   - **Note**: (Optional) Add additional details
3. Click "Add Expense"

### Editing an Expense

1. Click the edit (pencil) icon on any expense row
2. Modify the fields inline
3. Click the checkmark to save or X to cancel

### Deleting an Expense

Click the trash icon on any expense row to delete it permanently.

### Filtering Expenses

Use the dropdown filters at the top of the expense table to:
- Filter by specific month or view all months
- Filter by category or view all categories

### Viewing Analytics

Navigate to the Analytics page to see:
- **Pie Chart**: Breakdown of spending by category with percentages
- **Line Chart**: Spending trends over time by month

### Exporting Data

1. Navigate to Settings
2. Choose your export format:
   - **JSON**: For backup or data portability
   - **CSV**: For use in spreadsheet applications

### Clearing All Data

1. Navigate to Settings
2. Click "Clear All Expenses" in the Danger Zone
3. Confirm the action (this cannot be undone)

## Categories

The app includes the following predefined categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Groceries
- Other

## Data Persistence

All expense data is stored in your browser's LocalStorage. This means:
- ✅ No server required
- ✅ Data persists across browser sessions
- ✅ Complete privacy (data never leaves your device)
- ⚠️ Data is specific to the browser/device
- ⚠️ Clearing browser data will delete expenses

**Tip**: Use the export feature to create backups of your data!

## Building for Production

```bash
npm run build
npm start
```

## Key Technical Features

### Zustand Store with Persistence

The app uses Zustand for state management with automatic LocalStorage synchronization:

```typescript
// Selectors prevent unnecessary re-renders
const expenses = useExpenses();
const { addExpense, deleteExpense } = useExpenseActions();
```

### Hydration Guard

Prevents React hydration mismatches by ensuring LocalStorage is loaded before rendering:

```typescript
<HydrationGuard>
  {/* Your content */}
</HydrationGuard>
```

### Type Safety

Full TypeScript coverage with strict type checking for all components and functions.

### Performance Optimizations

- Zustand selectors prevent unnecessary re-renders
- Memoized chart data calculations
- Efficient filtering and sorting
- Smooth animations with Framer Motion

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Zustand](https://github.com/pmndrs/zustand) for simple state management
- [Recharts](https://recharts.org/) for easy-to-use charts
- [Next.js](https://nextjs.org/) for the amazing framework
