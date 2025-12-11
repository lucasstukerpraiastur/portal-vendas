export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 border-b border-gray-100 pb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
