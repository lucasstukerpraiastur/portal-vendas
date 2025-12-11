import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

export function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white shadow-lg",
    outline:
      "border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 bg-transparent",
    danger:
      "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/30",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin h-5 w-5 absolute left-4" />
      )}
      <span className={isLoading ? "pl-6" : ""}>{children}</span>
    </button>
  );
}
