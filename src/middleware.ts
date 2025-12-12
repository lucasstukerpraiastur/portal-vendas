import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // pega os tokens
  const token = request.cookies.get("token")?.value;

  //define as URL base
  const signInURL = new URL("/login", request.url);
  const dashboardURL = new URL("/dashboard", request.url);

  const pathname = request.nextUrl.pathname;

  // --- DEFINIÇÃO DE ROTAS PÚBLICAS ---
  // Adicione aqui todas as páginas que não precisam de login
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/esqueci-senha" ||
    pathname === "/recuperar-senha";

  const isPublicFile = pathname.includes(".");

  // 1. Se NÃO tem token e NÃO está em rota pública -> Manda pro Login
  if (!token && !isPublicRoute && !isPublicFile) {
    return NextResponse.redirect(signInURL);
  }

  // 2. Se TEM token e tenta acessar rotas públicas (Login/Recuperar) -> Manda pro Dashboard
  // (Opcional: se você quiser deixar ele redefinir senha mesmo logado, tire a checagem das rotas de senha aqui)
  if (token && isPublicRoute) {
    return NextResponse.redirect(dashboardURL);
  }

  // 3. Se acessar a Raiz (/) -> Redireciona inteligente
  if (pathname === "/") {
    return NextResponse.redirect(token ? dashboardURL : signInURL);
  }

  return NextResponse.next();
}

export const config = {
  // O matcher ignora pastas api, _next e arquivos estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
