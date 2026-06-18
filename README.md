# Punto Sport

Aplicación web móvil para reservas, ligas y seguimiento de partidos de Punto Sport.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación queda disponible en la dirección de red que informa Vite.

## Variables de entorno

Copiar `.env.example` como `.env.local` y completar:

```env
VITE_CLUB_WHATSAPP=5491130000000
VITE_INSTAGRAM_URL=https://www.instagram.com/puntosport/
```

En Vercel, cargar las mismas variables desde **Project Settings → Environment Variables**.

## Verificación

```bash
npm run check
```

Este comando valida TypeScript y genera la compilación de producción.

## Publicar en GitHub

```bash
git init
git add .
git commit -m "Preparar Punto Sport para producción"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

## Publicar en Vercel

1. Importar el repositorio desde Vercel.
2. Vercel detectará Vite automáticamente.
3. Configurar las variables de entorno.
4. Publicar.

`vercel.json` incluye el rewrite necesario para que rutas como `/reservas` y `/ligas/...` funcionen al recargar.

## Persistencia actual

La aplicación guarda en `localStorage`, con claves versionadas:

- código de jugador;
- perfil y foto;
- confirmaciones de partidos;
- borrador de reserva;
- borradores de inscripción.

Esto conserva información en el mismo navegador y dispositivo. No sincroniza datos entre usuarios o celulares.

## Antes de operar con usuarios reales

Para reservas, inscripciones, disponibilidad y confirmaciones compartidas se necesita conectar un backend con autenticación y base de datos. La interfaz actual usa datos simulados en `src/data/mockData.ts`.
