"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User } from "lucide-react"; // Importar íconos adicionales

import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-provider"; // Importar useAuth

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { user, isLoading, login, logout } = useAuth(); // Usar hook de autenticación

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bookings", label: "Reservas" },
    { href: "/profile", label: "Perfil" },
  ];

  // Función para obtener iniciales del usuario
  const getUserInitials = (): string => {
    if (!user || !user.name) return "U";
    return user.name.split(" ")
      .map(name => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo/Brand Name */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">PadelSkin Club</span>
        </Link>

        {/* Desktop Navigation (Hidden on small screens) */}
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls (Theme toggle, User Menu, Mobile Menu) */}
        <div className="flex flex-1 items-center justify-end space-x-3">
          <ThemeToggleButton />

          {/* Botón de login o perfil de usuario */}
          {isLoading ? (
            // Estado de carga
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            // Usuario autenticado - Mostrar avatar y menú desplegable
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.picture} alt={user.name || "Usuario"} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">{user.name || "Usuario"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-2">
                  <Link href="/profile" className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-muted">
                    <User className="h-4 w-4" />
                    Perfil
                  </Link>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            // Usuario no autenticado - Mostrar botón de login
            <Button variant="default" size="sm" onClick={login}>
              Iniciar sesión
            </Button>
          )}

          {/* Mobile Menu Button (Visible only on small screens) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle>Menú Principal</SheetTitle>
              </SheetHeader>
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg transition-colors hover:text-foreground/80",
                      pathname === item.href
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Añadir botón de login/logout en el menú móvil */}
                {!isLoading && (
                  <div className="mt-4 pt-4 border-t">
                    {user ? (
                      <button
                        onClick={() => {
                          setIsSheetOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 py-2 text-lg text-destructive"
                      >
                        <LogOut className="h-5 w-5" />
                        Cerrar sesión
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsSheetOpen(false);
                          login();
                        }}
                        className="flex w-full items-center gap-2 py-2 text-lg"
                      >
                        <User className="h-5 w-5" />
                        Iniciar sesión
                      </button>
                    )}
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}