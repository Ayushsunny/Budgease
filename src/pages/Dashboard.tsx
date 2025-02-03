import { ExpenseCard } from "@/components/ExpenseCard";
import { BudgetSummary } from "@/components/BudgetSummary";
import { useBudget } from "@/context/BudgetContext";
import type { User } from 'firebase/auth';
import { useEffect, useState } from "react";
import { authStateListener } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { budgetData } = useBudget();
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
  }, []);

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
