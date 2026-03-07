import bcrypt from "bcryptjs";
import { db } from "./db.js";
import {
  users,
  zones,
  products,
  siteConfig,
  testimonials,
  blogPosts,
} from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // ── Admin user ──────────────────────────────────────────────
  const hash = await bcrypt.hash("admin", 10);
  await db
    .insert(users)
    .values({ username: "admin", password: hash })
    .onConflictDoNothing({ target: users.username });
  console.log("  Admin user OK");

  // ── 15 Zones ────────────────────────────────────────────────
  const zonesData = [
    {
      slug: "blanes",
      nombreCa: "Blanes", nombreEs: "Blanes", nombreEn: "Blanes",
      latitud: 41.6741, longitud: 2.7903,
      contenidoCa: "Blanes, la porta de la Costa Brava, gaudeix d'un clima mediterrani amb hiverns suaus i estius calorosos. Les finestres de PVC Cortizo ofereixen un aïllament tèrmic i acústic ideal per als habitatges propers al mar, protegint de la humitat salina. Instal·lem finestres a pisos, cases i xalets de Blanes amb acabats que resisteixen l'ambient costaner.",
      contenidoEs: "Blanes, la puerta de la Costa Brava, disfruta de un clima mediterráneo con inviernos suaves y veranos calurosos. Las ventanas de PVC Cortizo ofrecen un aislamiento térmico y acústico ideal para las viviendas cercanas al mar, protegiendo de la humedad salina. Instalamos ventanas en pisos, casas y chalets de Blanes con acabados resistentes al ambiente costero.",
      contenidoEn: "Blanes, the gateway to the Costa Brava, enjoys a Mediterranean climate with mild winters and hot summers. Cortizo PVC windows provide ideal thermal and acoustic insulation for homes near the sea, protecting against salt humidity. We install windows in apartments, houses, and villas in Blanes with finishes that withstand the coastal environment.",
      metaTitleCa: "Finestres PVC a Blanes | Instal·lació Cortizo - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Blanes | Instalación Cortizo - Ara Finestra",
      metaTitleEn: "PVC Windows in Blanes | Cortizo Installation - Ara Finestra",
      metaDescriptionCa: "Instal·lació de finestres de PVC Cortizo a Blanes. Aïllament tèrmic i acústic per a habitatges de la Costa Brava. Pressupost gratuït.",
      metaDescriptionEs: "Instalación de ventanas de PVC Cortizo en Blanes. Aislamiento térmico y acústico para viviendas de la Costa Brava. Presupuesto gratuito.",
      metaDescriptionEn: "Cortizo PVC window installation in Blanes. Thermal and acoustic insulation for Costa Brava homes. Free quote.",
      published: true,
    },
    {
      slug: "lloret-de-mar",
      nombreCa: "Lloret de Mar", nombreEs: "Lloret de Mar", nombreEn: "Lloret de Mar",
      latitud: 41.6994, longitud: 2.8455,
      contenidoCa: "Lloret de Mar, un dels destins turístics més coneguts de la Costa Brava, necessita finestres que resisteixin la brisa marina i la humitat. Les finestres de PVC Cortizo són la solució perfecta per als apartaments i cases de Lloret, oferint aïllament superior i durabilitat. Treballem amb comunitats de veïns i propietaris particulars.",
      contenidoEs: "Lloret de Mar, uno de los destinos turísticos más conocidos de la Costa Brava, necesita ventanas que resistan la brisa marina y la humedad. Las ventanas de PVC Cortizo son la solución perfecta para apartamentos y casas de Lloret, ofreciendo aislamiento superior y durabilidad. Trabajamos con comunidades de vecinos y propietarios particulares.",
      contenidoEn: "Lloret de Mar, one of the most popular tourist destinations on the Costa Brava, needs windows that withstand the sea breeze and humidity. Cortizo PVC windows are the perfect solution for apartments and houses in Lloret, offering superior insulation and durability. We work with homeowner associations and individual property owners.",
      metaTitleCa: "Finestres PVC a Lloret de Mar | Cortizo - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Lloret de Mar | Cortizo - Ara Finestra",
      metaTitleEn: "PVC Windows in Lloret de Mar | Cortizo - Ara Finestra",
      metaDescriptionCa: "Instal·lació de finestres de PVC a Lloret de Mar. Resistents a la brisa marina. Pressupost sense compromís.",
      metaDescriptionEs: "Instalación de ventanas de PVC en Lloret de Mar. Resistentes a la brisa marina. Presupuesto sin compromiso.",
      metaDescriptionEn: "PVC window installation in Lloret de Mar. Resistant to sea breeze. Free no-obligation quote.",
      published: true,
    },
    {
      slug: "tossa-de-mar",
      nombreCa: "Tossa de Mar", nombreEs: "Tossa de Mar", nombreEn: "Tossa de Mar",
      latitud: 41.7193, longitud: 2.9334,
      contenidoCa: "Tossa de Mar, amb el seu encantador casc antic i la proximitat al mar, requereix finestres que combinin estètica i funcionalitat. Les finestres de PVC Cortizo s'adapten a l'arquitectura tradicional amb acabats en fusta i colors que respecten l'entorn. Ideal per a rehabilitacions i obra nova a Tossa.",
      contenidoEs: "Tossa de Mar, con su encantador casco antiguo y la proximidad al mar, requiere ventanas que combinen estética y funcionalidad. Las ventanas de PVC Cortizo se adaptan a la arquitectura tradicional con acabados en madera y colores que respetan el entorno. Ideal para rehabilitaciones y obra nueva en Tossa.",
      contenidoEn: "Tossa de Mar, with its charming old town and proximity to the sea, requires windows that combine aesthetics and functionality. Cortizo PVC windows adapt to traditional architecture with wood finishes and colors that respect the surroundings. Ideal for renovations and new builds in Tossa.",
      metaTitleCa: "Finestres PVC a Tossa de Mar | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Tossa de Mar | Ara Finestra",
      metaTitleEn: "PVC Windows in Tossa de Mar | Ara Finestra",
      metaDescriptionCa: "Finestres de PVC Cortizo a Tossa de Mar. Acabats estètics per al casc antic. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas de PVC Cortizo en Tossa de Mar. Acabados estéticos para el casco antiguo. Presupuesto gratuito.",
      metaDescriptionEn: "Cortizo PVC windows in Tossa de Mar. Aesthetic finishes for the old town. Free quote.",
      published: true,
    },
    {
      slug: "girona",
      nombreCa: "Girona", nombreEs: "Girona", nombreEn: "Girona",
      latitud: 41.9794, longitud: 2.8214,
      contenidoCa: "Girona, capital de província, té un clima continental amb hiverns freds i estius calorosos. Les finestres de PVC Cortizo amb vidre baix emissiu garanteixen un estalvi energètic significatiu en els pisos del Barri Vell i les urbanitzacions modernes. Servim tota la ciutat i rodalies de Girona.",
      contenidoEs: "Girona, capital de provincia, tiene un clima continental con inviernos fríos y veranos calurosos. Las ventanas de PVC Cortizo con vidrio bajo emisivo garantizan un ahorro energético significativo en los pisos del Barri Vell y las urbanizaciones modernas. Servimos toda la ciudad y alrededores de Girona.",
      contenidoEn: "Girona, the provincial capital, has a continental climate with cold winters and hot summers. Cortizo PVC windows with low-emissivity glass guarantee significant energy savings in the old quarter apartments and modern developments. We serve the entire city and surroundings of Girona.",
      metaTitleCa: "Finestres PVC a Girona | Instal·lació Cortizo - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Girona | Instalación Cortizo - Ara Finestra",
      metaTitleEn: "PVC Windows in Girona | Cortizo Installation - Ara Finestra",
      metaDescriptionCa: "Instal·lació de finestres de PVC a Girona. Aïllament tèrmic per a hiverns freds. Estalvi energètic garantit.",
      metaDescriptionEs: "Instalación de ventanas de PVC en Girona. Aislamiento térmico para inviernos fríos. Ahorro energético garantizado.",
      metaDescriptionEn: "PVC window installation in Girona. Thermal insulation for cold winters. Guaranteed energy savings.",
      published: true,
    },
    {
      slug: "figueres",
      nombreCa: "Figueres", nombreEs: "Figueres", nombreEn: "Figueres",
      latitud: 42.2660, longitud: 2.9618,
      contenidoCa: "Figueres, la capital de l'Alt Empordà, està exposada a la tramuntana, un vent fort del nord. Les finestres de PVC Cortizo amb triple vidre ofereixen la millor protecció contra el vent i el fred. Instal·lació professional per a habitatges que necessiten el màxim aïllament.",
      contenidoEs: "Figueres, la capital del Alt Empordà, está expuesta a la tramontana, un viento fuerte del norte. Las ventanas de PVC Cortizo con triple vidrio ofrecen la mejor protección contra el viento y el frío. Instalación profesional para viviendas que necesitan el máximo aislamiento.",
      contenidoEn: "Figueres, the capital of Alt Emporda, is exposed to the tramontana, a strong northerly wind. Cortizo PVC windows with triple glazing offer the best protection against wind and cold. Professional installation for homes that need maximum insulation.",
      metaTitleCa: "Finestres PVC a Figueres | Protecció Tramuntana - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Figueres | Protección Tramontana - Ara Finestra",
      metaTitleEn: "PVC Windows in Figueres | Tramontana Protection - Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Figueres. Protecció contra la tramuntana amb triple vidre Cortizo. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas de PVC en Figueres. Protección contra la tramontana con triple vidrio Cortizo. Presupuesto gratuito.",
      metaDescriptionEn: "PVC windows in Figueres. Tramontana protection with triple glazing Cortizo. Free quote.",
      published: true,
    },
    {
      slug: "mataro",
      nombreCa: "Mataró", nombreEs: "Mataró", nombreEn: "Mataro",
      latitud: 41.5407, longitud: 2.4445,
      contenidoCa: "Mataró, capital del Maresme, combina zona costanera amb barris interiors. Les finestres de PVC Cortizo són ideals tant per als pisos del centre com per a les cases properes a la platja. Oferim solucions d'aïllament acústic per als habitatges propers a la N-II i l'autopista.",
      contenidoEs: "Mataró, capital del Maresme, combina zona costera con barrios interiores. Las ventanas de PVC Cortizo son ideales tanto para los pisos del centro como para las casas cercanas a la playa. Ofrecemos soluciones de aislamiento acústico para viviendas cercanas a la N-II y la autopista.",
      contenidoEn: "Mataro, capital of the Maresme, combines coastal areas with inland neighborhoods. Cortizo PVC windows are ideal for both city center apartments and beachfront houses. We offer acoustic insulation solutions for homes near the N-II highway.",
      metaTitleCa: "Finestres PVC a Mataró | Cortizo Maresme - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Mataró | Cortizo Maresme - Ara Finestra",
      metaTitleEn: "PVC Windows in Mataro | Cortizo Maresme - Ara Finestra",
      metaDescriptionCa: "Instal·lació de finestres PVC Cortizo a Mataró. Aïllament acústic i tèrmic per al Maresme.",
      metaDescriptionEs: "Instalación de ventanas PVC Cortizo en Mataró. Aislamiento acústico y térmico para el Maresme.",
      metaDescriptionEn: "Cortizo PVC window installation in Mataro. Acoustic and thermal insulation for the Maresme.",
      published: true,
    },
    {
      slug: "calella",
      nombreCa: "Calella", nombreEs: "Calella", nombreEn: "Calella",
      latitud: 41.6138, longitud: 2.6536,
      contenidoCa: "Calella, al Maresme nord, és una vila costanera amb un parc d'habitatges que necessita renovació energètica. Les finestres de PVC Cortizo milloren l'eficiència tèrmica i redueixen el soroll del trànsit. Servei d'instal·lació ràpida per a pisos i cases unifamiliars.",
      contenidoEs: "Calella, en el Maresme norte, es una villa costera con un parque de viviendas que necesita renovación energética. Las ventanas de PVC Cortizo mejoran la eficiencia térmica y reducen el ruido del tráfico. Servicio de instalación rápida para pisos y casas unifamiliares.",
      contenidoEn: "Calella, in the northern Maresme, is a coastal town with a housing stock that needs energy renovation. Cortizo PVC windows improve thermal efficiency and reduce traffic noise. Fast installation service for apartments and single-family homes.",
      metaTitleCa: "Finestres PVC a Calella | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Calella | Ara Finestra",
      metaTitleEn: "PVC Windows in Calella | Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Calella. Renovació energètica amb Cortizo. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas de PVC en Calella. Renovación energética con Cortizo. Presupuesto gratuito.",
      metaDescriptionEn: "PVC windows in Calella. Energy renovation with Cortizo. Free quote.",
      published: true,
    },
    {
      slug: "palafrugell",
      nombreCa: "Palafrugell", nombreEs: "Palafrugell", nombreEn: "Palafrugell",
      latitud: 41.9175, longitud: 3.1629,
      contenidoCa: "Palafrugell, al cor del Baix Empordà, inclou els nuclis costaners de Calella de Palafrugell, Llafranc i Tamariu. Les finestres de PVC Cortizo s'adapten a l'estètica de les cases de pedra típiques i ofereixen protecció contra la humitat marina. Servei integral de mesura i instal·lació.",
      contenidoEs: "Palafrugell, en el corazón del Baix Empordà, incluye los núcleos costeros de Calella de Palafrugell, Llafranc y Tamariu. Las ventanas de PVC Cortizo se adaptan a la estética de las casas de piedra típicas y ofrecen protección contra la humedad marina. Servicio integral de medición e instalación.",
      contenidoEn: "Palafrugell, in the heart of the Baix Emporda, includes the coastal villages of Calella de Palafrugell, Llafranc, and Tamariu. Cortizo PVC windows adapt to the aesthetics of typical stone houses and offer protection against sea humidity. Complete measurement and installation service.",
      metaTitleCa: "Finestres PVC a Palafrugell | Baix Empordà - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Palafrugell | Baix Empordà - Ara Finestra",
      metaTitleEn: "PVC Windows in Palafrugell | Baix Emporda - Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Palafrugell, Calella de Palafrugell, Llafranc i Tamariu. Instal·lació Cortizo.",
      metaDescriptionEs: "Ventanas de PVC en Palafrugell, Calella de Palafrugell, Llafranc y Tamariu. Instalación Cortizo.",
      metaDescriptionEn: "PVC windows in Palafrugell, Calella de Palafrugell, Llafranc, and Tamariu. Cortizo installation.",
      published: true,
    },
    {
      slug: "olot",
      nombreCa: "Olot", nombreEs: "Olot", nombreEn: "Olot",
      latitud: 42.1823, longitud: 2.4900,
      contenidoCa: "Olot, capital de la Garrotxa, té un clima de muntanya amb hiverns freds i humits. Les finestres de PVC Cortizo amb triple vidre són essencials per mantenir la calor a l'interior i reduir la factura de calefacció. Especialistes en canvi de finestres antigues per PVC d'alta eficiència.",
      contenidoEs: "Olot, capital de la Garrotxa, tiene un clima de montaña con inviernos fríos y húmedos. Las ventanas de PVC Cortizo con triple vidrio son esenciales para mantener el calor interior y reducir la factura de calefacción. Especialistas en cambio de ventanas antiguas por PVC de alta eficiencia.",
      contenidoEn: "Olot, capital of the Garrotxa, has a mountain climate with cold and humid winters. Cortizo PVC windows with triple glazing are essential for keeping heat inside and reducing heating bills. Specialists in replacing old windows with high-efficiency PVC.",
      metaTitleCa: "Finestres PVC a Olot | Aïllament Garrotxa - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Olot | Aislamiento Garrotxa - Ara Finestra",
      metaTitleEn: "PVC Windows in Olot | Garrotxa Insulation - Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Olot. Triple vidre per al clima de muntanya de la Garrotxa. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas de PVC en Olot. Triple vidrio para el clima de montaña de la Garrotxa. Presupuesto gratuito.",
      metaDescriptionEn: "PVC windows in Olot. Triple glazing for the Garrotxa mountain climate. Free quote.",
      published: true,
    },
    {
      slug: "salt",
      nombreCa: "Salt", nombreEs: "Salt", nombreEn: "Salt",
      latitud: 41.9748, longitud: 2.7933,
      contenidoCa: "Salt, municipi adjacent a Girona, té un parc d'habitatges amb gran potencial de millora energètica. Les finestres de PVC Cortizo permeten una renovació ràpida i econòmica dels edificis existents, millorant el confort i reduint el consum energètic. Servim comunitats de veïns i particulars.",
      contenidoEs: "Salt, municipio adyacente a Girona, tiene un parque de viviendas con gran potencial de mejora energética. Las ventanas de PVC Cortizo permiten una renovación rápida y económica de los edificios existentes, mejorando el confort y reduciendo el consumo energético. Servimos comunidades de vecinos y particulares.",
      contenidoEn: "Salt, a municipality adjacent to Girona, has a housing stock with great potential for energy improvement. Cortizo PVC windows allow quick and affordable renovation of existing buildings, improving comfort and reducing energy consumption. We serve homeowner associations and individuals.",
      metaTitleCa: "Finestres PVC a Salt | Renovació Energètica - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Salt | Renovación Energética - Ara Finestra",
      metaTitleEn: "PVC Windows in Salt | Energy Renovation - Ara Finestra",
      metaDescriptionCa: "Instal·lació de finestres PVC a Salt. Renovació energètica per a comunitats i particulars.",
      metaDescriptionEs: "Instalación de ventanas PVC en Salt. Renovación energética para comunidades y particulares.",
      metaDescriptionEn: "PVC window installation in Salt. Energy renovation for communities and individuals.",
      published: true,
    },
    {
      slug: "roses",
      nombreCa: "Roses", nombreEs: "Roses", nombreEn: "Roses",
      latitud: 42.2596, longitud: 3.1769,
      contenidoCa: "Roses, a la badia de l'Alt Empordà, pateix l'efecte de la tramuntana i la salinitat del mar. Les finestres de PVC Cortizo són la millor opció per a segones residències i habitatges permanents, gràcies a la seva resistència a la corrosió i el seu alt aïllament. Pressupostos per a xalets i apartaments.",
      contenidoEs: "Roses, en la bahía del Alt Empordà, sufre el efecto de la tramontana y la salinidad del mar. Las ventanas de PVC Cortizo son la mejor opción para segundas residencias y viviendas permanentes, gracias a su resistencia a la corrosión y su alto aislamiento. Presupuestos para chalets y apartamentos.",
      contenidoEn: "Roses, on the Alt Emporda bay, suffers from the tramontana wind and sea salinity. Cortizo PVC windows are the best choice for second homes and permanent residences, thanks to their corrosion resistance and high insulation. Quotes for villas and apartments.",
      metaTitleCa: "Finestres PVC a Roses | Alt Empordà - Ara Finestra",
      metaTitleEs: "Ventanas PVC en Roses | Alt Empordà - Ara Finestra",
      metaTitleEn: "PVC Windows in Roses | Alt Emporda - Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Roses. Resistents a la tramuntana i la salinitat. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas de PVC en Roses. Resistentes a la tramontana y la salinidad. Presupuesto gratuito.",
      metaDescriptionEn: "PVC windows in Roses. Resistant to tramontana and salinity. Free quote.",
      published: true,
    },
    {
      slug: "pineda-de-mar",
      nombreCa: "Pineda de Mar", nombreEs: "Pineda de Mar", nombreEn: "Pineda de Mar",
      latitud: 41.6271, longitud: 2.6913,
      contenidoCa: "Pineda de Mar, al Maresme, és una localitat costanera amb molts edificis dels anys 70 i 80 que necessiten renovació de finestres. El PVC Cortizo substitueix les antigues finestres d'alumini amb un aïllament molt superior. Oferim servei complet amb retirada de les finestres velles.",
      contenidoEs: "Pineda de Mar, en el Maresme, es una localidad costera con muchos edificios de los años 70 y 80 que necesitan renovación de ventanas. El PVC Cortizo sustituye las antiguas ventanas de aluminio con un aislamiento muy superior. Ofrecemos servicio completo con retirada de las ventanas viejas.",
      contenidoEn: "Pineda de Mar, in the Maresme, is a coastal town with many buildings from the 70s and 80s that need window renovation. Cortizo PVC replaces old aluminum windows with much superior insulation. We offer a complete service including removal of old windows.",
      metaTitleCa: "Finestres PVC a Pineda de Mar | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Pineda de Mar | Ara Finestra",
      metaTitleEn: "PVC Windows in Pineda de Mar | Ara Finestra",
      metaDescriptionCa: "Canvi de finestres a Pineda de Mar. PVC Cortizo amb aïllament superior. Pressupost gratuït.",
      metaDescriptionEs: "Cambio de ventanas en Pineda de Mar. PVC Cortizo con aislamiento superior. Presupuesto gratuito.",
      metaDescriptionEn: "Window replacement in Pineda de Mar. Cortizo PVC with superior insulation. Free quote.",
      published: true,
    },
    {
      slug: "tordera",
      nombreCa: "Tordera", nombreEs: "Tordera", nombreEn: "Tordera",
      latitud: 41.6997, longitud: 2.7187,
      contenidoCa: "Tordera, entre el Maresme i la Selva, té un clima de transició entre la costa i l'interior. Les finestres de PVC Cortizo ofereixen versatilitat per a les cases unifamiliars i masies rehabilitades de la zona. Acabats en color fusta que s'integren amb l'entorn rural.",
      contenidoEs: "Tordera, entre el Maresme y la Selva, tiene un clima de transición entre la costa y el interior. Las ventanas de PVC Cortizo ofrecen versatilidad para las casas unifamiliares y masías rehabilitadas de la zona. Acabados en color madera que se integran con el entorno rural.",
      contenidoEn: "Tordera, between the Maresme and la Selva, has a transitional climate between the coast and the interior. Cortizo PVC windows offer versatility for single-family homes and renovated farmhouses in the area. Wood-color finishes that blend with the rural surroundings.",
      metaTitleCa: "Finestres PVC a Tordera | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Tordera | Ara Finestra",
      metaTitleEn: "PVC Windows in Tordera | Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Tordera. Acabats fusta per a cases i masies. Pressupost sense compromís.",
      metaDescriptionEs: "Ventanas de PVC en Tordera. Acabados madera para casas y masías. Presupuesto sin compromiso.",
      metaDescriptionEn: "PVC windows in Tordera. Wood finishes for houses and farmhouses. No-obligation quote.",
      published: true,
    },
    {
      slug: "arenys-de-mar",
      nombreCa: "Arenys de Mar", nombreEs: "Arenys de Mar", nombreEn: "Arenys de Mar",
      latitud: 41.5817, longitud: 2.5498,
      contenidoCa: "Arenys de Mar, vila marinera del Maresme, combina casc antic amb noves promocions. Les finestres de PVC Cortizo s'adapten a ambdós estils arquitectònics, oferint aïllament contra la humitat del port i el soroll del tren. Instal·lació professional amb garantia de 10 anys.",
      contenidoEs: "Arenys de Mar, villa marinera del Maresme, combina casco antiguo con nuevas promociones. Las ventanas de PVC Cortizo se adaptan a ambos estilos arquitectónicos, ofreciendo aislamiento contra la humedad del puerto y el ruido del tren. Instalación profesional con garantía de 10 años.",
      contenidoEn: "Arenys de Mar, a fishing village in the Maresme, combines old town with new developments. Cortizo PVC windows adapt to both architectural styles, offering insulation against port humidity and train noise. Professional installation with a 10-year warranty.",
      metaTitleCa: "Finestres PVC a Arenys de Mar | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Arenys de Mar | Ara Finestra",
      metaTitleEn: "PVC Windows in Arenys de Mar | Ara Finestra",
      metaDescriptionCa: "Finestres de PVC a Arenys de Mar. Aïllament acústic i tèrmic. Garantia 10 anys.",
      metaDescriptionEs: "Ventanas de PVC en Arenys de Mar. Aislamiento acústico y térmico. Garantía 10 años.",
      metaDescriptionEn: "PVC windows in Arenys de Mar. Acoustic and thermal insulation. 10-year warranty.",
      published: true,
    },
    {
      slug: "sant-feliu-de-guixols",
      nombreCa: "Sant Feliu de Guíxols", nombreEs: "Sant Feliu de Guíxols", nombreEn: "Sant Feliu de Guixols",
      latitud: 41.7838, longitud: 3.0299,
      contenidoCa: "Sant Feliu de Guíxols, al Baix Empordà, és una localitat costanera amb un patrimoni arquitectònic industrial i residencial. Les finestres de PVC Cortizo permeten rehabilitar edificis antics mantenint l'estètica original amb acabats personalitzats. Servei de mesura, fabricació i instal·lació a mida.",
      contenidoEs: "Sant Feliu de Guíxols, en el Baix Empordà, es una localidad costera con un patrimonio arquitectónico industrial y residencial. Las ventanas de PVC Cortizo permiten rehabilitar edificios antiguos manteniendo la estética original con acabados personalizados. Servicio de medición, fabricación e instalación a medida.",
      contenidoEn: "Sant Feliu de Guixols, in the Baix Emporda, is a coastal town with industrial and residential architectural heritage. Cortizo PVC windows allow rehabilitation of old buildings while maintaining the original aesthetics with custom finishes. Measurement, manufacturing, and custom installation service.",
      metaTitleCa: "Finestres PVC a Sant Feliu de Guíxols | Ara Finestra",
      metaTitleEs: "Ventanas PVC en Sant Feliu de Guíxols | Ara Finestra",
      metaTitleEn: "PVC Windows in Sant Feliu de Guixols | Ara Finestra",
      metaDescriptionCa: "Finestres PVC a Sant Feliu de Guíxols. Rehabilitació d'edificis amb Cortizo. Pressupost gratuït.",
      metaDescriptionEs: "Ventanas PVC en Sant Feliu de Guíxols. Rehabilitación de edificios con Cortizo. Presupuesto gratuito.",
      metaDescriptionEn: "PVC windows in Sant Feliu de Guixols. Building rehabilitation with Cortizo. Free quote.",
      published: true,
    },
  ];

  for (const zone of zonesData) {
    await db.insert(zones).values(zone).onConflictDoNothing({ target: zones.slug });
  }
  console.log("  15 Zones OK");

  // ── 8 Products ──────────────────────────────────────────────
  const productsData = [
    {
      tipo: "ventana",
      gama: "A-70",
      modelo: "Cortizo A-70",
      descripcion: "Sistema de ventana abatible de PVC de 70mm. Excelente relación calidad-precio con altas prestaciones de aislamiento.",
      precioBase: 180,
      precioPorM2: 160,
      coloresDisponibles: ["Blanc", "Roure", "Gris antracita", "Noguer", "Crema"],
      vidriosCompatibles: ["doble", "baix_emissiu", "triple"],
      especificaciones: {
        aislamiento_termico: "1.3 W/m2K",
        aislamiento_acustico: "38 dB",
        seguridad: "Herraje perimetral multipunto",
        permeabilidad_aire: "Clase 4",
        estanqueidad_agua: "Clase 9A",
      },
      activo: true,
    },
    {
      tipo: "ventana",
      gama: "C-70",
      modelo: "Cortizo C-70",
      descripcion: "Sistema premium de ventana PVC de 70mm con cámara central. Diseño estilizado con perfil visto reducido y máxima entrada de luz.",
      precioBase: 220,
      precioPorM2: 190,
      coloresDisponibles: ["Blanc", "Roure", "Gris antracita", "Noguer", "Crema", "Verd ral 6005"],
      vidriosCompatibles: ["doble", "baix_emissiu", "triple"],
      especificaciones: {
        aislamiento_termico: "1.2 W/m2K",
        aislamiento_acustico: "42 dB",
        seguridad: "Herraje perimetral RC2",
        permeabilidad_aire: "Clase 4",
        estanqueidad_agua: "Clase E1200",
      },
      activo: true,
    },
    {
      tipo: "ventana",
      gama: "E-170",
      modelo: "Cortizo E-170",
      descripcion: "Sistema top de gama con 6 cámaras y 82mm de profundidad. Máximo aislamiento térmico y acústico para Passivhaus y edificios de alta eficiencia.",
      precioBase: 280,
      precioPorM2: 240,
      coloresDisponibles: ["Blanc", "Roure", "Gris antracita", "Noguer", "Crema", "Avet", "Ral personalitzat"],
      vidriosCompatibles: ["doble", "baix_emissiu", "triple"],
      especificaciones: {
        aislamiento_termico: "0.9 W/m2K",
        aislamiento_acustico: "47 dB",
        seguridad: "Herraje perimetral RC2/RC3",
        permeabilidad_aire: "Clase 4",
        estanqueidad_agua: "Clase E1500",
        certificacion: "Passivhaus compatible",
      },
      activo: true,
    },
    {
      tipo: "corredera",
      gama: "A-70",
      modelo: "Cortizo Sliding A-70",
      descripcion: "Puerta corredera de PVC con sistema de deslizamiento suave. Ideal para terrazas y salones con grandes aperturas.",
      precioBase: 350,
      precioPorM2: 200,
      coloresDisponibles: ["Blanc", "Roure", "Gris antracita", "Noguer"],
      vidriosCompatibles: ["doble", "baix_emissiu"],
      especificaciones: {
        aislamiento_termico: "1.6 W/m2K",
        aislamiento_acustico: "35 dB",
        seguridad: "Cierre multipunto con llave",
        peso_max_hoja: "150 kg",
      },
      activo: true,
    },
    {
      tipo: "corredera",
      gama: "E-170",
      modelo: "Cortizo Sliding Premium",
      descripcion: "Corredera elevable premium con umbral enrasado. Apertura máxima y accesibilidad total. Para proyectos de alto standing.",
      precioBase: 450,
      precioPorM2: 260,
      coloresDisponibles: ["Blanc", "Roure", "Gris antracita", "Noguer", "Ral personalitzat"],
      vidriosCompatibles: ["doble", "baix_emissiu", "triple"],
      especificaciones: {
        aislamiento_termico: "1.1 W/m2K",
        aislamiento_acustico: "40 dB",
        seguridad: "Cierre multipunto RC2",
        peso_max_hoja: "400 kg",
        umbral: "Enrasado accesible",
      },
      activo: true,
    },
    {
      tipo: "persiana",
      gama: "Compacta",
      modelo: "Persiana PVC compacta",
      descripcion: "Sistema de persiana enrollable con cajón compacto integrado en la ventana. Lamas de PVC aislantes con accionamiento manual o motorizado.",
      precioBase: 80,
      precioPorM2: 60,
      coloresDisponibles: ["Blanc", "Gris", "Marró"],
      vidriosCompatibles: [],
      especificaciones: {
        aislamiento_termico: "Cajón aislado 25mm",
        aislamiento_acustico: "Reducción 5 dB adicional",
        seguridad: "Bloqueo antielevación",
        accionamiento: "Manual con cinta o motorizado",
      },
      activo: true,
    },
    {
      tipo: "persiana",
      gama: "Cajón exterior",
      modelo: "Persiana PVC cajón exterior",
      descripcion: "Persiana enrollable con cajón exterior de aluminio. Ideal para rehabilitaciones donde no se puede integrar el cajón. Lamas de PVC de alta densidad.",
      precioBase: 100,
      precioPorM2: 75,
      coloresDisponibles: ["Blanc", "Gris", "Marró", "Ral personalitzat"],
      vidriosCompatibles: [],
      especificaciones: {
        aislamiento_termico: "Cajón aislado 30mm",
        aislamiento_acustico: "Reducción 6 dB adicional",
        seguridad: "Bloqueo antielevación reforzado",
        accionamiento: "Manual, motorizado o domótica",
      },
      activo: true,
    },
    {
      tipo: "mosquitera",
      gama: "Corredera",
      modelo: "Mosquitera corredera",
      descripcion: "Mosquitera de aluminio con tela de fibra de vidrio. Sistema corredera adaptable a ventanas y puertas. Fácil limpieza y mantenimiento.",
      precioBase: 40,
      precioPorM2: 30,
      coloresDisponibles: ["Blanc", "Gris", "Marró"],
      vidriosCompatibles: [],
      especificaciones: {
        material_tela: "Fibra de vidrio",
        apertura: "Corredera horizontal",
        perfil: "Aluminio lacado",
        luz_malla: "1.2 mm anti-insectos",
      },
      activo: true,
    },
  ];

  for (const product of productsData) {
    await db
      .insert(products)
      .values({
        ...product,
        especificaciones: product.especificaciones as unknown as Record<string, string>,
      })
      .onConflictDoNothing();
  }
  console.log("  8 Products OK");

  // ── Site Config (10 keys) ───────────────────────────────────
  const configData = [
    { key: "telefono", valueCa: "+34 972 XXX XXX", valueEs: "+34 972 XXX XXX", valueEn: "+34 972 XXX XXX" },
    { key: "email", valueCa: "info@arafinestra.com", valueEs: "info@arafinestra.com", valueEn: "info@arafinestra.com" },
    { key: "whatsapp", valueCa: "34972XXXXXX", valueEs: "34972XXXXXX", valueEn: "34972XXXXXX" },
    { key: "horario", valueCa: "Dilluns a Divendres 9:00-18:00", valueEs: "Lunes a Viernes 9:00-18:00", valueEn: "Monday to Friday 9:00-18:00" },
    { key: "direccion", valueCa: "Blanes, Girona", valueEs: "Blanes, Girona", valueEn: "Blanes, Girona" },
    { key: "facebook", valueCa: "https://facebook.com/arafinestra", valueEs: "https://facebook.com/arafinestra", valueEn: "https://facebook.com/arafinestra" },
    { key: "instagram", valueCa: "https://instagram.com/arafinestra", valueEs: "https://instagram.com/arafinestra", valueEn: "https://instagram.com/arafinestra" },
    { key: "cifras_experiencia", valueCa: "15", valueEs: "15", valueEn: "15" },
    { key: "cifras_proyectos", valueCa: "500", valueEs: "500", valueEn: "500" },
    { key: "cifras_zona", valueCa: "60", valueEs: "60", valueEn: "60" },
  ];

  for (const cfg of configData) {
    await db.insert(siteConfig).values(cfg).onConflictDoNothing({ target: siteConfig.key });
  }
  console.log("  10 Site Config keys OK");

  // ── 2 Testimonials ─────────────────────────────────────────
  const testimonialsData = [
    {
      nombre: "Maria G.",
      localidad: "Blanes",
      textoCa: "Estem molt contents amb les noves finestres de PVC. L'equip d'Ara Finestra va ser molt professional, van acabar la instal·lació en un sol dia i la diferència d'aïllament és increïble. Ja no sentim el soroll del carrer i la casa es manté molt més calenta a l'hivern.",
      textoEs: "Estamos muy contentos con las nuevas ventanas de PVC. El equipo de Ara Finestra fue muy profesional, terminaron la instalación en un solo día y la diferencia de aislamiento es increíble. Ya no oímos el ruido de la calle y la casa se mantiene mucho más caliente en invierno.",
      textoEn: "We are very happy with the new PVC windows. The Ara Finestra team was very professional, they finished the installation in one day and the insulation difference is incredible. We no longer hear street noise and the house stays much warmer in winter.",
      puntuacion: 5,
      published: true,
    },
    {
      nombre: "Joan P.",
      localidad: "Girona",
      textoCa: "Vam instal·lar portes corredisses de PVC al saló i la terrassa. El resultat és espectacular, l'obertura és molt àmplia i el funcionament és suau i silenciós. El pressupost va ser molt competitiu i el termini de lliurament es va complir perfectament.",
      textoEs: "Instalamos puertas correderas de PVC en el salón y la terraza. El resultado es espectacular, la apertura es muy amplia y el funcionamiento es suave y silencioso. El presupuesto fue muy competitivo y el plazo de entrega se cumplió perfectamente.",
      textoEn: "We installed PVC sliding doors in the living room and terrace. The result is spectacular, the opening is very wide and the operation is smooth and silent. The quote was very competitive and the delivery time was perfectly met.",
      puntuacion: 5,
      published: true,
    },
  ];

  for (const t of testimonialsData) {
    await db.insert(testimonials).values(t).onConflictDoNothing();
  }
  console.log("  2 Testimonials OK");

  // ── 1 Blog Post ─────────────────────────────────────────────
  const blogData = {
    slug: "finestres-pvc-vs-alumini-2026",
    tituloCa: "Finestres de PVC vs Alumini: Guia Comparativa 2026",
    tituloEs: "Ventanas de PVC vs Aluminio: Guía Comparativa 2026",
    tituloEn: "PVC vs Aluminum Windows: 2026 Comparative Guide",
    contenidoCa: `## Per què triar PVC o alumini per a les teves finestres?

Quan arriba el moment de canviar les finestres de casa, la pregunta més habitual és: **PVC o alumini?** Ambdós materials tenen avantatges, però les diferències en aïllament, preu i durabilitat poden marcar una gran diferència en el confort i l'estalvi energètic de la teva llar.

## Aïllament tèrmic: el PVC guanya clarament

El PVC és un material amb una conductivitat tèrmica molt baixa (0.16 W/mK), mentre que l'alumini condueix el calor unes 1.000 vegades més ràpid. Això significa que una finestra de PVC Cortizo A-70 amb doble vidre aconsegueix valors d'aïllament de 1.3 W/m2K, molt per sota dels 2.5-3.0 W/m2K d'una finestra d'alumini amb trencament de pont tèrmic.

A la pràctica, això es tradueix en un **estalvi del 25-40% en calefacció i aire condicionat**, especialment important a zones com la Costa Brava (estius calorosos) o la Garrotxa (hiverns freds).

## Preu: el PVC és més accessible

Una finestra de PVC de qualitat costa entre un 15% i un 30% menys que una finestra d'alumini equivalent amb rotura de pont tèrmic. A més, el retorn de la inversió és més ràpid gràcies a l'estalvi energètic superior.

## Manteniment i durabilitat

Les finestres de PVC no necessiten pintura ni lacatge, no es corroen amb la sal marina (ideal per a la Costa Brava) i mantenen el seu aspecte durant dècades. L'alumini, en canvi, pot necessitar relacatge en zones costaneres.

## Conclusió

Per a la majoria d'habitatges a les comarques de Girona i el Maresme, les finestres de PVC Cortizo ofereixen la millor combinació de preu, aïllament i durabilitat. Demana el teu pressupost gratuït i compara.`,
    contenidoEs: `## ¿Por qué elegir PVC o aluminio para tus ventanas?

Cuando llega el momento de cambiar las ventanas de casa, la pregunta más habitual es: **¿PVC o aluminio?** Ambos materiales tienen ventajas, pero las diferencias en aislamiento, precio y durabilidad pueden marcar una gran diferencia en el confort y el ahorro energético de tu hogar.

## Aislamiento térmico: el PVC gana claramente

El PVC es un material con una conductividad térmica muy baja (0.16 W/mK), mientras que el aluminio conduce el calor unas 1.000 veces más rápido. Esto significa que una ventana de PVC Cortizo A-70 con doble vidrio alcanza valores de aislamiento de 1.3 W/m2K, muy por debajo de los 2.5-3.0 W/m2K de una ventana de aluminio con rotura de puente térmico.

En la práctica, esto se traduce en un **ahorro del 25-40% en calefacción y aire acondicionado**, especialmente importante en zonas como la Costa Brava (veranos calurosos) o la Garrotxa (inviernos fríos).

## Precio: el PVC es más accesible

Una ventana de PVC de calidad cuesta entre un 15% y un 30% menos que una ventana de aluminio equivalente con rotura de puente térmico. Además, el retorno de la inversión es más rápido gracias al ahorro energético superior.

## Mantenimiento y durabilidad

Las ventanas de PVC no necesitan pintura ni lacado, no se corroen con la sal marina (ideal para la Costa Brava) y mantienen su aspecto durante décadas. El aluminio, en cambio, puede necesitar relacado en zonas costeras.

## Conclusión

Para la mayoría de viviendas en las comarcas de Girona y el Maresme, las ventanas de PVC Cortizo ofrecen la mejor combinación de precio, aislamiento y durabilidad. Pide tu presupuesto gratuito y compara.`,
    contenidoEn: `## Why choose PVC or aluminum for your windows?

When it's time to replace your home windows, the most common question is: **PVC or aluminum?** Both materials have advantages, but the differences in insulation, price, and durability can make a significant difference in your home's comfort and energy savings.

## Thermal insulation: PVC wins clearly

PVC is a material with very low thermal conductivity (0.16 W/mK), while aluminum conducts heat about 1,000 times faster. This means a Cortizo A-70 PVC window with double glazing achieves insulation values of 1.3 W/m2K, well below the 2.5-3.0 W/m2K of an aluminum window with thermal break.

In practice, this translates to **25-40% savings on heating and air conditioning**, especially important in areas like the Costa Brava (hot summers) or the Garrotxa (cold winters).

## Price: PVC is more affordable

A quality PVC window costs 15% to 30% less than an equivalent aluminum window with thermal break. Additionally, the return on investment is faster thanks to superior energy savings.

## Maintenance and durability

PVC windows don't need painting or lacquering, they don't corrode from sea salt (ideal for the Costa Brava), and they maintain their appearance for decades. Aluminum, on the other hand, may need re-lacquering in coastal areas.

## Conclusion

For most homes in the Girona and Maresme regions, Cortizo PVC windows offer the best combination of price, insulation, and durability. Request your free quote and compare.`,
    extractoCa: "Compara finestres de PVC i alumini: aïllament, preu, durabilitat i manteniment. Descobreix per què el PVC Cortizo és la millor opció per a la teva llar.",
    extractoEs: "Compara ventanas de PVC y aluminio: aislamiento, precio, durabilidad y mantenimiento. Descubre por qué el PVC Cortizo es la mejor opción para tu hogar.",
    extractoEn: "Compare PVC and aluminum windows: insulation, price, durability, and maintenance. Discover why Cortizo PVC is the best choice for your home.",
    categoria: "Ventanas",
    autor: "Ara Finestra",
    metaTitleCa: "Finestres PVC vs Alumini 2026: Guia Comparativa | Ara Finestra",
    metaTitleEs: "Ventanas PVC vs Aluminio 2026: Guía Comparativa | Ara Finestra",
    metaTitleEn: "PVC vs Aluminum Windows 2026: Comparative Guide | Ara Finestra",
    metaDescriptionCa: "Compara finestres de PVC i alumini: aïllament tèrmic, preus, durabilitat. Guia actualitzada 2026 per a cases a Girona i el Maresme.",
    metaDescriptionEs: "Compara ventanas de PVC y aluminio: aislamiento térmico, precios, durabilidad. Guía actualizada 2026 para casas en Girona y el Maresme.",
    metaDescriptionEn: "Compare PVC and aluminum windows: thermal insulation, prices, durability. Updated 2026 guide for homes in Girona and the Maresme.",
    published: true,
    publishedAt: new Date(),
  };

  await db.insert(blogPosts).values(blogData).onConflictDoNothing({ target: blogPosts.slug });
  console.log("  1 Blog Post OK");

  // ── Blog Post 2: Com triar finestres ──────────────────────
  const blogData2 = {
    slug: "com-triar-finestres-llar",
    tituloCa: "Com triar les millors finestres per a la teva llar",
    tituloEs: "Cómo elegir las mejores ventanas para tu hogar",
    tituloEn: "How to Choose the Best Windows for Your Home",
    contenidoCa: `<h2>Guia completa per triar finestres</h2>
<p>Escollir les finestres adequades per a la teva llar és una decisió important que afecta el confort, l'eficiència energètica i el valor de l'immoble. A Catalunya, on el clima varia des de la brisa marina de la Costa Brava fins als hiverns freds de l'interior, triar bé és essencial.</p>

<h3>1. Material del perfil: PVC, alumini o fusta?</h3>
<p>El <strong>PVC</strong> ofereix el millor equilibri entre aïllament tèrmic, durabilitat i preu. A diferència de l'alumini, no transmet el fred ni la calor, i a diferència de la fusta, no requereix manteniment periòdic. Els perfils Cortizo de PVC inclouen cambres d'aire internes que actuen com a barrera tèrmica natural.</p>

<h3>2. Tipus de vidre</h3>
<p>El vidre representa el 70-80% de la superfície de la finestra, per això la seva elecció és fonamental:</p>
<ul>
<li><strong>Doble vidre:</strong> dos vidres amb cambra d'aire. Estàndard per a la majoria de llars.</li>
<li><strong>Vidre baix emissiu:</strong> capa metàl·lica que reflecteix el calor cap a l'interior a l'hivern i el rebutja a l'estiu. Estalvi addicional del 15-20%.</li>
<li><strong>Triple vidre:</strong> tres vidres amb dues cambres. Recomanat per a zones de muntanya com Olot o Figueres amb tramuntana.</li>
</ul>

<h3>3. Aïllament acústic</h3>
<p>Si vius a prop d'una carretera, aeroport o zona urbana sorollosa, l'aïllament acústic és prioritari. Les finestres de PVC Cortizo C-70 aconsegueixen fins a 42 dB de reducció sonora, equivalent a convertir el soroll d'un carrer transitat en un murmuri llunyà.</p>

<h3>4. Eficiència energètica</h3>
<p>Busca finestres amb una <strong>transmitància tèrmica (valor U) baixa</strong>. A Catalunya, recomanem un valor U inferior a 1.4 W/m²K per complir amb el CTE i accedir a subvencions Next Generation. El model Cortizo E-170 aconsegueix 0.9 W/m²K, apte per a estàndards Passivhaus.</p>

<h3>5. Tipus d'obertura</h3>
<p>L'obertura oscil·lobatent és la més versàtil: permet ventilació parcial (posició oscil·lant) i obertura completa. Per a terrasses, les corredisses elevables ofereixen grans superfícies de vidre amb un funcionament suau.</p>

<h3>6. Colors i acabats</h3>
<p>Les finestres de PVC modernes ofereixen acabats que imiten la fusta, colors RAL personalitzats i tons clàssics com blanc o gris antracita. L'acabat foliado és resistent als raigs UV i no es decolora amb el temps.</p>

<h3>Conclusió</h3>
<p>Cada llar és diferent. A Ara Finestra t'assessorem gratuïtament per trobar la finestra perfecta segons la teva ubicació, pressupost i necessitats. Demana el teu pressupost sense compromís.</p>`,
    contenidoEs: `<h2>Guía completa para elegir ventanas</h2>
<p>Elegir las ventanas adecuadas para tu hogar es una decisión importante que afecta al confort, la eficiencia energética y el valor del inmueble. En Cataluña, donde el clima varía desde la brisa marina de la Costa Brava hasta los inviernos fríos del interior, elegir bien es esencial.</p>

<h3>1. Material del perfil: ¿PVC, aluminio o madera?</h3>
<p>El <strong>PVC</strong> ofrece el mejor equilibrio entre aislamiento térmico, durabilidad y precio. A diferencia del aluminio, no transmite el frío ni el calor, y a diferencia de la madera, no requiere mantenimiento periódico. Los perfiles Cortizo de PVC incluyen cámaras de aire internas que actúan como barrera térmica natural.</p>

<h3>2. Tipo de vidrio</h3>
<p>El vidrio representa el 70-80% de la superficie de la ventana, por lo que su elección es fundamental:</p>
<ul>
<li><strong>Doble vidrio:</strong> dos vidrios con cámara de aire. Estándar para la mayoría de hogares.</li>
<li><strong>Vidrio bajo emisivo:</strong> capa metálica que refleja el calor hacia el interior en invierno y lo rechaza en verano. Ahorro adicional del 15-20%.</li>
<li><strong>Triple vidrio:</strong> tres vidrios con dos cámaras. Recomendado para zonas de montaña como Olot o Figueres con tramontana.</li>
</ul>

<h3>3. Aislamiento acústico</h3>
<p>Si vives cerca de una carretera, aeropuerto o zona urbana ruidosa, el aislamiento acústico es prioritario. Las ventanas de PVC Cortizo C-70 alcanzan hasta 42 dB de reducción sonora, equivalente a convertir el ruido de una calle transitada en un murmullo lejano.</p>

<h3>4. Eficiencia energética</h3>
<p>Busca ventanas con una <strong>transmitancia térmica (valor U) baja</strong>. En Cataluña, recomendamos un valor U inferior a 1.4 W/m²K para cumplir con el CTE y acceder a subvenciones Next Generation. El modelo Cortizo E-170 alcanza 0.9 W/m²K, apto para estándares Passivhaus.</p>

<h3>5. Tipo de apertura</h3>
<p>La apertura oscilobatiente es la más versátil: permite ventilación parcial (posición oscilante) y apertura completa. Para terrazas, las correderas elevables ofrecen grandes superficies de vidrio con un funcionamiento suave.</p>

<h3>6. Colores y acabados</h3>
<p>Las ventanas de PVC modernas ofrecen acabados que imitan la madera, colores RAL personalizados y tonos clásicos como blanco o gris antracita. El acabado foliado es resistente a los rayos UV y no se decolora con el tiempo.</p>

<h3>Conclusión</h3>
<p>Cada hogar es diferente. En Ara Finestra te asesoramos gratuitamente para encontrar la ventana perfecta según tu ubicación, presupuesto y necesidades. Pide tu presupuesto sin compromiso.</p>`,
    contenidoEn: `<h2>Complete guide to choosing windows</h2>
<p>Choosing the right windows for your home is an important decision that affects comfort, energy efficiency, and property value. In Catalonia, where the climate ranges from the Costa Brava sea breeze to cold inland winters, making the right choice is essential.</p>

<h3>1. Profile material: PVC, aluminum, or wood?</h3>
<p><strong>PVC</strong> offers the best balance between thermal insulation, durability, and price. Unlike aluminum, it doesn't transmit cold or heat, and unlike wood, it doesn't require periodic maintenance. Cortizo PVC profiles include internal air chambers that act as a natural thermal barrier.</p>

<h3>2. Glass type</h3>
<p>Glass represents 70-80% of the window surface, making its selection fundamental:</p>
<ul>
<li><strong>Double glazing:</strong> two panes with an air chamber. Standard for most homes.</li>
<li><strong>Low-emissivity glass:</strong> metallic coating that reflects heat inward in winter and rejects it in summer. Additional savings of 15-20%.</li>
<li><strong>Triple glazing:</strong> three panes with two chambers. Recommended for mountain areas like Olot or Figueres with tramontana winds.</li>
</ul>

<h3>3. Acoustic insulation</h3>
<p>If you live near a highway, airport, or noisy urban area, acoustic insulation is a priority. Cortizo C-70 PVC windows achieve up to 42 dB of noise reduction, equivalent to turning busy street noise into a distant murmur.</p>

<h3>4. Energy efficiency</h3>
<p>Look for windows with a <strong>low thermal transmittance (U-value)</strong>. In Catalonia, we recommend a U-value below 1.4 W/m²K to comply with CTE regulations and access Next Generation subsidies. The Cortizo E-170 model achieves 0.9 W/m²K, suitable for Passivhaus standards.</p>

<h3>5. Opening type</h3>
<p>Tilt-and-turn opening is the most versatile: it allows partial ventilation (tilt position) and full opening. For terraces, lift-and-slide doors offer large glass surfaces with smooth operation.</p>

<h3>6. Colors and finishes</h3>
<p>Modern PVC windows offer wood-effect finishes, custom RAL colors, and classic tones like white or anthracite grey. The foil finish is UV resistant and won't fade over time.</p>

<h3>Conclusion</h3>
<p>Every home is different. At Ara Finestra, we provide free advice to find the perfect window for your location, budget, and needs. Request your no-obligation quote today.</p>`,
    extractoCa: "Guia completa per triar finestres: material, vidre, aïllament acústic, eficiència energètica, tipus d'obertura i acabats. Tot el que necessites saber abans de canviar les finestres.",
    extractoEs: "Guía completa para elegir ventanas: material, vidrio, aislamiento acústico, eficiencia energética, tipo de apertura y acabados. Todo lo que necesitas saber antes de cambiar las ventanas.",
    extractoEn: "Complete guide to choosing windows: material, glass, acoustic insulation, energy efficiency, opening type, and finishes. Everything you need to know before replacing your windows.",
    categoria: "Guies",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Com triar les millors finestres per a la teva llar | Ara Finestra",
    metaTitleEs: "Cómo elegir las mejores ventanas para tu hogar | Ara Finestra",
    metaTitleEn: "How to Choose the Best Windows for Your Home | Ara Finestra",
    metaDescriptionCa: "Guia per triar finestres: PVC vs alumini, tipus de vidre, aïllament acústic i tèrmic. Consells d'experts per a llars a Catalunya.",
    metaDescriptionEs: "Guía para elegir ventanas: PVC vs aluminio, tipo de vidrio, aislamiento acústico y térmico. Consejos de expertos para hogares en Cataluña.",
    metaDescriptionEn: "Guide to choosing windows: PVC vs aluminum, glass type, acoustic and thermal insulation. Expert advice for homes in Catalonia.",
    published: true,
    publishedAt: new Date(),
  };

  await db.insert(blogPosts).values(blogData2).onConflictDoNothing({ target: blogPosts.slug });
  console.log("  Blog Post 2 OK");

  // ── Blog Post 3: Aïllament tèrmic i estalvi energètic ────
  const blogData3 = {
    slug: "aillament-termic-estalvi-energetic-pvc",
    tituloCa: "Aïllament tèrmic i estalvi energètic amb finestres PVC",
    tituloEs: "Aislamiento térmico y ahorro energético con ventanas PVC",
    tituloEn: "Thermal Insulation and Energy Savings with PVC Windows",
    contenidoCa: `<h2>Com les finestres de PVC redueixen la teva factura energètica</h2>
<p>Les finestres són el punt més feble de l'envolupant tèrmica d'un habitatge. Fins al <strong>30% de les pèrdues de calor</strong> a l'hivern i els guanys de calor a l'estiu es produeixen a través de finestres antigues o mal aïllades. Substituir-les per finestres de PVC Cortizo és la millora amb el retorn d'inversió més ràpid.</p>

<h3>Què és el valor U i per què importa?</h3>
<p>El valor U (transmitància tèrmica) mesura la quantitat de calor que travessa la finestra. Com més baix, millor aïllament:</p>
<ul>
<li><strong>Finestra antiga d'alumini sense RPT:</strong> 5.0-5.7 W/m²K</li>
<li><strong>Alumini amb rotura de pont tèrmic:</strong> 2.5-3.0 W/m²K</li>
<li><strong>PVC Cortizo A-70 (doble vidre):</strong> 1.3 W/m²K</li>
<li><strong>PVC Cortizo E-170 (triple vidre):</strong> 0.9 W/m²K</li>
</ul>
<p>La diferència entre una finestra antiga (5.0) i una de PVC moderna (1.3) suposa una <strong>reducció del 74% en les pèrdues tèrmiques</strong> a través de la finestra.</p>

<h3>Estalvi real a Catalunya</h3>
<p>Un habitatge típic de 90 m² a Girona amb finestres antigues pot gastar uns 1.800€/any en calefacció i refrigeració. Amb finestres de PVC Cortizo, l'estalvi estimat és de <strong>450-720€ anuals</strong>, la qual cosa significa que la inversió es recupera en 5-8 anys.</p>
<p>A zones de muntanya com Olot o la Cerdanya, l'estalvi pot ser encara superior gràcies a l'ús de triple vidre amb gas argó, que aconsegueix valors U de 0.9 W/m²K.</p>

<h3>Certificacions i normativa</h3>
<p>El Codi Tècnic de l'Edificació (CTE) estableix uns valors U màxims segons la zona climàtica. A Catalunya:</p>
<ul>
<li><strong>Zona C (costa):</strong> U màxim 2.3 W/m²K</li>
<li><strong>Zona D (interior):</strong> U màxim 1.8 W/m²K</li>
<li><strong>Zona E (muntanya):</strong> U màxim 1.4 W/m²K</li>
</ul>
<p>Totes les finestres Cortizo de PVC compleixen sobradament amb la normativa, i els models E-170 estan preparats per a l'estàndard Passivhaus.</p>

<h3>Vidre baix emissiu: la clau de l'eficiència</h3>
<p>El vidre baix emissiu té una capa microscòpica de metall que reflecteix la radiació infraroja. A l'hivern, manté el calor dins de casa; a l'estiu, rebutja la calor solar. Combinat amb gas argó entre els vidres, s'aconsegueix una millora addicional del 15-20% respecte al doble vidre estàndard.</p>

<h3>Estanqueïtat: l'element oblidat</h3>
<p>Una finestra pot tenir un bon vidre i un bon perfil, però si no és estanca, l'aire s'escaparà per les juntes. Les finestres Cortizo compten amb <strong>doble o triple junta d'estanqueïtat</strong> i ferramentes perimetrals que asseguren un tancament hermètic a tot el perímetre. La classificació d'estanqueïtat classe 4 garanteix zero infiltracions d'aire.</p>

<h3>Conclusió</h3>
<p>Invertir en finestres de PVC és invertir en confort i estalvi. A Ara Finestra calculem l'estalvi estimat per a la teva llar de forma gratuïta. Contacta'ns i descobreix quant pots estalviar.</p>`,
    contenidoEs: `<h2>Cómo las ventanas de PVC reducen tu factura energética</h2>
<p>Las ventanas son el punto más débil de la envolvente térmica de una vivienda. Hasta el <strong>30% de las pérdidas de calor</strong> en invierno y las ganancias de calor en verano se producen a través de ventanas antiguas o mal aisladas. Sustituirlas por ventanas de PVC Cortizo es la mejora con el retorno de inversión más rápido.</p>

<h3>¿Qué es el valor U y por qué importa?</h3>
<p>El valor U (transmitancia térmica) mide la cantidad de calor que atraviesa la ventana. Cuanto más bajo, mejor aislamiento:</p>
<ul>
<li><strong>Ventana antigua de aluminio sin RPT:</strong> 5.0-5.7 W/m²K</li>
<li><strong>Aluminio con rotura de puente térmico:</strong> 2.5-3.0 W/m²K</li>
<li><strong>PVC Cortizo A-70 (doble vidrio):</strong> 1.3 W/m²K</li>
<li><strong>PVC Cortizo E-170 (triple vidrio):</strong> 0.9 W/m²K</li>
</ul>
<p>La diferencia entre una ventana antigua (5.0) y una de PVC moderna (1.3) supone una <strong>reducción del 74% en las pérdidas térmicas</strong> a través de la ventana.</p>

<h3>Ahorro real en Cataluña</h3>
<p>Una vivienda típica de 90 m² en Girona con ventanas antiguas puede gastar unos 1.800€/año en calefacción y refrigeración. Con ventanas de PVC Cortizo, el ahorro estimado es de <strong>450-720€ anuales</strong>, lo que significa que la inversión se recupera en 5-8 años.</p>
<p>En zonas de montaña como Olot o la Cerdanya, el ahorro puede ser aún mayor gracias al uso de triple vidrio con gas argón, que alcanza valores U de 0.9 W/m²K.</p>

<h3>Certificaciones y normativa</h3>
<p>El Código Técnico de la Edificación (CTE) establece unos valores U máximos según la zona climática. En Cataluña:</p>
<ul>
<li><strong>Zona C (costa):</strong> U máximo 2.3 W/m²K</li>
<li><strong>Zona D (interior):</strong> U máximo 1.8 W/m²K</li>
<li><strong>Zona E (montaña):</strong> U máximo 1.4 W/m²K</li>
</ul>
<p>Todas las ventanas Cortizo de PVC cumplen sobradamente con la normativa, y los modelos E-170 están preparados para el estándar Passivhaus.</p>

<h3>Vidrio bajo emisivo: la clave de la eficiencia</h3>
<p>El vidrio bajo emisivo tiene una capa microscópica de metal que refleja la radiación infrarroja. En invierno, mantiene el calor dentro de casa; en verano, rechaza el calor solar. Combinado con gas argón entre los vidrios, se consigue una mejora adicional del 15-20% respecto al doble vidrio estándar.</p>

<h3>Estanqueidad: el elemento olvidado</h3>
<p>Una ventana puede tener un buen vidrio y un buen perfil, pero si no es estanca, el aire se escapará por las juntas. Las ventanas Cortizo cuentan con <strong>doble o triple junta de estanqueidad</strong> y herrajes perimetrales que aseguran un cierre hermético en todo el perímetro. La clasificación de estanqueidad clase 4 garantiza cero infiltraciones de aire.</p>

<h3>Conclusión</h3>
<p>Invertir en ventanas de PVC es invertir en confort y ahorro. En Ara Finestra calculamos el ahorro estimado para tu hogar de forma gratuita. Contáctanos y descubre cuánto puedes ahorrar.</p>`,
    contenidoEn: `<h2>How PVC windows reduce your energy bill</h2>
<p>Windows are the weakest point in a home's thermal envelope. Up to <strong>30% of heat loss</strong> in winter and heat gain in summer occurs through old or poorly insulated windows. Replacing them with Cortizo PVC windows is the improvement with the fastest return on investment.</p>

<h3>What is the U-value and why does it matter?</h3>
<p>The U-value (thermal transmittance) measures the amount of heat that passes through the window. The lower it is, the better the insulation:</p>
<ul>
<li><strong>Old aluminum window without thermal break:</strong> 5.0-5.7 W/m²K</li>
<li><strong>Aluminum with thermal break:</strong> 2.5-3.0 W/m²K</li>
<li><strong>PVC Cortizo A-70 (double glazing):</strong> 1.3 W/m²K</li>
<li><strong>PVC Cortizo E-170 (triple glazing):</strong> 0.9 W/m²K</li>
</ul>
<p>The difference between an old window (5.0) and a modern PVC one (1.3) represents a <strong>74% reduction in thermal losses</strong> through the window.</p>

<h3>Real savings in Catalonia</h3>
<p>A typical 90 m² home in Girona with old windows can spend around €1,800/year on heating and cooling. With Cortizo PVC windows, the estimated saving is <strong>€450-720 per year</strong>, meaning the investment pays for itself in 5-8 years.</p>
<p>In mountain areas like Olot or the Cerdanya, savings can be even greater thanks to triple glazing with argon gas, achieving U-values of 0.9 W/m²K.</p>

<h3>Certifications and regulations</h3>
<p>Spain's Technical Building Code (CTE) establishes maximum U-values according to climate zone. In Catalonia:</p>
<ul>
<li><strong>Zone C (coast):</strong> Maximum U 2.3 W/m²K</li>
<li><strong>Zone D (inland):</strong> Maximum U 1.8 W/m²K</li>
<li><strong>Zone E (mountain):</strong> Maximum U 1.4 W/m²K</li>
</ul>
<p>All Cortizo PVC windows comfortably meet the regulations, and the E-170 models are Passivhaus-ready.</p>

<h3>Low-emissivity glass: the key to efficiency</h3>
<p>Low-emissivity glass has a microscopic metal coating that reflects infrared radiation. In winter, it keeps heat inside the home; in summer, it rejects solar heat. Combined with argon gas between the panes, it achieves an additional 15-20% improvement over standard double glazing.</p>

<h3>Air tightness: the forgotten element</h3>
<p>A window can have great glass and a great profile, but if it's not airtight, air will escape through the joints. Cortizo windows feature <strong>double or triple weatherseals</strong> and perimeter hardware that ensures a hermetic closure around the entire frame. Class 4 air permeability rating guarantees zero air infiltration.</p>

<h3>Conclusion</h3>
<p>Investing in PVC windows means investing in comfort and savings. At Ara Finestra, we calculate the estimated savings for your home free of charge. Contact us and discover how much you can save.</p>`,
    extractoCa: "Descobreix com les finestres de PVC redueixen fins al 40% la factura energètica. Valors U, vidre baix emissiu, certificacions i estalvi real a Catalunya.",
    extractoEs: "Descubre cómo las ventanas de PVC reducen hasta un 40% la factura energética. Valores U, vidrio bajo emisivo, certificaciones y ahorro real en Cataluña.",
    extractoEn: "Discover how PVC windows reduce energy bills by up to 40%. U-values, low-emissivity glass, certifications, and real savings in Catalonia.",
    categoria: "Eficiència Energètica",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Aïllament tèrmic i estalvi energètic amb finestres PVC | Ara Finestra",
    metaTitleEs: "Aislamiento térmico y ahorro energético con ventanas PVC | Ara Finestra",
    metaTitleEn: "Thermal Insulation and Energy Savings with PVC Windows | Ara Finestra",
    metaDescriptionCa: "Com les finestres de PVC redueixen la factura energètica: valors U, vidre baix emissiu, normativa CTE i estalvi real per a llars a Catalunya.",
    metaDescriptionEs: "Cómo las ventanas de PVC reducen la factura energética: valores U, vidrio bajo emisivo, normativa CTE y ahorro real para hogares en Cataluña.",
    metaDescriptionEn: "How PVC windows reduce energy bills: U-values, low-emissivity glass, CTE regulations, and real savings for homes in Catalonia.",
    published: true,
    publishedAt: new Date(),
  };

  await db.insert(blogPosts).values(blogData3).onConflictDoNothing({ target: blogPosts.slug });
  console.log("  Blog Post 3 OK");

  // ── Blog Post 4: Subvencions Next Generation ─────────────
  const blogData4 = {
    slug: "subvencions-next-generation-finestres-2026",
    tituloCa: "Subvencions Next Generation per a la renovació de finestres 2026",
    tituloEs: "Subvenciones Next Generation para la renovación de ventanas 2026",
    tituloEn: "Next Generation Subsidies for Window Renovation 2026",
    contenidoCa: `<h2>Aprofita les ajudes europees per renovar les teves finestres</h2>
<p>El programa <strong>Next Generation EU</strong> destina fons significatius a la rehabilitació energètica d'edificis a Espanya. Si estàs pensant en canviar les finestres, aquest és el millor moment: pots obtenir fins al <strong>40-80% del cost subvencionat</strong> segons la millora energètica aconseguida.</p>

<h3>Quines ajudes estan disponibles el 2026?</h3>
<p>Les principals línies de subvenció per a finestres a Catalunya són:</p>
<ul>
<li><strong>Programa 3 (edificis residencials):</strong> fins a 6.300€ per habitatge per a actuacions a l'envolupant tèrmica (inclou finestres). Subvenció del 40-80% segons la reducció d'energia primària aconseguida.</li>
<li><strong>Programa 4 (habitatges individuals):</strong> fins a 3.000€ per habitatge. Subvenció del 40% amb un mínim de 30% de reducció en demanda de calefacció/refrigeració.</li>
<li><strong>Deduccions IRPF:</strong> deducció addicional del 20-60% en la declaració de la renda per obres de millora energètica, amb una base màxima de 5.000-7.500€.</li>
</ul>

<h3>Qui pot sol·licitar les subvencions?</h3>
<p>Poden sol·licitar les ajudes:</p>
<ul>
<li>Propietaris d'habitatges (individuals o en comunitat)</li>
<li>Comunitats de propietaris</li>
<li>Empreses i entitats que siguin propietàries d'edificis residencials</li>
<li>Administracions públiques i entitats de dret públic</li>
</ul>
<p>L'habitatge ha de ser la residència habitual o estar llogat com a habitatge habitual. Les segones residències també poden optar-hi en determinats programes.</p>

<h3>Requisits per accedir a les ajudes</h3>
<p>Per a la substitució de finestres, cal:</p>
<ul>
<li>Que les noves finestres tinguin un <strong>valor U inferior a 1.8 W/m²K</strong> (totes les finestres Cortizo de PVC ho compleixen).</li>
<li>Que es demostri una <strong>reducció mínima del 30%</strong> en la demanda de calefacció i refrigeració.</li>
<li>Obtenir un <strong>certificat d'eficiència energètica</strong> (CEE) abans i després de l'obra.</li>
<li>Que l'obra sigui realitzada per una empresa registrada (Ara Finestra està homologada).</li>
</ul>

<h3>Com tramitar la subvenció pas a pas</h3>
<p>El procés és més senzill del que sembla:</p>
<ul>
<li><strong>Pas 1:</strong> Contacta amb Ara Finestra per a un pressupost i estudi energètic previ.</li>
<li><strong>Pas 2:</strong> Obtenim el certificat energètic actual (CEE) del teu habitatge.</li>
<li><strong>Pas 3:</strong> Presentem la sol·licitud de subvenció a l'Agència de l'Habitatge de Catalunya.</li>
<li><strong>Pas 4:</strong> Un cop aprovada, realitzem la instal·lació de les finestres.</li>
<li><strong>Pas 5:</strong> Obtenim el nou CEE que demostra la millora energètica.</li>
<li><strong>Pas 6:</strong> Justifiquem l'obra i es rep la subvenció.</li>
</ul>

<h3>Quant pots estalviar amb subvencions?</h3>
<p>Exemple pràctic: una llar amb 6 finestres a Girona:</p>
<ul>
<li>Cost de les finestres de PVC Cortizo C-70: ~4.200€</li>
<li>Subvenció Next Generation (40%): -1.680€</li>
<li>Deducció IRPF (20%): -840€ addicionals</li>
<li><strong>Cost final net: ~1.680€</strong></li>
</ul>
<p>A més, l'estalvi energètic anual de 450-720€ fa que la inversió es recuperi en menys de 3 anys.</p>

<h3>Conclusió</h3>
<p>Les subvencions Next Generation fan que renovar les finestres sigui més assequible que mai. A Ara Finestra t'assessorem en tot el procés, des del pressupost fins a la tramitació de les ajudes. No deixis escapar aquesta oportunitat.</p>`,
    contenidoEs: `<h2>Aprovecha las ayudas europeas para renovar tus ventanas</h2>
<p>El programa <strong>Next Generation EU</strong> destina fondos significativos a la rehabilitación energética de edificios en España. Si estás pensando en cambiar las ventanas, este es el mejor momento: puedes obtener hasta el <strong>40-80% del coste subvencionado</strong> según la mejora energética conseguida.</p>

<h3>¿Qué ayudas están disponibles en 2026?</h3>
<p>Las principales líneas de subvención para ventanas en Cataluña son:</p>
<ul>
<li><strong>Programa 3 (edificios residenciales):</strong> hasta 6.300€ por vivienda para actuaciones en la envolvente térmica (incluye ventanas). Subvención del 40-80% según la reducción de energía primaria conseguida.</li>
<li><strong>Programa 4 (viviendas individuales):</strong> hasta 3.000€ por vivienda. Subvención del 40% con un mínimo de 30% de reducción en demanda de calefacción/refrigeración.</li>
<li><strong>Deducciones IRPF:</strong> deducción adicional del 20-60% en la declaración de la renta por obras de mejora energética, con una base máxima de 5.000-7.500€.</li>
</ul>

<h3>¿Quién puede solicitar las subvenciones?</h3>
<p>Pueden solicitar las ayudas:</p>
<ul>
<li>Propietarios de viviendas (individuales o en comunidad)</li>
<li>Comunidades de propietarios</li>
<li>Empresas y entidades propietarias de edificios residenciales</li>
<li>Administraciones públicas y entidades de derecho público</li>
</ul>
<p>La vivienda debe ser la residencia habitual o estar alquilada como vivienda habitual. Las segundas residencias también pueden optar en determinados programas.</p>

<h3>Requisitos para acceder a las ayudas</h3>
<p>Para la sustitución de ventanas se requiere:</p>
<ul>
<li>Que las nuevas ventanas tengan un <strong>valor U inferior a 1.8 W/m²K</strong> (todas las ventanas Cortizo de PVC lo cumplen).</li>
<li>Que se demuestre una <strong>reducción mínima del 30%</strong> en la demanda de calefacción y refrigeración.</li>
<li>Obtener un <strong>certificado de eficiencia energética</strong> (CEE) antes y después de la obra.</li>
<li>Que la obra sea realizada por una empresa registrada (Ara Finestra está homologada).</li>
</ul>

<h3>Cómo tramitar la subvención paso a paso</h3>
<p>El proceso es más sencillo de lo que parece:</p>
<ul>
<li><strong>Paso 1:</strong> Contacta con Ara Finestra para un presupuesto y estudio energético previo.</li>
<li><strong>Paso 2:</strong> Obtenemos el certificado energético actual (CEE) de tu vivienda.</li>
<li><strong>Paso 3:</strong> Presentamos la solicitud de subvención a la Agència de l'Habitatge de Catalunya.</li>
<li><strong>Paso 4:</strong> Una vez aprobada, realizamos la instalación de las ventanas.</li>
<li><strong>Paso 5:</strong> Obtenemos el nuevo CEE que demuestra la mejora energética.</li>
<li><strong>Paso 6:</strong> Justificamos la obra y se recibe la subvención.</li>
</ul>

<h3>¿Cuánto puedes ahorrar con subvenciones?</h3>
<p>Ejemplo práctico: un hogar con 6 ventanas en Girona:</p>
<ul>
<li>Coste de las ventanas de PVC Cortizo C-70: ~4.200€</li>
<li>Subvención Next Generation (40%): -1.680€</li>
<li>Deducción IRPF (20%): -840€ adicionales</li>
<li><strong>Coste final neto: ~1.680€</strong></li>
</ul>
<p>Además, el ahorro energético anual de 450-720€ hace que la inversión se recupere en menos de 3 años.</p>

<h3>Conclusión</h3>
<p>Las subvenciones Next Generation hacen que renovar las ventanas sea más asequible que nunca. En Ara Finestra te asesoramos en todo el proceso, desde el presupuesto hasta la tramitación de las ayudas. No dejes escapar esta oportunidad.</p>`,
    contenidoEn: `<h2>Take advantage of European grants to renovate your windows</h2>
<p>The <strong>Next Generation EU</strong> program allocates significant funds to the energy rehabilitation of buildings in Spain. If you're thinking about replacing your windows, now is the best time: you can get up to <strong>40-80% of the cost subsidized</strong> depending on the energy improvement achieved.</p>

<h3>What grants are available in 2026?</h3>
<p>The main subsidy lines for windows in Catalonia are:</p>
<ul>
<li><strong>Program 3 (residential buildings):</strong> up to €6,300 per dwelling for thermal envelope improvements (includes windows). Subsidy of 40-80% depending on the primary energy reduction achieved.</li>
<li><strong>Program 4 (individual dwellings):</strong> up to €3,000 per dwelling. 40% subsidy with a minimum 30% reduction in heating/cooling demand.</li>
<li><strong>Income tax deductions:</strong> additional 20-60% deduction on income tax for energy improvement works, with a maximum base of €5,000-7,500.</li>
</ul>

<h3>Who can apply for subsidies?</h3>
<p>The following can apply for grants:</p>
<ul>
<li>Homeowners (individual or in community)</li>
<li>Homeowner associations</li>
<li>Companies and entities that own residential buildings</li>
<li>Public administrations and public law entities</li>
</ul>
<p>The dwelling must be the primary residence or rented as a primary residence. Second homes may also qualify under certain programs.</p>

<h3>Requirements for accessing grants</h3>
<p>For window replacement, you need:</p>
<ul>
<li>New windows with a <strong>U-value below 1.8 W/m²K</strong> (all Cortizo PVC windows meet this).</li>
<li>Demonstrated <strong>minimum 30% reduction</strong> in heating and cooling demand.</li>
<li>An <strong>energy efficiency certificate</strong> (EPC) before and after the work.</li>
<li>The work must be carried out by a registered company (Ara Finestra is certified).</li>
</ul>

<h3>How to apply for the subsidy step by step</h3>
<p>The process is simpler than it seems:</p>
<ul>
<li><strong>Step 1:</strong> Contact Ara Finestra for a quote and preliminary energy study.</li>
<li><strong>Step 2:</strong> We obtain the current energy certificate (EPC) for your home.</li>
<li><strong>Step 3:</strong> We submit the subsidy application to the Catalan Housing Agency.</li>
<li><strong>Step 4:</strong> Once approved, we carry out the window installation.</li>
<li><strong>Step 5:</strong> We obtain the new EPC demonstrating the energy improvement.</li>
<li><strong>Step 6:</strong> We justify the work and you receive the subsidy.</li>
</ul>

<h3>How much can you save with subsidies?</h3>
<p>Practical example: a home with 6 windows in Girona:</p>
<ul>
<li>Cost of Cortizo C-70 PVC windows: ~€4,200</li>
<li>Next Generation subsidy (40%): -€1,680</li>
<li>Income tax deduction (20%): -€840 additional</li>
<li><strong>Net final cost: ~€1,680</strong></li>
</ul>
<p>Additionally, annual energy savings of €450-720 mean the investment pays for itself in less than 3 years.</p>

<h3>Conclusion</h3>
<p>Next Generation subsidies make window renovation more affordable than ever. At Ara Finestra, we guide you through the entire process, from the quote to the grant application. Don't miss this opportunity.</p>`,
    extractoCa: "Guia completa sobre les subvencions Next Generation 2026 per renovar finestres. Fins al 80% del cost subvencionat. Requisits, tramitació i estalvi real.",
    extractoEs: "Guía completa sobre las subvenciones Next Generation 2026 para renovar ventanas. Hasta el 80% del coste subvencionado. Requisitos, tramitación y ahorro real.",
    extractoEn: "Complete guide to Next Generation 2026 subsidies for window renovation. Up to 80% of the cost subsidized. Requirements, application process, and real savings.",
    categoria: "Subvencions",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Subvencions Next Generation finestres 2026 | Ara Finestra",
    metaTitleEs: "Subvenciones Next Generation ventanas 2026 | Ara Finestra",
    metaTitleEn: "Next Generation Window Subsidies 2026 | Ara Finestra",
    metaDescriptionCa: "Aconsegueix fins al 80% de subvenció per canviar finestres amb els fons Next Generation 2026. T'ajudem amb la tramitació a Catalunya.",
    metaDescriptionEs: "Consigue hasta el 80% de subvención para cambiar ventanas con los fondos Next Generation 2026. Te ayudamos con la tramitación en Cataluña.",
    metaDescriptionEn: "Get up to 80% subsidy to replace windows with Next Generation 2026 funds. We help with the application process in Catalonia.",
    published: true,
    publishedAt: new Date(),
  };

  await db.insert(blogPosts).values(blogData4).onConflictDoNothing({ target: blogPosts.slug });
  console.log("  Blog Post 4 OK");

  // ── Blog Post 5: Manteniment de finestres PVC ─────────────
  const blogData5 = {
    slug: "manteniment-finestres-pvc-consells",
    tituloCa: "Manteniment de finestres PVC: consells pràctics",
    tituloEs: "Mantenimiento de ventanas PVC: consejos prácticos",
    tituloEn: "PVC Window Maintenance: Practical Tips",
    contenidoCa: `<h2>Com mantenir les teves finestres de PVC en perfecte estat</h2>
<p>Un dels grans avantatges de les finestres de PVC és el seu <strong>baix manteniment</strong>. No necessiten pintura, no es corroen i no es deformen amb el temps. Tot i així, un manteniment bàsic periòdic allargarà la seva vida útil i mantindrà el seu rendiment òptim durant dècades.</p>

<h3>Neteja dels perfils de PVC</h3>
<p>Els perfils de PVC es netegen fàcilment amb materials que tens a casa:</p>
<ul>
<li><strong>Freqüència:</strong> cada 3-4 mesos, o més sovint en zones costaneres.</li>
<li><strong>Producte:</strong> aigua tèbia amb sabó neutre o rentavaixelles suau. Mai utilitzis dissolvents, acetona o productes abrasius.</li>
<li><strong>Mètode:</strong> utilitza un drap suau o esponja. Esbandeix amb aigua neta i asseca amb un drap sec.</li>
<li><strong>Taques difícils:</strong> per a taques persistents, utilitza un netejador específic per a PVC (disponible a la nostra botiga). Mai rasquis amb estris metàl·lics.</li>
</ul>

<h3>Cura dels vidres</h3>
<p>El vidre és la superfície més gran de la finestra i la que més es nota quan està bruta:</p>
<ul>
<li>Neteja els vidres amb netejacristalls comercial o una barreja d'aigua amb vinagre blanc.</li>
<li>Utilitza un drap de microfibra per evitar ratlles.</li>
<li>A l'exterior, una perxa telescòpica amb rasqueta facilita la feina en pisos alts.</li>
<li>El vidre baix emissiu es neteja igual que el vidre normal: la capa metàl·lica és a l'interior de la unitat segellada.</li>
</ul>

<h3>Manteniment de les ferramentes</h3>
<p>Les ferramentes (frontisses, mecanismes d'obertura, panys) són les parts mòbils de la finestra i necessiten atenció especial:</p>
<ul>
<li><strong>Lubrificació:</strong> aplica unes gotes d'oli de silicona o vaselina als punts de gir i tancament cada 6-12 mesos.</li>
<li><strong>Ajust de pressió:</strong> si notes que la finestra no tanca bé o passa aire, és possible que les ferramentes necessitin un ajust. Pots regular els cargols de les frontisses amb una clau Allen.</li>
<li><strong>Neteja:</strong> retira la pols i la brutícia de les ranures amb un pinzell o aspirador.</li>
</ul>

<h3>Revisió de les juntes d'estanqueïtat</h3>
<p>Les juntes de goma (EPDM) són essencials per a l'estanqueïtat de la finestra:</p>
<ul>
<li><strong>Inspecció visual:</strong> comprova les juntes cada any. Si estan aixafades, esquerdades o endures, cal substituir-les.</li>
<li><strong>Manteniment:</strong> aplica un producte revitalitzador de goma (silicona en esprai) un cop l'any per mantenir l'elasticitat.</li>
<li><strong>Substitució:</strong> les juntes tenen una vida útil de 10-15 anys. La seva substitució és econòmica i la podem fer a domicili.</li>
</ul>

<h3>Cura de les persianes</h3>
<p>Si les teves finestres inclouen persianes de PVC:</p>
<ul>
<li>Neteja les lames amb un drap humit cada 3 mesos.</li>
<li>No forcis la persiana si nota resistència: pot haver-hi una lama desalineada.</li>
<li>Lubrica les guies laterals amb silicona en esprai un cop l'any.</li>
<li>Si la cinta de la persiana està desgastada, substitueix-la abans que es trenqui del tot.</li>
</ul>

<h3>Manteniment estacional</h3>
<p>Cada estació requereix una atenció especial:</p>
<ul>
<li><strong>Primavera:</strong> neteja general de perfils, vidres i canals de drenatge. Comprova que els forats de drenatge no estiguin obstruïts.</li>
<li><strong>Estiu:</strong> ajusta les ferramentes a posició d'estiu (menys pressió de tancament) per no sobrecarregar les juntes.</li>
<li><strong>Tardor:</strong> revisa les juntes abans de l'hivern. Neteja les fulles caigudes dels canals.</li>
<li><strong>Hivern:</strong> ajusta les ferramentes a posició d'hivern (més pressió) per garantir l'estanqueïtat màxima.</li>
</ul>

<h3>Quan cal trucar a un professional?</h3>
<p>Contacta amb Ara Finestra si observes:</p>
<ul>
<li>Condensació entre els vidres (indica trencament del segellat)</li>
<li>Dificultat per obrir o tancar la finestra</li>
<li>Corrents d'aire malgrat tenir la finestra tancada</li>
<li>Sorolls o cruixits al manipular la finestra</li>
</ul>
<p>Oferim un servei de manteniment i reparació a domicili per a totes les marques de finestres de PVC.</p>`,
    contenidoEs: `<h2>Cómo mantener tus ventanas de PVC en perfecto estado</h2>
<p>Una de las grandes ventajas de las ventanas de PVC es su <strong>bajo mantenimiento</strong>. No necesitan pintura, no se corroen y no se deforman con el tiempo. Sin embargo, un mantenimiento básico periódico alargará su vida útil y mantendrá su rendimiento óptimo durante décadas.</p>

<h3>Limpieza de los perfiles de PVC</h3>
<p>Los perfiles de PVC se limpian fácilmente con materiales que tienes en casa:</p>
<ul>
<li><strong>Frecuencia:</strong> cada 3-4 meses, o más a menudo en zonas costeras.</li>
<li><strong>Producto:</strong> agua templada con jabón neutro o lavavajillas suave. Nunca uses disolventes, acetona ni productos abrasivos.</li>
<li><strong>Método:</strong> utiliza un paño suave o esponja. Aclara con agua limpia y seca con un paño seco.</li>
<li><strong>Manchas difíciles:</strong> para manchas persistentes, utiliza un limpiador específico para PVC (disponible en nuestra tienda). Nunca rasques con utensilios metálicos.</li>
</ul>

<h3>Cuidado de los vidrios</h3>
<p>El vidrio es la superficie más grande de la ventana y la que más se nota cuando está sucio:</p>
<ul>
<li>Limpia los vidrios con limpiacristales comercial o una mezcla de agua con vinagre blanco.</li>
<li>Utiliza un paño de microfibra para evitar rayas.</li>
<li>En el exterior, una pértiga telescópica con rasqueta facilita el trabajo en pisos altos.</li>
<li>El vidrio bajo emisivo se limpia igual que el vidrio normal: la capa metálica está en el interior de la unidad sellada.</li>
</ul>

<h3>Mantenimiento de los herrajes</h3>
<p>Los herrajes (bisagras, mecanismos de apertura, cerraduras) son las partes móviles de la ventana y necesitan atención especial:</p>
<ul>
<li><strong>Lubricación:</strong> aplica unas gotas de aceite de silicona o vaselina en los puntos de giro y cierre cada 6-12 meses.</li>
<li><strong>Ajuste de presión:</strong> si notas que la ventana no cierra bien o pasa aire, es posible que los herrajes necesiten un ajuste. Puedes regular los tornillos de las bisagras con una llave Allen.</li>
<li><strong>Limpieza:</strong> retira el polvo y la suciedad de las ranuras con un pincel o aspirador.</li>
</ul>

<h3>Revisión de las juntas de estanqueidad</h3>
<p>Las juntas de goma (EPDM) son esenciales para la estanqueidad de la ventana:</p>
<ul>
<li><strong>Inspección visual:</strong> comprueba las juntas cada año. Si están aplastadas, agrietadas o endurecidas, hay que sustituirlas.</li>
<li><strong>Mantenimiento:</strong> aplica un producto revitalizador de goma (silicona en spray) una vez al año para mantener la elasticidad.</li>
<li><strong>Sustitución:</strong> las juntas tienen una vida útil de 10-15 años. Su sustitución es económica y la podemos hacer a domicilio.</li>
</ul>

<h3>Cuidado de las persianas</h3>
<p>Si tus ventanas incluyen persianas de PVC:</p>
<ul>
<li>Limpia las lamas con un paño húmedo cada 3 meses.</li>
<li>No fuerces la persiana si nota resistencia: puede haber una lama desalineada.</li>
<li>Lubrica las guías laterales con silicona en spray una vez al año.</li>
<li>Si la cinta de la persiana está desgastada, sustitúyela antes de que se rompa del todo.</li>
</ul>

<h3>Mantenimiento estacional</h3>
<p>Cada estación requiere una atención especial:</p>
<ul>
<li><strong>Primavera:</strong> limpieza general de perfiles, vidrios y canales de drenaje. Comprueba que los agujeros de drenaje no estén obstruidos.</li>
<li><strong>Verano:</strong> ajusta los herrajes a posición de verano (menos presión de cierre) para no sobrecargar las juntas.</li>
<li><strong>Otoño:</strong> revisa las juntas antes del invierno. Limpia las hojas caídas de los canales.</li>
<li><strong>Invierno:</strong> ajusta los herrajes a posición de invierno (más presión) para garantizar la estanqueidad máxima.</li>
</ul>

<h3>¿Cuándo hay que llamar a un profesional?</h3>
<p>Contacta con Ara Finestra si observas:</p>
<ul>
<li>Condensación entre los vidrios (indica rotura del sellado)</li>
<li>Dificultad para abrir o cerrar la ventana</li>
<li>Corrientes de aire a pesar de tener la ventana cerrada</li>
<li>Ruidos o crujidos al manipular la ventana</li>
</ul>
<p>Ofrecemos un servicio de mantenimiento y reparación a domicilio para todas las marcas de ventanas de PVC.</p>`,
    contenidoEn: `<h2>How to keep your PVC windows in perfect condition</h2>
<p>One of the great advantages of PVC windows is their <strong>low maintenance</strong>. They don't need painting, they don't corrode, and they don't warp over time. However, basic periodic maintenance will extend their lifespan and keep them performing optimally for decades.</p>

<h3>Cleaning PVC profiles</h3>
<p>PVC profiles are easily cleaned with materials you have at home:</p>
<ul>
<li><strong>Frequency:</strong> every 3-4 months, or more often in coastal areas.</li>
<li><strong>Product:</strong> warm water with neutral soap or mild dish soap. Never use solvents, acetone, or abrasive products.</li>
<li><strong>Method:</strong> use a soft cloth or sponge. Rinse with clean water and dry with a dry cloth.</li>
<li><strong>Tough stains:</strong> for persistent stains, use a PVC-specific cleaner (available in our shop). Never scrape with metal tools.</li>
</ul>

<h3>Glass care</h3>
<p>Glass is the largest surface of the window and the most noticeable when dirty:</p>
<ul>
<li>Clean glass with commercial glass cleaner or a mixture of water and white vinegar.</li>
<li>Use a microfiber cloth to avoid streaks.</li>
<li>For exterior glass, a telescopic pole with squeegee makes the job easier on upper floors.</li>
<li>Low-emissivity glass is cleaned the same way as regular glass: the metallic coating is inside the sealed unit.</li>
</ul>

<h3>Hardware maintenance</h3>
<p>Hardware (hinges, opening mechanisms, locks) are the moving parts of the window and need special attention:</p>
<ul>
<li><strong>Lubrication:</strong> apply a few drops of silicone oil or petroleum jelly to pivot and locking points every 6-12 months.</li>
<li><strong>Pressure adjustment:</strong> if you notice the window doesn't close properly or drafts come through, the hardware may need adjustment. You can adjust the hinge screws with an Allen key.</li>
<li><strong>Cleaning:</strong> remove dust and dirt from grooves with a brush or vacuum cleaner.</li>
</ul>

<h3>Checking weatherseals</h3>
<p>Rubber gaskets (EPDM) are essential for the window's airtightness:</p>
<ul>
<li><strong>Visual inspection:</strong> check the seals every year. If they are flattened, cracked, or hardened, they need replacing.</li>
<li><strong>Maintenance:</strong> apply a rubber revitalizer (silicone spray) once a year to maintain elasticity.</li>
<li><strong>Replacement:</strong> seals have a lifespan of 10-15 years. Replacement is affordable and we can do it at your home.</li>
</ul>

<h3>Roller shutter care</h3>
<p>If your windows include PVC roller shutters:</p>
<ul>
<li>Clean the slats with a damp cloth every 3 months.</li>
<li>Don't force the shutter if you feel resistance: a slat may be misaligned.</li>
<li>Lubricate the side guides with silicone spray once a year.</li>
<li>If the shutter strap is worn, replace it before it breaks completely.</li>
</ul>

<h3>Seasonal maintenance</h3>
<p>Each season requires special attention:</p>
<ul>
<li><strong>Spring:</strong> general cleaning of profiles, glass, and drainage channels. Check that drainage holes are not blocked.</li>
<li><strong>Summer:</strong> adjust hardware to summer position (less closing pressure) to avoid overloading the seals.</li>
<li><strong>Autumn:</strong> inspect seals before winter. Clear fallen leaves from channels.</li>
<li><strong>Winter:</strong> adjust hardware to winter position (more pressure) to ensure maximum airtightness.</li>
</ul>

<h3>When to call a professional</h3>
<p>Contact Ara Finestra if you notice:</p>
<ul>
<li>Condensation between the glass panes (indicates seal failure)</li>
<li>Difficulty opening or closing the window</li>
<li>Drafts despite the window being closed</li>
<li>Noises or creaking when operating the window</li>
</ul>
<p>We offer a home maintenance and repair service for all brands of PVC windows.</p>`,
    extractoCa: "Consells pràctics per al manteniment de finestres de PVC: neteja, lubrificació de ferramentes, revisió de juntes i cura estacional per allargar la vida útil.",
    extractoEs: "Consejos prácticos para el mantenimiento de ventanas de PVC: limpieza, lubricación de herrajes, revisión de juntas y cuidado estacional para alargar la vida útil.",
    extractoEn: "Practical tips for PVC window maintenance: cleaning, hardware lubrication, seal inspection, and seasonal care to extend their lifespan.",
    categoria: "Manteniment",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Manteniment de finestres PVC: consells pràctics | Ara Finestra",
    metaTitleEs: "Mantenimiento de ventanas PVC: consejos prácticos | Ara Finestra",
    metaTitleEn: "PVC Window Maintenance: Practical Tips | Ara Finestra",
    metaDescriptionCa: "Com mantenir les finestres de PVC: neteja, ferramentes, juntes i cura estacional. Guia completa per allargar la vida útil de les teves finestres.",
    metaDescriptionEs: "Cómo mantener las ventanas de PVC: limpieza, herrajes, juntas y cuidado estacional. Guía completa para alargar la vida útil de tus ventanas.",
    metaDescriptionEn: "How to maintain PVC windows: cleaning, hardware, seals, and seasonal care. Complete guide to extending your window lifespan.",
    published: true,
    publishedAt: new Date(),
  };

  await db.insert(blogPosts).values(blogData5).onConflictDoNothing({ target: blogPosts.slug });
  console.log("  Blog Post 5 OK");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
