"use client";

import { useState } from "react";
import { AUTH_ROUTES, WEBSITE_ROUTES } from "@/constants";
import {
    Truck,
    LogOut,
    LayoutDashboard,
    MessageSquare,
    UserPlus,
    LogIn,
    Bell,
} from "lucide-react";

export default function Header({ initialAuth }: { initialAuth: boolean }) {
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
    const [hasNotifications, setHasNotifications] = useState(true);

    const handleLogout = () => {
        // 🔹 Remove tokens e cookies
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        localStorage.removeItem("notificacoes");
        document.cookie = "jwt=; Max-Age=0; path=/";

        // 🔹 Atualiza estado e força reload para SSR refletir o logout
        setIsAuthenticated(false);
        window.location.href = AUTH_ROUTES.LOGIN_PAGE;
    };

    return (
        <header className="bg-roglio-blue text-white px-10 py-5 flex items-center justify-between shadow-md h-[80px]">
            {/* Logo + Nome */}
            <a
                href={WEBSITE_ROUTES.PAGINA_INICIAL_PAGE}
                className="flex items-center gap-3 font-bold text-2xl"
            >
                <Truck size={36} />
                <span>Roglio Transportadora</span>
            </a>

            {/* Navegação */}
            <nav className="flex items-center gap-6 text-sm">
                {/* Botão Notificações */}
                {isAuthenticated && (
                    <a
                        href={WEBSITE_ROUTES.NOTIFICACOES_PAGE}
                        className="flex items-center gap-2 hover:underline hover:text-gray-200 transition cursor-pointer"
                    >
                        <button
                            onClick={() => setHasNotifications(false)}
                            className="relative flex items-center gap-2 hover:underline hover:text-gray-200 transition cursor-pointer"
                        >
                            <Bell size={18} />
                            {hasNotifications && (
                                <span className="absolute top-0 left-2 w-2 h-2 bg-red-600 rounded-full border border-white" />
                            )}
                            Notificações
                        </button>
                    </a>
                )}

                {/* Suporte (sempre visível) */}
                <a
                    href={WEBSITE_ROUTES.SUPORTE_PAGE}
                    className="flex items-center gap-2 hover:underline hover:text-gray-200 transition cursor-pointer"
                >
                    <MessageSquare size={18} />
                    Faq
                </a>

                {/* Condicional: se logado → Dashboard/Sair */}
                {isAuthenticated ? (
                    <>
                        <a
                            href={WEBSITE_ROUTES.DASHBOARD_PAGE}
                            className="flex items-center gap-2 hover:underline hover:text-gray-200 transition cursor-pointer"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </a>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 border border-white/30 hover:bg-white/10 transition text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <a
                            href={AUTH_ROUTES.LOGIN_PAGE}
                            className="flex items-center gap-2 hover:underline hover:text-gray-200 transition cursor-pointer"
                        >
                            <LogIn size={18} />
                            Login
                        </a>
                        <a
                            href={AUTH_ROUTES.CADASTRAR_PAGE}
                            className="flex items-center gap-2 border border-white/30 hover:bg-white/10 transition text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            <UserPlus size={18} />
                            Cadastrar
                        </a>
                    </>
                )}
            </nav>
        </header>
    );
}
