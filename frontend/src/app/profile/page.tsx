'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading, error, login, logout } = useAuth();

  // Obtener iniciales del usuario para el avatar
  const getUserInitials = (): string => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No has iniciado sesión</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu perfil y hacer reservas
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={login} className="w-full">
              Iniciar sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.picture} alt={user.name || 'Usuario'} />
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{user.name || 'Usuario'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 rounded-lg border p-4">
              <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">ID de Usuario</p>
                <p className="text-xs text-muted-foreground">{user.sub}</p>
              </div>
            </div>
            
            {/* Aquí se pueden añadir más detalles del perfil */}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={logout} variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
      
      {/* Información de desarrollo para depuración */}
      <div className="mt-8 rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-semibold">Datos de la sesión (desarrollo)</h3>
        <pre className="overflow-auto text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}