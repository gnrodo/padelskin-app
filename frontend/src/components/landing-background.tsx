import React from 'react';

// Aproximación de colores (ajustar según sea necesario o usar variables CSS)
const bgColor = "hsl(147, 50%, 15%)"; // Verde oscuro aproximado
const stripeColor = "hsl(40, 33%, 90%)"; // Crema/beige aproximado

export function LandingBackground() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100" // Use viewBox for scaling
      preserveAspectRatio="none" // Allow stretching
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', // Ensure full width
        height: '100%', // Ensure full height
        zIndex: -1 // Ensure it's behind content
      }}
    >
      {/* Fondo verde oscuro */}
      <rect width="100" height="100" fill={bgColor} />

      {/* Franja diagonal (aproximada con un polígono) */}
      {/* Ajusta los puntos para cambiar el ángulo y grosor */}
      <polygon
        points="0,30 100,70 100,55 0,15" // Puntos: (x1,y1 x2,y2 x3,y3 x4,y4)
        fill={stripeColor}
      />

      {/* Placeholder para el patrón geométrico más oscuro (omitido por simplicidad inicial) */}
      {/* <polygon points="..." fill="hsl(147, 50%, 10%)" /> */}

    </svg>
  );
}