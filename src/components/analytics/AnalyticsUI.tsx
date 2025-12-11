import { BadgeDollarSign, TrendingUp, Calendar, Ticket } from "lucide-react";

export function CardKPI({ title, value, subtitle, icon, color }: any) {
  const bgColors: any = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    orange: "bg-orange-50 border-orange-100",
    purple: "bg-purple-50 border-purple-100",
    pink: "bg-pink-50 border-pink-100",
  };
  return (
    <div
      className={`p-6 rounded-xl border ${
        bgColors[color] || "bg-white"
      } transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

export function BadgeStatus({ status }: { status: string }) {
  const styles: any = {
    APROVADO: "bg-green-100 text-green-700",
    PENDENTE: "bg-yellow-100 text-yellow-700",
    CANCELADO: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
