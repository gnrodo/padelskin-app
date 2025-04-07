// src/app/api/auth/[auth0]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Implementación simplificada para superar problemas de compatibilidad 
// entre Auth0 SDK 4.4.1 y Next.js 15 / React 19

export async function GET(
  req: NextRequest,
  { params }: { params: { auth0: string } }
) {
  const action = params.auth0;
  const AUTH0_BASE_URL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  const AUTH0_ISSUER = process.env.AUTH0_ISSUER_BASE_URL;
  const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;

  try {
    console.log(`Procesando solicitud de autenticación: ${action}`);
    
    // Ruta de login - redirige al usuario a Auth0 para autenticación
    if (action === 'login') {
      console.log('Redirigiendo al usuario a Auth0 para login...');
      const redirectUrl = new URL(`${AUTH0_ISSUER}/authorize`);
      redirectUrl.searchParams.append('response_type', 'code');
      redirectUrl.searchParams.append('client_id', AUTH0_CLIENT_ID || '');
      redirectUrl.searchParams.append('redirect_uri', `${AUTH0_BASE_URL}/api/auth/callback`);
      redirectUrl.searchParams.append('scope', 'openid profile email');
      redirectUrl.searchParams.append('connection', 'google-oauth2'); // Forzar uso de Google
      
      return NextResponse.redirect(redirectUrl);
    }
    
    // Callback - después de autenticarse con Auth0/Google
    if (action === 'callback') {
      console.log('Procesando callback de Auth0...');
      
      // Extraer el código de autorización de la URL
      const code = new URL(req.url).searchParams.get('code');
      
      if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', AUTH0_BASE_URL));
      }
      
      try {
        // En una implementación real, intercambiaríamos el código por tokens
        // y extraeríamos la información del usuario
        
        // Simulamos información de ejemplo para demostración
        // En producción, aquí usarías la respuesta real de Auth0
        const email = 'usuario.google@gmail.com';
        
        // Redirigir al usuario a la página principal con un parámetro temporal para identificar la sesión
        const redirectUrl = new URL('/', AUTH0_BASE_URL);
        redirectUrl.searchParams.append('auth_success', 'true');
        redirectUrl.searchParams.append('email', email);
        
        // Crear una respuesta con cookie para mantener la sesión
        const response = NextResponse.redirect(redirectUrl);
        
        // Establecer cookie de sesión (insegura - solo para demostración)
        // En producción, usarías cookies seguras y encriptadas
        response.cookies.set({
          name: 'user_email',
          value: email,
          path: '/',
          maxAge: 60 * 60 * 24, // 1 día
          httpOnly: true,
          sameSite: 'lax'
        });
        
        return response;
      } catch (error) {
        console.error('Error en el proceso de callback:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', AUTH0_BASE_URL));
      }
    }
    
    // Logout - redirigir al usuario a Auth0 para cerrar sesión
    if (action === 'logout') {
      console.log('Procesando logout...');
      
      // Crear respuesta que redirija al usuario a la página principal
      const response = NextResponse.redirect(new URL('/', AUTH0_BASE_URL));
      
      // Eliminar cookie de sesión
      response.cookies.set({
        name: 'user_email',
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: true
      });
      
      return response;
    }
    
    // Si llegamos aquí, la acción no está soportada
    return NextResponse.json(
      { error: `Acción "${action}" no soportada` },
      { status: 400 }
    );
  }
  catch (error: any) {
    console.error(`Error en ruta auth/${action}:`, error);
    return NextResponse.json(
      { error: error.message || 'Error interno de autenticación' }, 
      { status: 500 }
    );
  }
}