"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "../service/api";
// 1. IMPORTAÇÃO CORRETA (Apaguei aquele const toast manual)
import { toast } from "sonner";

interface User {
  id: number;
  nome: string;
  email: string;
  role: "ADMIN" | "SUPERVISOR" | "VENDEDOR";
  telefone?: string;
  sub?: string; // O ID do usuário que vem do token (subject)
  // Às vezes mapeamos para id também
}

interface AuthContextType {
  signIn: (data: { email: string; password: string }) => Promise<User>;
  signOut: () => void;
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Função de SignOut otimizada
  const signOut = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
    setIsLoggingOut(false);
  }, [router]);

  // Função de SignIn
  async function signIn({ email, password }: any): Promise<User> {
    try {
      const response = await api.post("/api/auth-vendedor/login", {
        email,
        password,
      });

      const { token, vendedor, role } = response.data;

      const userData: User = {
        ...vendedor,
        role: role,
      };

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(userData), { expires: 1 });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  // UseEffect único para carregar usuário E configurar o interceptor
  useEffect(() => {
    // 1. Recupera sessão ao dar F5
    const token = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (token && savedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }

    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url;

        if (requestUrl?.includes("/login")) {
          return Promise.reject(error);
        }
        if ((status === 401 || status === 403) && !isLoggingOut) {
          setIsLoggingOut(true);

          toast.error("Sessão expirada!", {
            description: "Você será redirecionado para o login.",
            duration: 2000,
          });

          setTimeout(() => {
            signOut();
          }, 2000);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [signOut, isLoggingOut]); // Dependências

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, user, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
