import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';
import { Edit2, Plus } from 'lucide-react';

interface ExpenseCardProps {
  category: Category;
}

export function ExpenseCard({ category }: ExpenseCardProps) {
  const { addExpense, editAllocation } = useBudget();
  const [newExpense, setNewExpense] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newAllocation, setNewAllocation] = useState(category.allocation.toString());

  const totalSpent = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = category.allocation - totalSpent;

  const handleAddExpense = () => {
    const amount = parseFloat(newExpense);
    if (isNaN(amount) || amount <= 0) return;

    addExpense(category.id, {
      amount,
      date: new Date().toISOString(),
    });
    setNewExpense('');
  };

  const handleEditAllocation = () => {
    const amount = parseFloat(newAllocation);
    if (isNaN(amount) || amount <= 0) return;

    editAllocation(category.id, amount);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {category.name}
        </CardTitle>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              type="number"
              value={newAllocation}
              onChange={(e) => setNewAllocation(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleEditAllocation}>Save</Button>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">₨{category.allocation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Allocated
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">Spent:</span>
                <span className="ml-auto font-medium text-money-negative">
                  ₨{totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">Remaining:</span>
                <span className={`ml-auto font-medium ${remaining >= 0 ? 'text-money-positive' : 'text-money-negative'}`}>
                  ₨{remaining.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  type="number"
                  placeholder="Add expense"
                  value={newExpense}
                  onChange={(e) => setNewExpense(e.target.value)}
                  className="w-full"
                />
                <Button onClick={handleAddExpense} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}