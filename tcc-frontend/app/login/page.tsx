"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AUTENTICACAO_SERVICE_API, AUTH_ROUTES, WEBSITE_ROUTES } from "@/constants";
import { sendJsonMessage } from "@/utils/sendJsonMessage";
import { LoginDTO } from "@/types";
import { connectWebSocket } from "@/utils/websocket";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [loading, setLoading] = useState(false);
	const [erro, setErro] = useState("");
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!email || !senha) {
			setErro("Preencha email e senha.");
			return;
		}
		setLoading(true);
		setErro("");

		try {

			const loginDTO: LoginDTO = {
				email: email,
				senha: senha
			}

			const response = await sendJsonMessage("POST", AUTENTICACAO_SERVICE_API.LOGIN, "", loginDTO);

			const jwt = response.token;
			localStorage.setItem("jwt", jwt);
			document.cookie = `jwt=${jwt}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;


			const payloadBase64 = jwt.split(".")[1];
			const payloadJson = JSON.parse(atob(payloadBase64));

			console.log("payloadJson.user_id: ", payloadJson.user_id)

			const userId = payloadJson.user_id;
			localStorage.setItem("user_id", userId);

			connectWebSocket(jwt, userId);

			window.location.href = WEBSITE_ROUTES.DASHBOARD_PAGE;
		} catch (error) {
			setErro("Erro ao logar: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-[calc(100vh-80px)]">
			{/* Lado Esquerdo - Imagem */}
			<div className="hidden lg:flex flex-1">
				<img
					src="/caminhao_estrada.jpeg"
					alt="Caminhão na estrada"
					className="w-full h-full object-cover"
				/>
			</div>
			{/* Lado Direito - Formulário */}
			<div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
				<div className="w-full max-w-md space-y-8">
					{/* Logo ou Título */}
					<div className="text-center">
						<h1 className="text-4xl font-bold text-gray-800">Bem-vindo!</h1>
						<p className="text-gray-500 mt-2">Faça login para continuar</p>
					</div>
					{/* Formulário */}
					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Senha
							</label>
							<input
								type="password"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						{erro && <p className="text-red-600 text-sm">{erro}</p>}
						{/* Botão de Login */}
						<button
							type="submit"
							disabled={loading}
							className="w-full block text-center rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
						>
							{loading ? "Entrando..." : "Entrar"}
						</button>
					</form>
					{/* Links adicionais */}
					<div className="text-center text-sm text-gray-600 cursor-pointer">
						<p>
							Não tem uma conta?{" "}
							<Link href={AUTH_ROUTES.CADASTRAR_PAGE} className="text-indigo-600 hover:underline">
								Cadastre-se
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}