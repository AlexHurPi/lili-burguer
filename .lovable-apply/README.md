# Lovable UI — Preview / Branch marker

Esta rama (`feature/apply-lovable-ui`) contiene los cambios visuales aplicados desde la versión *Lovable* y está pensada SOLO para revisión visual / preview.

Qué se modificó (visual únicamente):
- Header: estilos y estructura visual (background, títulos, posicionamiento).
- Footer: estilos, información y layout responsive.
- ImageCard2: estilos de tarjeta, badges de promoción, overlay de "agotado", controles visuales de cantidad y botón.
- PromoCarousel: estilos visuales de la sección de promociones (archivos CSS y componentes asociados).

No se cambió la lógica de negocio ni la forma en que funcionan los datos (context, peticiones, handlers).

Cómo previsualizar:
1. En Cloudflare Pages configura una Preview o Branch Deploy apuntando a `feature/apply-lovable-ui`.
2. O localmente:
   - `npm install`
   - `npm run dev`
   - Abrir http://localhost:5173 (o el puerto que muestre Vite)

Cómo revertir:
- Eliminar la rama `feature/apply-lovable-ui` o hacer un revert del merge/PR si se acepta.

Notas:
- Las fuentes referenciadas están en `public/fonts/static` (Jost). Si Cloudflare Pages no sirve correctamente las fuentes, revisa que los assets estén accesibles en `public/`.
- Si quieres que abra un PR desde esta rama hacia `main`, dime y lo creo (necesito confirmación para abrir PR manualmente).
