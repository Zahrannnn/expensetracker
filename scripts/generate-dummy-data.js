/**
 * Dummy Data Generator for Expense Tracker
 * 
 * Run this in the browser console to populate LocalStorage with test data.
 * 
 * Usage:
 * 1. Open the app in your browser
 * 2. Open DevTools Console (F12)
 * 3. Copy and paste this entire script
 * 4. Run: generateDummyData()
 * 5. Refresh the page to see the data
 */

function generateDummyData(config = {}) {
  const {
    expenseCount = 100,
    incomeCount = 12,
    debtCount = 5,
    monthsBack = 6
  } = config;

  // Categories from the app (types/expense.ts)
  const categories = [
    'FastFood',
    'Drinks',
    'Transportation',
    'Clothing',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Other',
  ];

  // Income sources
  const incomeSources = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other'
  ];

  // Creditors for debts
  const creditors = [
    'Bank Loan',
    'Credit Card',
    'Family Member',
    'Friend',
    'Personal Loan',
    'Mortgage',
    'Car Loan',
    'Student Loan'
  ];

  // Notes for expenses
  const expenseNotes = [
    'Weekly shopping',
    'Monthly subscription',
    'Birthday gift',
    'Emergency expense',
    'Planned purchase',
    'Unexpected cost',
    'Regular payment',
    'One-time purchase',
    'Lunch with colleagues',
    'Dinner at restaurant',
    'Coffee break',
    'Taxi to work',
    'Gas station',
    'Online shopping',
    'New shoes',
    'Phone bill',
    'Internet payment',
    'Electricity bill',
    'Water bill',
    'Movie tickets',
    'Concert tickets',
    'Gym membership',
    'Netflix subscription',
    'Spotify premium'
  ];

  // Helper function to generate random date
  function randomDate(monthsBack) {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(start.getMonth() - monthsBack);
    const timestamp = start.getTime() + Math.random() * (now.getTime() - start.getTime());
    return new Date(timestamp).toISOString();
  }

  // Helper function to format date as yyyy-MM
  function formatMonth(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Helper function to generate UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Generate expenses
  const expenses = [];
  for (let i = 0; i < expenseCount; i++) {
    const date = randomDate(monthsBack);
    const expense = {
      id: generateUUID(),
      amount: Math.round((Math.random() * 500 + 10) * 100) / 100, // 10-510 EGP
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date,
      note: Math.random() > 0.3 ? expenseNotes[Math.floor(Math.random() * expenseNotes.length)] : undefined
    };
    expenses.push(expense);
  }

  // Generate incomes
  const incomes = [];
  for (let i = 0; i < incomeCount; i++) {
    const date = randomDate(monthsBack);
    const income = {
      id: generateUUID(),
      amount: Math.round((Math.random() * 5000 + 2000) * 100) / 100, // 2000-7000 EGP
      source: incomeSources[Math.floor(Math.random() * incomeSources.length)],
      date: date,
      month: formatMonth(date)
    };
    incomes.push(income);
  }

  // Generate debts
  const debts = [];
  for (let i = 0; i < debtCount; i++) {
    const borrowedDate = randomDate(monthsBack);
    const isPaid = Math.random() > 0.5;
    const debt = {
      id: generateUUID(),
      amount: Math.round((Math.random() * 10000 + 1000) * 100) / 100, // 1000-11000 EGP
      creditor: creditors[Math.floor(Math.random() * creditors.length)],
      reason: Math.random() > 0.3 ? 'Emergency expense' : undefined,
      borrowedDate: borrowedDate,
      dueDate: Math.random() > 0.5 ? randomDate(0) : undefined,
      isPaid: isPaid,
      paidDate: isPaid ? randomDate(0) : undefined
    };
    debts.push(debt);
  }

  // Create the storage object
  const storageData = {
    state: {
      expenses: expenses,
      incomes: incomes,
      debts: debts,
      hydrated: false
    },
    version: 0
  };

  // Save to localStorage
  try {
    localStorage.setItem('app-storage', JSON.stringify(storageData));
    
    console.log('✅ Dummy data generated successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${expenses.length} expenses`);
    console.log(`   - ${incomes.length} incomes`);
    console.log(`   - ${debts.length} debts`);
    console.log(`   - Spanning ${monthsBack} months`);
    console.log(`\n💡 Refresh the page to see the data!`);
    
    // Calculate totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalDebt = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + d.amount, 0);
    
    console.log(`\n💰 Financial Summary:`);
    console.log(`   - Total Expenses: ${totalExpenses.toFixed(2)} EGP`);
    console.log(`   - Total Income: ${totalIncome.toFixed(2)} EGP`);
    console.log(`   - Unpaid Debts: ${totalDebt.toFixed(2)} EGP`);
    console.log(`   - Net Balance: ${(totalIncome - totalExpenses).toFixed(2)} EGP`);
    
    return {
      success: true,
      data: storageData,
      summary: {
        expenses: expenses.length,
        incomes: incomes.length,
        debts: debts.length,
        totalExpenses,
        totalIncome,
        totalDebt
      }
    };
  } catch (error) {
    console.error('❌ Error generating dummy data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to clear all data
function clearAllData() {
  try {
    localStorage.removeItem('app-storage');
    console.log('✅ All data cleared!');
    console.log('💡 Refresh the page to see the empty state.');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to view current data
function viewCurrentData() {
  try {
    const data = localStorage.getItem('app-storage');
    if (!data) {
      console.log('ℹ️ No data found in localStorage');
      return null;
    }
    const parsed = JSON.parse(data);
    console.log('📊 Current Data:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Error viewing data:', error);
    return null;
  }
}

// Export functions to window for easy access
if (typeof window !== 'undefined') {
  window.generateDummyData = generateDummyData;
  window.clearAllData = clearAllData;
  window.viewCurrentData = viewCurrentData;
  
  console.log('🎯 Dummy Data Generator Loaded!');
  console.log('\nAvailable commands:');
  console.log('  generateDummyData()           - Generate default dummy data (100 expenses, 12 incomes, 5 debts)');
  console.log('  generateDummyData({ ... })    - Generate custom dummy data');
  console.log('  clearAllData()                - Clear all data from localStorage');
  console.log('  viewCurrentData()             - View current data in localStorage');
  console.log('\nCustom options:');
  console.log('  { expenseCount: 200 }         - Number of expenses (default: 100)');
  console.log('  { incomeCount: 24 }           - Number of incomes (default: 12)');
  console.log('  { debtCount: 10 }             - Number of debts (default: 5)');
  console.log('  { monthsBack: 12 }            - Months of historical data (default: 6)');
  console.log('\nExample:');
  console.log('  generateDummyData({ expenseCount: 500, monthsBack: 12 })');
}

// For Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateDummyData,
    clearAllData,
    viewCurrentData
  };
}

