# Arquitectura de Lili Hamburger

## Vista general

La aplicación es una SPA (Single Page Application) construida con React y Vite. Se ejecuta en el navegador y obtiene los datos del menú y la configuración de la tienda desde Firebase Firestore. El panel de administración usa Firebase Authentication y permite guardar cambios en Firestore y gestionar imágenes en Cloudflare R2.

```mermaid
flowchart TD
    Browser["Navegador"]
    PWA["PWA<br/>vite-plugin-pwa"]
    React["React 19 + Vite"]
    Router["HashRouter<br/>React Router"]
    App["App.jsx"]
    MenuProvider["MenuProvider<br/>menú en tiempo real"]
    CartProvider["CartProvider<br/>carrito y precios"]

    subgraph Public["Tienda pública"]
        Home["Inicio<br/>catálogo, promociones,<br/>estado de tienda"]
        Details["ProductDetails"]
        Cart["CartPage"]
        Components["Componentes de interfaz<br/>header, cards, carruseles,<br/>carrito y footer"]
    end

    subgraph Admin["Administración"]
        AdminPage["Admin"]
        Login["AdminLogin"]
        AdminControls["Controles de tienda<br/>horario, inventario,<br/>marca y catálogo"]
    end

    FirebaseAuth["Firebase Authentication"]
    Firestore["Cloud Firestore<br/>menu/spanish"]
    R2["Cloudflare R2<br/>imágenes de productos"]
    LocalStorage["localStorage<br/>carritoLili"]
    WhatsApp["WhatsApp<br/>wa.me"]
    StaticAssets["Recursos estáticos<br/>public/images, fonts"]

    Browser --> PWA
    Browser --> React
    React --> Router --> App
    App --> MenuProvider
    MenuProvider --> CartProvider
    App --> Public
    App --> Admin
    MenuProvider <-->|"escucha documento menu/spanish"| Firestore
    CartProvider <-->|"usa el menú para validar productos y precios"| MenuProvider
    CartProvider <-->|"lee y guarda"| LocalStorage
    Home --> Components
    Details --> Components
    Cart --> CartProvider
    Cart -->|"abre mensaje de pedido"| WhatsApp
    AdminPage --> Login
    AdminPage --> AdminControls
    Login <-->|"inicio/cierre de sesión"| FirebaseAuth
    AdminControls <-->|"actualiza menú y configuración"| Firestore
    AdminControls <-->|"sube y lista imágenes"| R2
    Home --> StaticAssets
    Components --> StaticAssets
```

## Flujo de datos y responsabilidades

- **Enrutamiento:** `main.jsx` monta la aplicación con `HashRouter`. `App.jsx` declara las rutas de inicio, carrito, detalle de producto y administración.
- **Menú compartido:** `MenuProvider` inicia con `src/languages/spanish.json` como respaldo y escucha el documento `menu/spanish` de Firestore. Las páginas y controles administrativos consumen ese contexto.
- **Carrito:** `CartProvider` conserva en `localStorage` los identificadores y cantidades. Enriquece esos datos con el menú actual para mostrar información vigente, filtrar productos no disponibles y calcular precios, ofertas y totales.
- **Compra:** `CartPage` construye el pedido y lo entrega a WhatsApp mediante un enlace `wa.me`. El flujo no registra pedidos ni procesa pagos en un backend propio.
- **Administración:** `Admin` observa la sesión de Firebase Authentication. Al iniciar sesión presenta controles para modificar el estado/horario, inventario, encabezado/pie de página y catálogo en Firestore.
- **Imágenes:** los controles administrativos usan `r2Service.js` para cargar y listar imágenes en Cloudflare R2. Las URLs públicas resultantes se guardan como parte de los datos del menú.
- **Idiomas:** `i18n.js` inicializa `react-i18next` con los catálogos español e inglés.
- **PWA y recursos:** Vite genera la aplicación y configura la PWA con actualización automática. Las imágenes y fuentes locales viven en `public/`.

## Construcción y publicación

```mermaid
flowchart LR
    Source["Código fuente React"] --> Vite["Vite build"]
    Vite --> Dist["Archivos estáticos en dist/"]
    Dist --> Hosting["Hosting estático"]
    Hosting --> Client["Navegador / PWA"]
    Client --> Firebase["Firebase Auth + Firestore"]
    Client --> R2["Cloudflare R2"]
    Client --> WhatsApp["WhatsApp"]
```

Vite está configurado con `base: '/'`, compatible con publicación en la raíz de un hosting estático. El proyecto incluye el script opcional `npm run deploy` con `gh-pages`; la configuración actual de Vite documenta Cloudflare Pages como destino.
