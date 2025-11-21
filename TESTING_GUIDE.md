# 🧪 Testing Guide

Complete guide for testing the Expense Tracker with dummy data.

---

## 🎯 Quick Start

### Method 1: Web Interface (Easiest) ⭐

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the data injector:
   ```
   http://localhost:3000/dummy-data-injector.html
   ```

3. Choose a preset or customize values
4. Click "Generate Dummy Data"
5. Click "Open Expense Tracker"
6. See your app populated with test data! 🎉

### Method 2: Browser Console

1. Open your app: `http://localhost:3000`
2. Open DevTools Console (F12)
3. Copy and paste the contents of `scripts/generate-dummy-data.js`
4. Run:
   ```javascript
   generateDummyData()
   ```
5. Refresh the page

---

## 📊 Testing Scenarios

### Light Testing (Quick Checks)
```javascript
generateDummyData({ 
  expenseCount: 50, 
  incomeCount: 6, 
  debtCount: 2, 
  monthsBack: 3 
})
```
**Use for:**
- Quick UI checks
- Basic functionality testing
- Fast iteration during development

### Medium Testing (Realistic Data)
```javascript
generateDummyData({ 
  expenseCount: 200, 
  incomeCount: 12, 
  debtCount: 5, 
  monthsBack: 6 
})
```
**Use for:**
- Comprehensive feature testing
- Chart and analytics validation
- Filter and search testing

### Heavy Testing (Performance)
```javascript
generateDummyData({ 
  expenseCount: 1000, 
  incomeCount: 24, 
  debtCount: 15, 
  monthsBack: 12 
})
```
**Use for:**
- Performance testing
- Pagination testing
- Memory usage monitoring
- Large dataset handling

### Stress Testing (Extreme Cases)
```javascript
generateDummyData({ 
  expenseCount: 5000, 
  incomeCount: 48, 
  debtCount: 50, 
  monthsBack: 24 
})
```
**Use for:**
- Breaking point identification
- Optimization validation
- Edge case discovery

---

## 🔍 What to Test

### 1. Dashboard
- [ ] Monthly summary cards display correctly
- [ ] Budget overview shows accurate progress
- [ ] Debt list displays paid/unpaid correctly
- [ ] Actions menu works for all types
- [ ] Confetti triggers on milestones

### 2. Expense Table
- [ ] All expenses display correctly
- [ ] Monthly filter works
- [ ] Category filter works
- [ ] Combined filters work
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Sorting by date works

### 3. Income Page
- [ ] All incomes display correctly
- [ ] Grouped by month
- [ ] Monthly totals are accurate
- [ ] Delete functionality works
- [ ] Add income works

### 4. Analytics
- [ ] Pie chart displays all categories
- [ ] Line chart shows trends
- [ ] Income vs Expenses chart accurate
- [ ] All values calculate correctly
- [ ] Charts responsive on mobile

### 5. Debt Management
- [ ] All debts display correctly
- [ ] Paid/unpaid separation works
- [ ] Mark as paid functionality works
- [ ] Delete functionality works
- [ ] Totals calculate correctly

### 6. Budget Overview
- [ ] Progress ring displays correctly
- [ ] Percentages accurate
- [ ] Totals match data
- [ ] Visual indicators correct

### 7. Filters
- [ ] Monthly filter shows all months
- [ ] Category filter shows all categories
- [ ] "All" option works
- [ ] Filter combinations work
- [ ] Filtered totals accurate

### 8. Performance
- [ ] Initial load time acceptable
- [ ] Scroll performance smooth
- [ ] Filter response time fast
- [ ] Chart rendering smooth
- [ ] No UI freezing

### 9. Internationalization
- [ ] English translations correct
- [ ] Arabic translations correct
- [ ] RTL layout works properly
- [ ] Numbers format correctly
- [ ] Dates format correctly

### 10. PWA Features
- [ ] Install prompt appears
- [ ] Offline mode works
- [ ] Service worker caches correctly
- [ ] Update notification works
- [ ] App shortcuts functional

---

## 🎨 Testing Dark Mode

1. Generate dummy data
2. Toggle between light/dark modes
3. Check all pages:
   - Dashboard
   - Income
   - Analytics
   - Settings
4. Verify:
   - Colors contrast properly
   - Charts readable
   - Text visible
   - Icons clear

---

## 🌍 Testing Internationalization

### English
1. Generate dummy data
2. Switch to English
3. Check all UI elements
4. Verify text alignment (LTR)

### Arabic
1. Generate dummy data
2. Switch to Arabic
3. Check all UI elements
4. Verify text alignment (RTL)
5. Check sidebar positioning
6. Check toast positioning

---

## 📱 Testing Responsiveness

### Desktop (1920x1080)
- [ ] Layout uses full width appropriately
- [ ] Sidebar navigation works
- [ ] Charts display full size
- [ ] Tables readable

### Tablet (768x1024)
- [ ] Layout adapts to screen
- [ ] Sidebar toggles correctly
- [ ] Charts remain readable
- [ ] Touch interactions work

### Mobile (375x667)
- [ ] Layout single column
- [ ] Sidebar overlay works
- [ ] Charts responsive
- [ ] Tables scrollable
- [ ] Buttons accessible

---

## 🔄 Testing Data Operations

### Adding Data
```javascript
// Generate base data
generateDummyData({ expenseCount: 50 })

// Then manually add more through UI:
- Add 5 expenses
- Add 2 incomes
- Add 1 debt

// Verify all additions appear
```

### Editing Data
```javascript
// Generate data
generateDummyData({ expenseCount: 20 })

// Edit various expenses
// Check updates persist
// Refresh and verify
```

### Deleting Data
```javascript
// Generate data
generateDummyData({ expenseCount: 30 })

// Delete various items
// Check totals update
// Verify chart updates
```

### Bulk Operations
```javascript
// Generate large dataset
generateDummyData({ expenseCount: 500 })

// Export to CSV
// Export to JSON
// Clear all data
// Re-import
```

---

## 🐛 Common Issues to Check

### Data Issues
- [ ] Negative amounts handled
- [ ] Zero amounts handled
- [ ] Missing notes handled
- [ ] Invalid dates handled
- [ ] Duplicate IDs prevented

### UI Issues
- [ ] Empty states display
- [ ] Loading states display
- [ ] Error states display
- [ ] Overflow text handled
- [ ] Long category names handled

### Performance Issues
- [ ] Large datasets load
- [ ] Filters don't freeze UI
- [ ] Charts render quickly
- [ ] Scroll remains smooth
- [ ] Memory doesn't leak

### Browser Compatibility
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if available)
- [ ] Mobile browsers work

---

## 📈 Performance Benchmarks

| Dataset Size | Load Time | Filter Time | Chart Render |
|--------------|-----------|-------------|--------------|
| 50 items     | < 100ms   | < 50ms      | < 100ms      |
| 200 items    | < 200ms   | < 100ms     | < 200ms      |
| 1000 items   | < 500ms   | < 200ms     | < 500ms      |
| 5000 items   | < 2s      | < 500ms     | < 1s         |

---

## 🔧 Utility Commands

```javascript
// Generate specific test case
generateDummyData({ 
  expenseCount: 100,
  incomeCount: 12,
  debtCount: 5,
  monthsBack: 6
})

// View current data structure
viewCurrentData()

// Clear and start fresh
clearAllData()
```

---

## 📝 Testing Checklist

### Before Release
- [ ] Test with light data (50 items)
- [ ] Test with heavy data (1000+ items)
- [ ] Test all CRUD operations
- [ ] Test all filters
- [ ] Test both themes (light/dark)
- [ ] Test both languages (EN/AR)
- [ ] Test on mobile device
- [ ] Test offline functionality
- [ ] Test PWA installation
- [ ] Test data export/import
- [ ] Test in different browsers
- [ ] Check console for errors
- [ ] Verify LocalStorage size
- [ ] Performance profiling

---

## 🎉 Happy Testing!

Use the dummy data generator to thoroughly test your app and ensure everything works perfectly across all scenarios.

**Pro Tip:** Start with small datasets during development, then gradually increase to test performance and edge cases.


