"use client"; // Convert to Client Component

import * as React from "react"; // Import React for useState
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname hook
import { Menu } from "lucide-react"; // Import Menu icon

import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Button } from "@/components/ui/button"; // Import Button
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  // SheetClose, // Removed SheetClose import
  SheetHeader, // Import SheetHeader
  SheetTitle, // Import SheetTitle
} from "@/components/ui/sheet"; // Import Sheet components
import { cn } from "@/lib/utils"; // Import cn utility for merging classes

export function Header() {
  const pathname = usePathname(); // Get current pathname
  const [isSheetOpen, setIsSheetOpen] = React.useState(false); // State for sheet

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bookings", label: "Reservas" },
    { href: "/profile", label: "Perfil" },
    // Add more items if needed, e.g., { href: "/", label: "Inicio" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Added px-4 for explicit horizontal padding */}
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo/Brand Name */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Placeholder for Logo */}
          {/* <Icons.logo className="h-6 w-6" /> */}
          <span className="font-bold">PadelSkin Club</span> {/* Simplified for mobile first */}
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
                  ? "text-foreground" // Active link style
                  : "text-foreground/60" // Inactive link style
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls (Theme toggle, Mobile Menu) */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggleButton />

          {/* Mobile Menu Button (Visible only on small screens) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            {/* Added p-6 for padding inside the sheet */}
            <SheetContent side="left" className="p-6"> {/* Or "right" */}
              <SheetHeader className="mb-4 text-left"> {/* Added SheetHeader */}
                <SheetTitle>Menú Principal</SheetTitle> {/* Added SheetTitle */}
                {/* Optional: Add SheetDescription here if needed */}
              </SheetHeader>
              {/* Removed the previous custom header div */}
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  // Removed SheetClose wrapper, added onClick to Link
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg transition-colors hover:text-foreground/80", // Larger text for mobile
                      pathname === item.href
                        ? "text-foreground font-semibold" // Active link style
                        : "text-muted-foreground" // Inactive link style (using muted for more contrast)
                    )}
                    onClick={() => setIsSheetOpen(false)} // Close sheet on click
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {/* Optional: Add Login/Logout button here for mobile */}
            </SheetContent>
          </Sheet>

          {/* Placeholder for Desktop User Profile/Login Button */}
          {/* <Button variant="outline" className="hidden md:inline-flex">Login</Button> */}
        </div>
      </div>
    </header>
  );
}