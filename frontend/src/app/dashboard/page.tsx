export default function DashboardPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Dashboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Aquí verás un resumen de tu actividad, próximos partidos, etc. (Contenido Placeholder)
        </p>
      </div>
      {/* Placeholder for dashboard content */}
    </section>
  );
}