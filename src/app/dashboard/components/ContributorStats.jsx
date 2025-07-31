import { FaTasks, FaCheckCircle, FaProjectDiagram, FaChartLine } from 'react-icons/fa';

const StatCard = ({ icon: Icon, title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-teal-900 mt-2">{value}</h3>
        {change && (
          <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className="bg-teal-50 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
    </div>
  </div>
);

export default function ContributorStats() {
  const stats = [
    { icon: FaTasks, title: "Assigned Stones", value: "12", change: 20 },
    { icon: FaCheckCircle, title: "Completed Stones", value: "45", change: 15 },
    { icon: FaProjectDiagram, title: "Active Projects", value: "3", change: 0 },
    { icon: FaChartLine, title: "Completion Rate", value: "87%", change: 5 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 