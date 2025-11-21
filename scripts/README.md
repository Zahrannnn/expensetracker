# 🛠️ Utility Scripts

This folder contains utility scripts for development and testing.

---

## 📄 Available Scripts

### 1. **generate-dummy-data.js** 
Generate realistic dummy data for testing the app.

#### How to Use:

**Method 1: Browser Console (Recommended)**
1. Open your app in the browser
2. Open DevTools (F12) → Console tab
3. Copy the entire `generate-dummy-data.js` file contents
4. Paste into the console and press Enter
5. Run: `generateDummyData()`
6. Refresh the page

**Method 2: Quick Bookmarklet**
Create a browser bookmarklet for instant data generation:
1. Create a new bookmark
2. Set the URL to:
```javascript
javascript:(function(){fetch('http://localhost:3000/scripts/generate-dummy-data.js').then(r=>r.text()).then(eval)})();
```
3. Click the bookmark when on your app

#### Available Commands:

```javascript
// Generate default data (100 expenses, 12 incomes, 5 debts, 6 months)
generateDummyData()

// Generate custom data
generateDummyData({
  expenseCount: 500,   // Number of expenses
  incomeCount: 24,     // Number of incomes
  debtCount: 10,       // Number of debts
  monthsBack: 12       // Months of historical data
})

// Clear all data
clearAllData()

// View current data
viewCurrentData()
```

#### Examples:

```javascript
// Light testing (50 transactions)
generateDummyData({ 
  expenseCount: 50, 
  incomeCount: 6, 
  debtCount: 2, 
  monthsBack: 3 
})

// Heavy testing (1000+ transactions)
generateDummyData({ 
  expenseCount: 1000, 
  incomeCount: 24, 
  debtCount: 20, 
  monthsBack: 24 
})

// Performance stress test (5000+ transactions)
generateDummyData({ 
  expenseCount: 5000, 
  incomeCount: 48, 
  debtCount: 50, 
  monthsBack: 48 
})
```

#### Generated Data Includes:

**Expenses:**
- Random amounts (10-510 EGP)
- 30+ different categories
- Realistic notes (70% have notes)
- Distributed over specified months

**Income:**
- Random amounts (2000-7000 EGP)
- 6 different sources (Salary, Freelance, Business, Investment, Gift, Other)
- Monthly distribution

**Debts:**
- Random amounts (1000-11000 EGP)
- 8 different creditors
- 50% marked as paid
- Optional due dates

---

### 2. **generate-icons.js**
Generate all PWA icon sizes from a source image.

#### How to Use:

```bash
# Make sure you have sharp installed
npm install --save-dev sharp

# Run the script
node scripts/generate-icons.js
```

#### What It Does:
- Reads `app/icons8-coin-wallet-96.png`
- Generates 8 icon sizes: 72, 96, 128, 144, 152, 192, 384, 512
- Saves to `public/icons/`
- Maintains transparency
- High-quality resizing

#### Customization:

To use your own icon:
1. Replace `app/icons8-coin-wallet-96.png` with your icon
2. Update the `inputPath` in the script if needed
3. Run the script

---

## 🎯 Testing Workflows

### Quick Test (Development)
```javascript
// Generate minimal data
generateDummyData({ 
  expenseCount: 20, 
  incomeCount: 3, 
  debtCount: 1, 
  monthsBack: 1 
})
```

### Comprehensive Test
```javascript
// Generate realistic 6-month data
generateDummyData({ 
  expenseCount: 200, 
  incomeCount: 6, 
  debtCount: 3, 
  monthsBack: 6 
})
```

### Performance Test
```javascript
// Generate heavy data to test performance
generateDummyData({ 
  expenseCount: 2000, 
  incomeCount: 24, 
  debtCount: 15, 
  monthsBack: 12 
})
```

### Year of Data Test
```javascript
// Generate full year of financial data
generateDummyData({ 
  expenseCount: 1000, 
  incomeCount: 12, 
  debtCount: 8, 
  monthsBack: 12 
})
```

---

## 💡 Tips

1. **Start Small**: Begin with small datasets (50 expenses) to verify functionality
2. **Incremental Testing**: Gradually increase data size to test performance
3. **Clear Between Tests**: Use `clearAllData()` to start fresh
4. **Check Console**: The script logs detailed summaries
5. **Refresh After Generation**: Always refresh the page after generating data

---

## 🐛 Troubleshooting

### Data Not Showing Up
- Make sure you refreshed the page after running the script
- Check browser console for errors
- Verify localStorage is enabled in your browser

### Script Not Found
- Make sure you're copying the entire script contents
- Check for syntax errors in console
- Try using Method 1 (direct paste) instead of bookmarklet

### Performance Issues
- Reduce `expenseCount` if app becomes slow
- Clear IndexedDB/localStorage if corrupted
- Use Chrome DevTools Performance tab to profile

---

## 📊 Data Structure

The generated data follows this structure:

```json
{
  "state": {
    "expenses": [
      {
        "id": "uuid",
        "amount": 150.50,
        "category": "Food & Dining",
        "date": "2025-01-15T10:30:00.000Z",
        "note": "Lunch with colleagues"
      }
    ],
    "incomes": [
      {
        "id": "uuid",
        "amount": 5000.00,
        "source": "Salary",
        "date": "2025-01-01T00:00:00.000Z",
        "month": "2025-01"
      }
    ],
    "debts": [
      {
        "id": "uuid",
        "amount": 3000.00,
        "creditor": "Bank Loan",
        "reason": "Emergency expense",
        "borrowedDate": "2024-12-01T00:00:00.000Z",
        "dueDate": "2025-06-01T00:00:00.000Z",
        "isPaid": false
      }
    ],
    "hydrated": false
  },
  "version": 0
}
```

---

## 🔒 Privacy Note

All dummy data is:
- ✅ Generated locally in your browser
- ✅ Stored only in LocalStorage
- ✅ Never sent to any server
- ✅ Completely random and fictional
- ✅ Safe to use for testing

---

**Happy Testing! 🎉**


