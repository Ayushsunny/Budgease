import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/context/BudgetContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Edit2, Plus, Settings, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BudgetSummary() {
  const { budgetData, setSalary, addCategory, removeCategory } = useBudget();
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [newSalary, setNewSalary] = useState(budgetData.salary.toString());
  const [newCategoryName, setNewCategoryName] = useState('');

  const totalAllocated = budgetData.categories.reduce((sum, cat) => sum + (cat.allocation || 0), 0);
  const totalSpent = budgetData.categories.reduce(
    (sum, cat) => sum + cat.expenses.reduce((expSum, exp) => expSum + exp.amount, 0),
    0
  );
  const remainingSalary = budgetData.salary - totalSpent;

  const handleSalaryUpdate = () => {
    const amount = parseFloat(newSalary);
    if (isNaN(amount) || amount <= 0) return;
    setSalary(amount);
    setIsEditingSalary(false);
    toast({
      title: "Salary Updated",
      description: `Monthly salary set to ₨${amount.toLocaleString()}`,
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }
    addCategory(newCategoryName);
    setNewCategoryName('');
    toast({
      title: "Category Added",
      description: `Added new category: ${newCategoryName}`,
    });
  };

  const handleRemoveCategory = (categoryId: string, categoryName: string) => {
    removeCategory(categoryId);
    toast({
      title: "Category Removed",
      description: `Removed category: ${categoryName}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Total Salary</h3>
              <button
                onClick={() => setIsEditingSalary(!isEditingSalary)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
            {isEditingSalary ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full"
                />
                <Button onClick={handleSalaryUpdate}>Save</Button>
              </div>
            ) : (
              <p className="text-3xl font-bold text-primary">
                ₨{budgetData.salary.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Budget Overview</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Categories</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {budgetData.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span>{category.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCategory(category.id, category.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Allocated</h3>
              <p className="text-xl font-bold text-blue-600">
                ₨{totalAllocated.toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Spent</h3>
              <p className="text-xl font-bold text-money-negative">
                ₨{totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Remaining Salary</h3>
              <p className="text-xl font-bold text-money-positive">
                ₨{remainingSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}