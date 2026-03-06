import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  varchar,
} from "drizzle-orm/pg-core";

// leads — CRM leads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email"),
  telefono: text("telefono"),
  localidad: text("localidad"),
  tipoCliente: varchar("tipo_cliente", { length: 20 }).default("particular"),
  origen: varchar("origen", { length: 20 }).default("formulario"),
  estado: varchar("estado", { length: 20 }).default("nuevo"),
  notas: text("notas"),
  presupuestoDatos: jsonb("presupuesto_datos").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// portfolio — project gallery
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  tituloCa: text("titulo_ca").notNull(),
  tituloEs: text("titulo_es").notNull(),
  tituloEn: text("titulo_en").notNull(),
  descripcionCa: text("descripcion_ca"),
  descripcionEs: text("descripcion_es"),
  descripcionEn: text("descripcion_en"),
  localidad: text("localidad"),
  tipoInmueble: text("tipo_inmueble"),
  productosUsados: text("productos_usados"),
  fotosAntes: jsonb("fotos_antes").$type<string[]>().default([]),
  fotosDespues: jsonb("fotos_despues").$type<string[]>().default([]),
  destacado: boolean("destacado").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// blogPosts — blog articles
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  tituloCa: text("titulo_ca").notNull(),
  tituloEs: text("titulo_es").notNull(),
  tituloEn: text("titulo_en").notNull(),
  contenidoCa: text("contenido_ca"),
  contenidoEs: text("contenido_es"),
  contenidoEn: text("contenido_en"),
  extractoCa: text("extracto_ca"),
  extractoEs: text("extracto_es"),
  extractoEn: text("extracto_en"),
  categoria: text("categoria"),
  autor: text("autor"),
  imagenPortada: text("imagen_portada"),
  metaTitleCa: text("meta_title_ca"),
  metaTitleEs: text("meta_title_es"),
  metaTitleEn: text("meta_title_en"),
  metaDescriptionCa: text("meta_description_ca"),
  metaDescriptionEs: text("meta_description_es"),
  metaDescriptionEn: text("meta_description_en"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// products — for calculator pricing
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  gama: text("gama"),
  modelo: text("modelo"),
  descripcion: text("descripcion"),
  precioBase: real("precio_base"),
  precioPorM2: real("precio_por_m2"),
  coloresDisponibles: jsonb("colores_disponibles").$type<string[]>().default([]),
  vidriosCompatibles: jsonb("vidrios_compatibles").$type<string[]>().default([]),
  especificaciones: jsonb("especificaciones").$type<Record<string, string>>(),
  activo: boolean("activo").default(false),
});

// testimonials — customer reviews
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  localidad: text("localidad"),
  textoCa: text("texto_ca"),
  textoEs: text("texto_es"),
  textoEn: text("texto_en"),
  puntuacion: integer("puntuacion").default(5),
  fotoUrl: text("foto_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// zones — local SEO landing pages
export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  nombreCa: text("nombre_ca").notNull(),
  nombreEs: text("nombre_es").notNull(),
  nombreEn: text("nombre_en").notNull(),
  contenidoCa: text("contenido_ca"),
  contenidoEs: text("contenido_es"),
  contenidoEn: text("contenido_en"),
  metaTitleCa: text("meta_title_ca"),
  metaTitleEs: text("meta_title_es"),
  metaTitleEn: text("meta_title_en"),
  metaDescriptionCa: text("meta_description_ca"),
  metaDescriptionEs: text("meta_description_es"),
  metaDescriptionEn: text("meta_description_en"),
  latitud: real("latitud"),
  longitud: real("longitud"),
  published: boolean("published").default(false),
});

// siteConfig — key-value config
export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  valueCa: text("value_ca"),
  valueEs: text("value_es"),
  valueEn: text("value_en"),
});

// users — admin users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
