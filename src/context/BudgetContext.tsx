import React, { createContext, useContext, useState, useEffect } from 'react';
import { BudgetData, Category, Expense } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface BudgetContextType {
  budgetData: BudgetData;
  setSalary: (amount: number) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  addExpense: (categoryId: string, expense: Omit<Expense, 'id'>) => void;
  editAllocation: (categoryId: string, amount: number) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Rent', allocation: 0, expenses: [] },
  { id: '2', name: 'Home', allocation: 0, expenses: [] },
  { id: '3', name: 'Food Order', allocation: 0, expenses: [] },
  { id: '4', name: 'Grocery', allocation: 0, expenses: [] },
  { id: '5', name: 'Shopping', allocation: 0, expenses: [] },
  { id: '6', name: 'Subscription', allocation: 0, expenses: [] },
  { id: '7', name: 'Misc', allocation: 0, expenses: [] },
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [budgetData, setBudgetData] = useState<BudgetData>({
    salary: 0,
    categories: defaultCategories,
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.budgetData) {
          setBudgetData(userData.budgetData);
        }
      }
    });

    // Initial load
    const loadBudgetData = async () => {
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.budgetData) {
            setBudgetData(userData.budgetData);
          }
        }
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
    };

    loadBudgetData();

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const updateFirestoreData = async (newBudgetData: BudgetData) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { budgetData: newBudgetData }, { merge: true });
    } catch (error) {
      console.error('Error updating budget data:', error);
      toast({
        title: 'Sync Error',
        description: 'Failed to sync budget data',
        variant: 'destructive',
      });
    }
  };

  const setSalary = (amount: number) => {
    const newBudgetData = { ...budgetData, salary: amount };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    const newBudgetData = {
      ...budgetData,
      categories: budgetData.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ),
    };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
  };

  const addExpense = (categoryId: string, expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    const newBudgetData = {
      ...budgetData,
      categories: budgetData.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, expenses: [...cat.expenses, newExpense] }
          : cat
      ),
    };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
  };

  const editAllocation = (categoryId: string, amount: number) => {
    const newBudgetData = {
      ...budgetData,
      categories: budgetData.categories.map(cat =>
        cat.id === categoryId ? { ...cat, allocation: amount } : cat
      ),
    };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      allocation: 0,
      expenses: [],
    };

    const newBudgetData = {
      ...budgetData,
      categories: [...budgetData.categories, newCategory],
    };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
  };

  const removeCategory = (categoryId: string) => {
    const newBudgetData = {
      ...budgetData,
      categories: budgetData.categories.filter(cat => cat.id !== categoryId),
    };
    setBudgetData(newBudgetData);
    updateFirestoreData(newBudgetData);
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