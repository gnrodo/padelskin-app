import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button"; // Import Button and variants
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          {/* Optional: Logo Placeholder */}
          {/* <Link href="/" className="flex items-center space-x-2">...</Link> */}

          <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Tu Club de Pádel, <span className="text-primary">Digitalizado</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Gestiona tus reservas, organiza partidos, conecta con jugadores y
            mejora tu juego. Todo en un solo lugar.
          </p>
          <div className="space-x-4">
            <Link href="/bookings" className={cn(buttonVariants({ size: "lg" }))}>
              Reservar Cancha
            </Link>
            <Link
              href="/#features" // Placeholder link to a future features section
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" })
              )}
            >
              Saber Más
            </Link>
          </div>
        </div>
      </section>

      {/* Placeholder for Features Section */}
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Funcionalidades
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            (Aquí iría una descripción de las características principales:
            reservas online, creación de partidos, ranking, perfiles, etc.)
          </p>
        </div>
        {/* Grid for features */}
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {/* Feature Card Example */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              {/* Icon Placeholder */}
              <div className="space-y-2">
                <h3 className="font-bold">Reservas Fáciles</h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra y reserva tu cancha en segundos.
                </p>
              </div>
            </div>
          </div>
           {/* Add more feature cards here */}
           <div className="relative overflow-hidden rounded-lg border bg-background p-2">...</div>
           <div className="relative overflow-hidden rounded-lg border bg-background p-2">...</div>
        </div>
      </section>

      {/* Placeholder for other sections (e.g., Testimonials, Call to Action) */}
    </>
  );
}
