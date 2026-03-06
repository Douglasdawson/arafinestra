# ARA FINESTRA - Documento de Diseno

## Resumen del proyecto

**Marca:** ARA FINESTRA
**Dominio:** arafinestra.com
**Sector:** Instalacion de ventanas PVC y cerramientos
**Zona:** Provincia de Girona + Maresme
**Publico:** Particulares, constructoras, comunidades de vecinos
**Fabricante:** Cortizo (perfiles PVC)
**Hosting:** Replit (autoscale deployment)

## Stack tecnico

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express 5 + TypeScript
- **Base de datos:** PostgreSQL + Drizzle ORM
- **Auth:** Passport sessions (panel admin)
- **SEO:** react-helmet-async + sitemap.xml dinamico + Schema.org
- **Multiidioma:** i18next + react-i18next (CA/ES/EN)
- **Deploy:** Replit autoscale

## Arquitectura

```
arafinestra.com/
  Frontend (React 18 + TypeScript + Vite + Tailwind)
    Paginas publicas (multiidioma: /ca/, /es/, /en/)
    Presupuestador interactivo
    Blog renderizado
  Backend (Express 5 + TypeScript)
    API REST (/api/v1/...)
    Auth (Passport sessions)
    Sitemap + SEO dinamico
  Base de datos (PostgreSQL + Drizzle ORM)
    leads
    portfolio
    blog_posts
    products
    testimonials
    config
    zones
  Hosting: Replit (autoscale deployment)
```

## Mapa de paginas

```
/ (Home)
  /servicios/
    /ventanas-pvc/
    /puertas-correderas/
    /persianas/
    /mosquiteras/
  /presupuesto/          -- Calculadora interactiva
  /proyectos/            -- Portfolio antes/despues
  /cortizo/              -- Landing SEO marca
  /subvenciones/         -- Landing SEO Next Generation
  /blog/                 -- Articulos SEO
  /opiniones/            -- Testimonios reales
  /contacto/             -- Formulario + mapa + datos
  /zonas/                -- Landings locales SEO
    /blanes/
    /lloret-de-mar/
    /girona/
    /mataro/
    /figueres/
    ... (10-15 localidades)
  /admin/                -- Panel administracion
```

Cada ruta replicada en /ca/, /es/, /en/.

## Paginas publicas - Contenido detallado

### Home
- Hero con video/imagen gran formato + CTA "Calcula tu presupuesto"
- 4 servicios con iconos (enlace a cada uno)
- Cifras clave (anos experiencia, proyectos, zona cobertura)
- 3 proyectos destacados del portfolio
- Testimonios (carrusel)
- Logos Cortizo + certificaciones
- Banner subvenciones Next Generation
- CTA final presupuesto

### Paginas de servicio (ventanas, puertas, persianas, mosquiteras)
- Descripcion del servicio con beneficios
- Galeria de trabajos filtrada por tipo
- Tabla de gamas/modelos Cortizo con prestaciones
- FAQ especifico del servicio (schema FAQPage)
- CTA presupuesto

### Presupuestador online (diferenciador clave)
Wizard paso a paso:
1. Tipo de producto (ventana / puerta corredera / persiana / mosquitera)
2. Modelo/gama Cortizo
3. Numero de hojas / dimensiones
4. Color del perfil
5. Tipo de vidrio (doble, triple, bajo emisivo)
6. Extras (persiana integrada, mosquitera)
7. Cantidad de unidades

Resultado: precio orientativo + CTA "Quiero presupuesto exacto" (captura lead)
Los precios se gestionan desde el admin.

### Landings locales SEO (/zonas/)
- H1 localizado: "Instalacion de ventanas PVC en [localidad]"
- Contenido unico por localidad (clima, tipo de vivienda, proximidad mar)
- Proyectos realizados en esa zona
- Mapa con ubicacion
- Schema LocalBusiness con areaServed

### Blog
- Articulos SEO: guias de compra, comparativas, ahorro energetico, subvenciones
- Categorias: Ventanas, Eficiencia, Subvenciones, Cortizo, Mantenimiento
- Autor + fecha + tiempo lectura
- Schema Article + BreadcrumbList
- CTA presupuesto en sidebar/footer de cada post

### Portfolio (/proyectos/)
- Galeria filtrable por: tipo de producto, localidad, tipo de inmueble
- Cada proyecto: antes/despues, descripcion, productos usados, localidad
- Lightbox para fotos a pantalla completa

### Cortizo (landing SEO)
- Por que perfiles Cortizo: fabricacion espanola, prestaciones, sostenibilidad
- Gamas disponibles con especificaciones
- Comparativa vs marcas alemanas (sin nombrarlas directamente)
- Certificaciones Cortizo

### Subvenciones Next Generation (landing SEO)
- Explicacion de ayudas disponibles para ventanas
- Requisitos y plazos
- "Nosotros tramitamos por ti"
- CTA presupuesto con mencion a subvencion

## Captacion de leads (multicapa)

| Canal | Ubicacion |
|-------|-----------|
| Presupuestador | Pagina dedicada + CTAs desde toda la web |
| WhatsApp flotante | Todas las paginas (esquina inferior derecha) |
| Telefono en header | Visible siempre, click-to-call en movil |
| Formulario contacto | Pagina de contacto + footer |
| CTA post-calculadora | "Quiero presupuesto exacto" tras el calculo |
| Pop-up salida | Solo en paginas de servicio |
| CTA en blog | Banner lateral + final de cada articulo |

## Panel de administracion (/admin/)

### Dashboard
- Leads nuevos hoy/semana/mes
- Conversiones por canal (presupuestador / formulario / WhatsApp)
- Graficos de tendencia

### Modulos

| Modulo | Funcionalidad |
|--------|--------------|
| Leads/CRM | Lista contactos, estado (nuevo/contactado/presupuestado/ganado/perdido), filtros, notas |
| Portfolio | CRUD proyectos: fotos antes/despues, descripcion, localidad, tipo, productos |
| Blog | Editor articulos multiidioma, borrador/publicado, categorias, SEO fields |
| Productos | Catalogo con precios para presupuestador (gamas, colores, vidrios, extras) |
| Testimonios | Gestion resenas: nombre, localidad, texto, puntuacion, foto opcional |
| Contenido | Textos editables de la web (hero, about, cifras clave) |
| Zonas | Gestion landings locales (contenido unico por localidad) |
| Configuracion | Telefono, email, WhatsApp, redes sociales, horario |

## Estrategia SEO

### On-page
- 1 landing por localidad (10-15 paginas) con contenido unico
- 1 landing por servicio (4 paginas) con FAQ schema
- Blog con articulos long-tail
- H1 con keyword + localidad en cada pagina
- Meta title/description editables desde admin
- Imagenes con alt text descriptivo
- URLs limpias con keywords

### Tecnico
- Sitemap.xml dinamico (se regenera con cada post/proyecto nuevo)
- robots.txt optimizado
- hreflang para 3 idiomas
- Schema multiple: LocalBusiness, Product, FAQ, Article, BreadcrumbList
- Core Web Vitals optimizados
- Lazy loading imagenes + formato WebP
- Prerendering para crawlers

### Contenido inicial del blog
1. "Ventanas PVC vs aluminio: que elegir en 2026"
2. "Subvenciones Next Generation para ventanas en Girona"
3. "Por que elegir perfiles Cortizo"
4. "Como elegir el vidrio para tu ventana"
5. "Ahorro energetico con ventanas PVC: guia completa"

## Base de datos - Esquema

### leads
- id, nombre, email, telefono, localidad, tipo_cliente (particular/constructora/comunidad)
- origen (presupuestador/formulario/whatsapp/telefono)
- estado (nuevo/contactado/presupuestado/ganado/perdido)
- notas, presupuesto_datos (JSON del presupuestador)
- created_at, updated_at

### portfolio
- id, titulo_ca, titulo_es, titulo_en
- descripcion_ca, descripcion_es, descripcion_en
- localidad, tipo_inmueble, productos_usados
- fotos_antes (JSON array URLs), fotos_despues (JSON array URLs)
- destacado (boolean), published, created_at

### blog_posts
- id, slug, titulo_ca, titulo_es, titulo_en
- contenido_ca, contenido_es, contenido_en
- extracto_ca, extracto_es, extracto_en
- categoria, autor, imagen_portada
- meta_title_ca/es/en, meta_description_ca/es/en
- published, published_at, created_at

### products
- id, tipo (ventana/puerta/persiana/mosquitera)
- gama, modelo, descripcion
- precio_base, precio_por_m2
- colores_disponibles (JSON), vidrios_compatibles (JSON)
- especificaciones (JSON: aislamiento, acustica, etc.)
- activo (boolean)

### testimonials
- id, nombre, localidad, texto_ca, texto_es, texto_en
- puntuacion (1-5), foto_url
- published, created_at

### zones
- id, slug, nombre_ca, nombre_es, nombre_en
- contenido_ca, contenido_es, contenido_en
- meta_title_ca/es/en, meta_description_ca/es/en
- latitud, longitud
- published

### site_config
- id, key, value_ca, value_es, value_en
- (telefono, email, whatsapp, horario, direccion, redes_sociales, cifras_clave)

## Diferenciacion vs competencia

| Lo que NADIE tiene | ARA FINESTRA |
|--------------------|--------------|
| Presupuestador interactivo real | Wizard paso a paso con precio orientativo |
| Portfolio visual antes/despues | Galeria filtrable por zona y tipo |
| Landings SEO por localidad | 10-15 paginas unicas |
| Web en 3 idiomas | CA + ES + EN (expats Costa Brava) |
| Blog SEO activo | Articulos de valor + comparativas |
| Core Web Vitals | Rendimiento superior a todos |
| Panel admin completo | Gestion autonoma |
| Marca Cortizo diferenciada | Landing dedicada |

## Analisis competitivo (resumen)

Mejor competidor actual: Instal Tancaments (instaltancaments.com)
- Tiene calculadora basica, blog activo, schema multiple
- NO tiene: portfolio visual, testimonios, 3 idiomas, landings locales, rendimiento optimizado

Competidor mas directo (Blanes): Eco Seny (ecoseny.com)
- Web CAIDA, SEO minimo, sin blog, sin presupuestador
- Enorme oportunidad territorial

## Proximos pasos
1. Crear plan de implementacion detallado (fases y prioridades)
2. Inicializar proyecto en Replit
3. Implementar por fases
