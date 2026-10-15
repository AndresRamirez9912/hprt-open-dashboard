# PhotoPrint

Web app para imprimir fotos en impresoras HPRT CP4x (CP4100…) desde el navegador. Implementa el
diseño de Stitch **printer-app** y habla con la impresora a través del puente local de
`free-photo` (o su reimplementación en Go, `free-photo/go-reference`).

## Arrancar

```sh
bun install
# 1. el puente (en otra terminal), en ../free-photo
npm run bridge                # escucha en 127.0.0.1:8787
# 2. la app
bun run dev                   # http://localhost:5173
```

Si el puente está en otro puerto o en otra máquina: `BRIDGE_URL=http://host:puerto bun run dev`.
Para probar sin impresora: `npm run sim` en `free-photo` y conecta a `127.0.0.1`.

Bluetooth (Web Bluetooth) sólo funciona en Chrome/Edge, en `localhost` o HTTPS.

## Docker

La imagen compila la app con Bun y la sirve con nginx, que además hace de proxy de `/api` hacia el
puente (con el buffering desactivado para el stream de eventos SSE).

```sh
cp .env.example .env          # ajusta BRIDGE_URL (y PHOTOPRINT_PORT)
docker compose up -d --build  # http://localhost:8080
```

- `BRIDGE_URL` es la URL del puente **vista desde el contenedor** (sin `/` final). Si el puente corre
  en la misma máquina, usa `http://host.docker.internal:8787` y arranca el puente escuchando fuera de
  loopback: `BRIDGE_HOST=0.0.0.0 npm run bridge` (por defecto sólo escucha en `127.0.0.1`).
- Sin compose: `docker build -t photoprint . && docker run -p 8080:80 -e BRIDGE_URL=… --add-host host.docker.internal:host-gateway photoprint`.
- Web Bluetooth sólo funciona en `localhost` o HTTPS: desde otro equipo de la red por `http://IP:8080`
  todo funciona salvo la sección Bluetooth (pon un proxy HTTPS delante si la necesitas).

## Estructura

```
src/
  api/          cliente HTTP y eventos SSE del puente (tipos de la API)
  hooks/        React Query: estado, eventos en vivo, acciones e impresión
  state/        estado del cliente con Context + useState (editor, Bluetooth)
  lib/          lógica pura: imagen, EXIF, BLE, logs, modelos de impresora
  i18n/         i18next: es / en según el idioma del navegador
  components/
    atoms/      Button, Icon, Badge, Card, Slider, Select…
    molecules/  SectionHeader, InfoRow, Dialog, Stepper, LogEntryItem…
    organisms/  PhotoCanvas, PhotoStage, LinkQualityPanel, BluetoothCard…
    templates/  MobileShell (cabecera + barra inferior), WebShell (barra lateral + superior)
  pages/
    mobile/     pantallas Mobile #1-4 de Stitch (< 1024 px)
    web/        pantallas Web #1-4 de Stitch (≥ 1024 px)
  app/          App (elige Web o Mobile), router por hash, useIsDesktop
  styles/       tokens del design system (Sass)
```

- **Datos del servidor**: React Query. Lo que el puente empuja por SSE (estado, trabajo, logs) se
  escribe en la caché de React Query, así que los componentes lo leen como cualquier query.
- **Estado del cliente**: `PrintSettings` (foto y opciones del editor) y `Bluetooth` (sesión BLE),
  ambos con Context + `useState`. Sin `useMemo`/`useCallback`.
- **Estilos**: CSS Modules en SCSS con los tokens de `styles/_tokens.scss`.

## Scripts

|                 |                                                |
| --------------- | ---------------------------------------------- |
| `bun run dev`   | servidor de desarrollo (proxy `/api` → puente) |
| `bun run build` | type-check y build de producción en `dist/`    |
| `bun run lint`  | ESLint                                         |
