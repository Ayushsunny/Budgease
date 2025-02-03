import { BudgetProvider } from '@/context/BudgetContext';
import { ExpenseCard } from '@/components/ExpenseCard';
import { BudgetSummary } from '@/components/BudgetSummary';
import { useBudget } from '@/context/BudgetContext';
import { Menu, Wallet } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Dashboard() {
  const { budgetData } = useBudget();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">BudgetTracker</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

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

const Index = () => {
  return (
    <BudgetProvider>
      <Dashboard />
    </BudgetProvider>
  );
};

export default Index;