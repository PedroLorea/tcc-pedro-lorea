// utils/dateFormat.ts
export function formatDate(dateString?: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Ajusta para o horário local e formata no padrão brasileiro
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
