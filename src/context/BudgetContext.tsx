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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          
          // Set up real-time listener
          const unsub = onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              if (userData.budgetData) {
                setBudgetData(userData.budgetData);
              }
              setIsLoading(false);
            } else {
              // If no budget data exists, set up initial data
              const initialBudgetData = {
                salary: 0,
                categories: defaultCategories,
              };
              await setDoc(userDocRef, { budgetData: initialBudgetData }, { merge: true });
              setBudgetData(initialBudgetData);
              setIsLoading(false);
            }
          }, (error) => {
            console.error('Error fetching budget data:', error);
            setIsLoading(false);
            toast({
              title: 'Error',
              description: 'Could not load budget data',
              variant: 'destructive',
            });
          });
  
          // Return unsubscribe function
          return () => unsub();
        } catch (error) {
          console.error('Authentication error:', error);
          setIsLoading(false);
        }
      } else {
        // Reset to default when no user is logged in
        setBudgetData({
          salary: 0,
          categories: defaultCategories,
        });
        setIsLoading(false);
      }
    });
  
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const updateFirestoreData = async (newBudgetData: BudgetData) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is logged in.');
      return;
    }
  
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
      isLoading,
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