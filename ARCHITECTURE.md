# Plan de Arquitectura: PadelSkin App

## Objetivo

Crear una aplicación web multi-tenant (multi-skin) para gestión de clubes de pádel, con interfaces web y de WhatsApp (usando LLMs vía OpenRouter), perfiles de jugador, rankings, reservas, pagos (Mercado Pago) y notificaciones.

## Tecnologías Principales

*   **Frontend:** Next.js con `shadcn/ui`. Tema oscuro por defecto, opción de tema claro. Mobile-first.
*   **Backend:** Node.js con Express.js o NestJS (API REST/GraphQL).
*   **Base de Datos:** MongoDB Atlas.
*   **Integración WhatsApp:** WhatsApp Business API + OpenRouter (LLM).
*   **Pasarela de Pago:** Mercado Pago API.
*   **Hosting:** A definir (Vercel es ideal para Next.js).

## Arquitectura Propuesta

La aplicación se divide en los siguientes componentes principales:

1.  **Frontend (WebApp - Next.js):**
    *   Interfaz para clientes: Ver canchas/horarios, reservar, unirse a partidos, ver/editar perfil, ver rankings, gestionar pagos, chat de partido.
    *   Interfaz para administradores: Gestionar clubes, canchas, horarios, reservas, usuarios, configuraciones, ver reportes.
    *   Landing Page por club (skin).
    *   Comunicación con el Backend API.
    *   Recepción de notificaciones en tiempo real (ej. WebSockets).
    *   Tema oscuro por defecto, opción de tema claro.

2.  **Backend (API - Node.js):**
    *   Lógica de negocio principal: Gestión de usuarios, autenticación/autorización, clubes (multi-tenancy), canchas, horarios, reservas, partidos, rankings (jugador y confiabilidad), pagos, notificaciones.
    *   API REST (o GraphQL) para ser consumida por el Frontend y el Servicio de WhatsApp.
    *   Integración con MongoDB Atlas.
    *   Integración con Mercado Pago.
    *   Gestión de "skins" o personalización por club.

3.  **Servicio de WhatsApp/LLM (Node.js):**
    *   Recibe mensajes de usuarios (clientes/admins) vía WhatsApp Business API.
    *   Envía mensajes a OpenRouter para interpretar la intención del usuario.
    *   Interactúa con el Backend API para realizar acciones (consultar disponibilidad, reservar, cancelar, obtener info de perfil, etc.).
    *   Formatea respuestas para enviar de vuelta al usuario vía WhatsApp.
    *   Gestiona el flujo de conversación.
    *   Envía notificaciones generadas por el Backend.

4.  **Base de Datos (MongoDB Atlas):**
    *   Colecciones para: `clubs`, `users` (con roles: cliente, admin), `courts`, `schedules`, `bookings`, `matches`, `playerStats`, `rankings`, `payments`, `notifications`, `chatMessages`, etc.
    *   Diseño de esquemas flexibles para adaptarse a las necesidades.

5.  **Servicio de Notificaciones:**
    *   Módulo (posiblemente dentro del Backend o como microservicio separado) que gestiona el envío de notificaciones.
    *   Envío a través de WebSockets/Push Notifications (al Frontend) y WhatsApp (vía Servicio WhatsApp).

## Diagrama de Arquitectura General

```mermaid
graph TD
    subgraph "Usuario Final"
        U_Cliente[Cliente]
        U_Admin[Administrador]
    end

    subgraph "Interfaces"
        WebApp[Frontend WebApp (Next.js + shadcn/ui)]
        WhatsApp[Interfaz WhatsApp]
    end

    subgraph "Backend Services"
        BackendAPI[API Backend (Node.js/Express o NestJS)]
        WhatsappService[Servicio WhatsApp/LLM (Node.js)]
        NotificationService[Servicio Notificaciones]
    end

    subgraph "Infraestructura & Datos"
        DB[(Base de Datos MongoDB Atlas)]
        OpenRouter[OpenRouter API]
        WhatsAppAPI[WhatsApp Business API]
        MercadoPago[API Mercado Pago]
    end

    U_Cliente --> WebApp
    U_Admin --> WebApp
    U_Cliente --> WhatsApp
    U_Admin --> WhatsApp

    WebApp --> BackendAPI

    WhatsApp --> WhatsappService
    WhatsappService --> WhatsAppAPI
    WhatsappService --> OpenRouter
    WhatsappService --> BackendAPI

    BackendAPI --> DB
    BackendAPI --> MercadoPago
    BackendAPI --> NotificationService

    NotificationService --> WebApp
    NotificationService --> WhatsappService -- Enviar Notificaciones --> WhatsAppAPI

    style WebApp fill:#f9f,stroke:#333,stroke-width:2px
    style WhatsApp fill:#ccf,stroke:#333,stroke-width:2px
    style BackendAPI fill:#9cf,stroke:#333,stroke-width:2px
    style WhatsappService fill:#9cf,stroke:#333,stroke-width:2px
    style NotificationService fill:#9cf,stroke:#333,stroke-width:2px
    style DB fill:#fca,stroke:#333,stroke-width:2px
    style OpenRouter fill:#ccc,stroke:#333,stroke-width:1px
    style WhatsAppAPI fill:#ccc,stroke:#333,stroke-width:1px
    style MercadoPago fill:#ccc,stroke:#333,stroke-width:1px
```

## Próximos Pasos

1.  **Definir MVP (Minimum Viable Product).**
2.  **Diseño Detallado de Modelos de Datos (MongoDB).**
3.  **Diseño Detallado de API Endpoints.**
4.  **Plan de Desarrollo (Fases/Sprints).**
5.  **Implementación (cambiar a modo "code").**