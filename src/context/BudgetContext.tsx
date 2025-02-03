import React, { createContext, useContext, useState, useEffect } from 'react';
import { BudgetData, Category, Expense } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

interface BudgetContextType {
  budgetData: BudgetData;
  setSalary: (amount: number) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  addExpense: (categoryId: string, expense: Omit<Expense, 'id'>) => void;
  editAllocation: (categoryId: string, amount: number) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryId: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Rent', allocation: 0, expenses: [] },
  { id: '2', name: 'Home', allocation: 0, expenses: [] },
  { id: '3', name: 'Suits', allocation: 0, expenses: [] },
  { id: '4', name: 'Food Order', allocation: 0, expenses: [] },
  { id: '5', name: 'Grocery', allocation: 0, expenses: [] },
  { id: '6', name: 'Shop', allocation: 0, expenses: [] },
  { id: '7', name: 'Misc', allocation: 0, expenses: [] },
];

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [budgetData, setBudgetData] = useState<BudgetData>(() => {
    const saved = localStorage.getItem('budgetData');
    return saved ? JSON.parse(saved) : {
      salary: 0,
      categories: defaultCategories,
    };
  });

  useEffect(() => {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }, [budgetData]);

  const setSalary = (amount: number) => {
    setBudgetData(prev => ({ ...prev, salary: amount }));
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ),
    }));
  };

  const addExpense = (categoryId: string, expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, expenses: [...cat.expenses, newExpense] }
          : cat
      ),
    }));
  };

  const editAllocation = (categoryId: string, amount: number) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, allocation: amount } : cat
      ),
    }));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      allocation: 0,
      expenses: [],
    };

    setBudgetData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const removeCategory = (categoryId: string) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId),
    }));
  };

  return (
    <BudgetContext.Provider value={{
      budgetData,
      setSalary,
      updateCategory,
      addExpense,
      editAllocation,
      addCategory,
      removeCategory,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}