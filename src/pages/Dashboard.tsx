import { ExpenseCard } from "@/components/ExpenseCard";
import { BudgetSummary } from "@/components/BudgetSummary";
import { useBudget } from "@/context/BudgetContext";
import type { User } from 'firebase/auth';
import { useEffect, useState } from "react";
import { authStateListener } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';

function Dashboard() {
  const { budgetData, isLoading } = useBudget();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = authStateListener((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 pt-24 pb-8">
        <BudgetSummary />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {budgetData.categories.map((category) => (
            <ExpenseCard key={category.id} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;