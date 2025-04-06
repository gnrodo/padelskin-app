import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Placeholder data - replace with actual user data fetched from backend/context
const userProfile = {
  name: "Juan Perez",
  email: "juan.perez@example.com",
  initials: "JP",
  avatarUrl: undefined, // "https://github.com/shadcn.png", // Example URL
  padelCategory: "6ta",
  reliabilityScore: 95,
};

export default function ProfilePage() {
  return (
    <section className="container px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tu Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback>{userProfile.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue={userProfile.name} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={userProfile.email} disabled /> {/* Disable email editing for now */}
              </div>
            </div>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div className="space-y-1">
                 <Label htmlFor="category">Categoría</Label>
                 {/* TODO: Replace with Select component when added */}
                 <Input id="category" defaultValue={userProfile.padelCategory} />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="phone">Teléfono (Opcional)</Label>
                 <Input id="phone" placeholder="Tu número de teléfono" />
               </div>
             </div>
             {/* Add more fields as needed */}
          </CardContent>
          <CardFooter>
            <Button>Guardar Cambios</Button>
          </CardFooter>
        </Card>

        {/* Stats/Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Resumen de tu actividad.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Ranking Confiabilidad:</span>
                <span className="font-medium">{userProfile.reliabilityScore}%</span>
             </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Partidos Jugados:</span>
                <span className="font-medium">12</span> {/* Placeholder */}
             </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Victorias:</span>
                <span className="font-medium">8</span> {/* Placeholder */}
             </div>
             {/* Add more stats */}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}