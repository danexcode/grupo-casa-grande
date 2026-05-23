# Casa Grande — Web Corporativa (Astro)

Sitio corporativo de Grupo Casa Grande, convertido desde el prototipo standalone HTML a un proyecto Astro multipágina con routing real.

## Stack
- [Astro](https://astro.build) 5 (sitio estático)
- CSS plano (sin framework) en `src/styles/global.css`
- Fuentes self-hosted (woff2) en `public/fonts/`

## Comandos
```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (localhost:4321)
npm run build    # build estático → dist/
npm run preview  # previsualizar el build
```

## Estructura
```
src/
├─ layouts/Layout.astro        Layout base: head, header, footer, script cliente
├─ components/
│  ├─ Header.astro             Navegación con estado activo por página
│  └─ Footer.astro             Footer + botón flotante WhatsApp
├─ styles/global.css           Todos los estilos + @font-face
└─ pages/
   ├─ index.astro              /              (Home)
   ├─ nosotros.astro           /nosotros
   ├─ suministros.astro        /suministros
   ├─ suministros/
   │  └─ categoria.astro       /suministros/categoria
   ├─ servicios.astro          /servicios
   ├─ experiencia.astro        /experiencia
   └─ contacto.astro           /contacto
```

## Notas de la conversión
- El prototipo era una SPA de una sola página que mostraba/ocultaba "vistas" con JS. Se convirtió a **páginas reales** de Astro (mejor SEO, links compartibles, sin JS para navegar).
- Los elementos con `data-go` siguen funcionando: el script del Layout los mapea a rutas reales.
- Botones de WhatsApp (header, FAB, `.btn.wa`) abren `wa.me/584148984156`. **Pendiente:** confirmar número WhatsApp Business definitivo de Carol.
- Las 15 fuentes woff2 venían embebidas en base64; se extrajeron a `public/fonts/` y se reescribieron las URLs en el CSS.

## Pendientes
- Reemplazar placeholders (`.ph`) por imágenes reales cuando Carol las provea.
- Confirmar número WhatsApp y datos de contacto.
- Revisar narrativa legal Corporación / Grupo (ver `docs/`).
