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

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
