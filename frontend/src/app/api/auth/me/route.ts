import { NextRequest, NextResponse } from 'next/server';

// Ruta para obtener la información del usuario autenticado
export async function GET(req: NextRequest) {
  try {
    // Extraer información del usuario desde los parámetros de la URL
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    // Si no hay email en la URL, verificar headers
    const authHeader = req.headers.get('Authorization');
    
    // Si no hay información de autenticación, devolver no autenticado
    if (!email && !authHeader) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }
    
    // Si hay un email, usarlo como identificación del usuario
    const userEmail = email || 'usuario@gmail.com';
    const userName = userEmail.split('@')[0]; // Usar la parte antes del @ como nombre
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1); // Capitalizar primera letra
    
    const user = {
      sub: `google|${userEmail.replace(/[@.]/g, '')}`,
      name: formattedName,
      email: userEmail,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`,
      isAuthenticated: true
    };
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}