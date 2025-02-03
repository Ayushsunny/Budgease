import { LoginModal } from "@/components/auth/Login";
import { ChartBar, Lock, Wallet } from "lucide-react";

const features = [
  {
    title: "Track Expenses",
    description: "Gain insights into your spending patterns with detailed expense tracking.",
    icon: ChartBar
  },
  {
    title: "Set Budgets",
    description: "Create and manage financial goals with intuitive budget setting tools.",
    icon: Wallet
  },
  {
    title: "Secure & Sync",
    description: "Your financial data is encrypted and seamlessly synchronized across devices.",
    icon: Lock
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-br from-blue-50 to-indigo-100 md:px-4 px-8 md:py-12 pt-24 pb-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 py-4">
          Budget Tracker
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          Effortlessly manage your finances, track expenses, and achieve your financial goals with our intelligent budget tracking solution.
        </p>

        <LoginModal triggerClassName="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 md:mb-20 mb-10 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
          Get Started
        </LoginModal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="bg-blue-100/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Landing;