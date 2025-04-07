import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { cn } from "@/lib/utils"; // Import cn utility
import { LandingBackground } from "@/components/landing-background"; // Import the background component

export default function Home() {
  return (
    // Simplified min-height, kept relative positioning and overflow-hidden
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <LandingBackground /> {/* Add the background component */}
      {/* Added z-10 to ensure content is above the background */}
      <div className="z-10 flex w-full max-w-xs flex-col items-center space-y-6 text-center">

        {/* Logo Placeholder */}
        <div className="mb-4 flex flex-col items-center">
           {/* Placeholder for circular logo graphic */}
           <div className="mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gray-800 text-yellow-400">
              {/* Simple placeholder graphic */}
              <span className="text-4xl font-bold">P</span>
           </div>
           <span className="text-sm font-medium text-gray-600 dark:text-gray-400">PADEL CENTER</span>
        </div>


        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Padel Center
        </h1>

        {/* Get Started Button */}
        {/* Approximating dark green color */}
        {/* Changed Button to Link styled as button */}
        <Link
          href="/api/auth/login"
          className={cn(
            buttonVariants({ size: "lg" }), // Apply button styles
            "w-full bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700" // Apply custom colors
          )}
        >
          Comenzar
        </Link>

        {/* Login Link */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link href="/api/auth/login" className="font-medium text-emerald-700 hover:underline dark:text-emerald-500">
            Inicia sesión
          </Link>
        </p>

        {/* Powered by Text */}
        <p className="pt-8 text-xs text-gray-500">
          Powered by <span className="font-semibold">CourtReserve</span> {/* Manteniendo marca */}
        </p>
      </div>
    </main>
  );
}
