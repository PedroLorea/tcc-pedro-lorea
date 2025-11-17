"use client";

interface Option {
  value: string | number;
  label: string;
}

interface FormInputFieldProps {
  label: string;
  type?: string; // "text" | "number" | "date" | "select"
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
  options?: Option[]; // usado quando type="select"
  disabled?: boolean;
}

export default function FormInputField({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  options = [],
  disabled = false,
}: FormInputFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>

      {type === "select" ? (
        <select
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-roglio-blue focus:border-roglio-blue transition bg-white"
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-roglio-blue focus:border-roglio-blue transition"
        />
      )}
    </div>
  );
}
