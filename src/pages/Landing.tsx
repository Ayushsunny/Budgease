import { LoginModal } from "@/components/auth/Login";

const features = [
  { title: "Track Expenses", description: "Monitor where your money goes.", icon: "📊" },
  { title: "Set Budgets", description: "Stay on top of your financial goals.", icon: "💰" },
  { title: "Secure & Sync", description: "Your data is safe and synced.", icon: "🔒" },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-800">Budget Tracker</h1>
      <p className="text-gray-600 mt-2">Manage your expenses and budgets efficiently.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {features.map((feature, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md text-center">
            <span className="text-4xl">{feature.icon}</span>
            <h2 className="text-lg font-semibold mt-2">{feature.title}</h2>
            <p className="text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>

      <LoginModal triggerClassName="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg">
        Get Started
      </LoginModal>
    </div>
  );
};

export default Landing;