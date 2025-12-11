import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-bold text-gray-800">
            {" "}
            {/* Label mais escuro */}
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-white
            text-gray-900 placeholder:text-gray-400  /* <-- AQUI ESTÁ A MÁGICA */
            font-medium
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all
            disabled:bg-gray-100 disabled:text-gray-500
            ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-600 font-semibold">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
