"use client";

import { AUTENTICACAO_SERVICE_API, AUTH_ROUTES } from "@/constants";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CadastroDTO } from "@/types";
import { sendJsonMessage } from "@/utils/sendJsonMessage";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cnpj: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Máscara de CNPJ
  const applyCnpjMask = (value: string) => {
    return value
      .replace(/\D/g, "") // remove tudo que não for número
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 🔹 Aplica máscara apenas no campo CNPJ
    const newValue = name === "cnpj" ? applyCnpjMask(value) : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnpj) newErrors.cnpj = "CNPJ é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    if (formData.password !== formData.password2) {
      newErrors.password2 = "As senhas não coincidem";
    }
    if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      const cadastroDTO: CadastroDTO = {
        email: formData.email,
        // 🔹 Envia o CNPJ sem formatação para o backend
        cnpj: formData.cnpj.replace(/\D/g, ""),
        password: formData.password,
        password2: formData.password2,
      };

      const response = await sendJsonMessage(
        "POST",
        AUTENTICACAO_SERVICE_API.REGISTRAR,
        "",
        cadastroDTO
      );

      setSuccess(true);
      setTimeout(() => {
        router.push(AUTH_ROUTES.LOGIN_PAGE);
      }, 2000);
      setErrors(response);

    } catch (err) {
      setErrors({ non_field_errors: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Lado Esquerdo - Imagem */}
      <div className="hidden lg:flex flex-1">
        <img
          src="/mulher-de-tiro-completo-consertando-caminhao.jpg"
          alt="Caminhão na estrada"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Título */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">Crie sua conta</h1>
            <p className="text-gray-500 mt-2">Preencha os dados abaixo</p>
          </div>

          {/* Mensagem de sucesso */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
              Usuário criado com sucesso! Redirecionando...
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CNPJ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.cnpj ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cnpj}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirmação de Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmação de Senha
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className={`mt-1 w-full rounded-xl border px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password2 ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.password2 && (
                <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
              )}
            </div>

            {/* Erro geral */}
            {errors.non_field_errors && (
              <p className="text-sm text-red-600 text-center">
                {errors.non_field_errors}
              </p>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-4 py-3 text-white font-semibold transition ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {/* Link para login */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Já tem uma conta?{" "}
              <Link
                href={AUTH_ROUTES.LOGIN_PAGE}
                className="text-indigo-600 hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
