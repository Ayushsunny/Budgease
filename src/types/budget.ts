export interface Expense {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  allocation: number;
  expenses: Expense[];
}

export interface BudgetData {
  salary: number;
  categories: Category[];
}