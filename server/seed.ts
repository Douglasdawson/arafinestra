import bcrypt from "bcryptjs";
import { db } from "./db.js";
import {
  users,
  zones,
  products,
  siteConfig,
  testimonials,
  blogPosts,
  portfolio,
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
      contenidoCa: "Blanes, la porta de la Costa Brava, gaudeix d'un clima mediterrani costaner amb hiverns suaus i estius calorosos, però la seva ubicació l'exposa directament a la sal marina i a la humitat constant del litoral. A l'estiu, el turisme estacional genera un nivell de soroll important, especialment a les zones properes al passeig marítim de S'Abanell i al centre comercial. Les finestres de PVC Cortizo ofereixen un aïllament tèrmic i acústic superior, essencial per mantenir el confort tant a l'hivern com durant els mesos d'alta ocupació turística.\n\nEl parc d'habitatges de Blanes és divers: des dels edificis del casc antic prop del port, fins als blocs dels anys 70-80 a la zona de l'Estació i les urbanitzacions més noves cap a Pinya de Rosa i els Pins. En cadascun d'aquests entorns, les necessitats són diferents. Als pisos antics del centre, prioritzem la substitució de finestres d'alumini sense ruptura de pont tèrmic per perfils Cortizo de 70 mm amb vidre baix emissiu. A les urbanitzacions costaneres, instal·lem acabats resistents a la corrosió salina amb garantia de durabilitat.\n\nBlanes se situa en zona climàtica C2 segons el Codi Tècnic de l'Edificació, on el canvi a finestres de PVC amb doble vidre baix emissiu pot suposar fins a un 35% d'estalvi en climatització. Hem completat més de 120 projectes a Blanes i rodalies, incloent comunitats de veïns al barri de la Plantera, xalets a la zona de Santa Bàrbara i apartaments turístics al front marítim. Cada instal·lació inclou mesura personalitzada, retirada de les finestres antigues i acabat net en un sol dia per finestra.",
      contenidoEs: "Blanes, la puerta de la Costa Brava, disfruta de un clima mediterráneo costero con inviernos suaves y veranos calurosos, pero su ubicación la expone directamente a la sal marina y a la humedad constante del litoral. En verano, el turismo estacional genera un nivel de ruido importante, especialmente en las zonas cercanas al paseo marítimo de S'Abanell y al centro comercial. Las ventanas de PVC Cortizo ofrecen un aislamiento térmico y acústico superior, esencial para mantener el confort tanto en invierno como durante los meses de alta ocupación turística.\n\nEl parque de viviendas de Blanes es diverso: desde los edificios del casco antiguo cerca del puerto, hasta los bloques de los años 70-80 en la zona de la Estación y las urbanizaciones más nuevas hacia Pinya de Rosa y los Pins. En cada uno de estos entornos, las necesidades son diferentes. En los pisos antiguos del centro, priorizamos la sustitución de ventanas de aluminio sin rotura de puente térmico por perfiles Cortizo de 70 mm con vidrio bajo emisivo. En las urbanizaciones costeras, instalamos acabados resistentes a la corrosión salina con garantía de durabilidad.\n\nBlanes se sitúa en zona climática C2 según el Código Técnico de la Edificación, donde el cambio a ventanas de PVC con doble vidrio bajo emisivo puede suponer hasta un 35% de ahorro en climatización. Hemos completado más de 120 proyectos en Blanes y alrededores, incluyendo comunidades de vecinos en el barrio de la Plantera, chalets en la zona de Santa Bárbara y apartamentos turísticos en el frente marítimo. Cada instalación incluye medición personalizada, retirada de las ventanas antiguas y acabado limpio en un solo día por ventana.",
      contenidoEn: "Blanes, the gateway to the Costa Brava, enjoys a coastal Mediterranean climate with mild winters and hot summers, but its location exposes it directly to sea salt and constant shoreline humidity. In summer, seasonal tourism generates significant noise levels, especially in areas near the S'Abanell promenade and the commercial center. Cortizo PVC windows provide superior thermal and acoustic insulation, essential for maintaining comfort both in winter and during the high tourist season months.\n\nThe housing stock in Blanes is diverse: from old town buildings near the port, to 70s-80s apartment blocks in the Estacio area, and newer developments toward Pinya de Rosa and els Pins. Each of these environments has different requirements. In older city center apartments, we prioritize replacing aluminum windows without thermal break with 70 mm Cortizo profiles and low-emissivity glass. In coastal developments, we install salt corrosion-resistant finishes with a durability guarantee.\n\nBlanes falls within climate zone C2 under Spanish building regulations (CTE), where switching to PVC windows with double low-emissivity glazing can deliver up to 35% savings on heating and cooling. We have completed over 120 projects in Blanes and the surrounding area, including homeowner associations in the Plantera neighborhood, villas in the Santa Barbara area, and tourist apartments on the seafront. Every installation includes custom measurement, removal of old windows, and a clean finish in a single day per window.",
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
      contenidoCa: "Lloret de Mar, un dels destins turístics més importants de la Costa Brava, presenta unes condicions ambientals exigents per a qualsevol fusteria exterior. La combinació de sal marina, humitat elevada i el soroll constant del turisme estacional fa que les finestres de PVC Cortizo siguin la solució més adequada per als habitatges de la zona. A diferència de l'alumini, el PVC no es corroeix amb la salinitat i manté les seves propietats d'aïllament durant dècades.\n\nEl nucli urbà de Lloret presenta una tipologia edificatòria variada: els blocs d'apartaments turístics de primera línia de mar, els edificis residencials dels anys 60-80 al centre i a la zona de Fenals, i les urbanitzacions de xalets a les àrees de Canyelles, Santa Clotilde i Lloret Residencial. Per als apartaments turístics, l'aïllament acústic és fonamental, ja que el soroll nocturn a l'estiu pot superar els 65 dB. Les nostres finestres Cortizo amb vidre acústic redueixen fins a 42 dB la transmissió sonora.\n\nLloret se situa en zona climàtica C2 del CTE, amb necessitats tant de refrigeració a l'estiu com de calefacció a l'hivern. El canvi a finestres de PVC amb doble vidre baix emissiu pot generar un estalvi energètic de fins al 35% en climatització anual. Hem completat més de 90 projectes a Lloret, treballant tant amb comunitats de veïns de grans blocs com amb propietaris de xalets individuals. Oferim solucions específiques per a cada tipologia, amb acabats que resisteixen l'ambient salí i una instal·lació neta que es realitza habitualment en un sol dia per finestra.",
      contenidoEs: "Lloret de Mar, uno de los destinos turísticos más importantes de la Costa Brava, presenta unas condiciones ambientales exigentes para cualquier carpintería exterior. La combinación de sal marina, humedad elevada y el ruido constante del turismo estacional hace que las ventanas de PVC Cortizo sean la solución más adecuada para las viviendas de la zona. A diferencia del aluminio, el PVC no se corroe con la salinidad y mantiene sus propiedades de aislamiento durante décadas.\n\nEl núcleo urbano de Lloret presenta una tipología edificatoria variada: los bloques de apartamentos turísticos de primera línea de mar, los edificios residenciales de los años 60-80 en el centro y en la zona de Fenals, y las urbanizaciones de chalets en las áreas de Canyelles, Santa Clotilde y Lloret Residencial. Para los apartamentos turísticos, el aislamiento acústico es fundamental, ya que el ruido nocturno en verano puede superar los 65 dB. Nuestras ventanas Cortizo con vidrio acústico reducen hasta 42 dB la transmisión sonora.\n\nLloret se sitúa en zona climática C2 del CTE, con necesidades tanto de refrigeración en verano como de calefacción en invierno. El cambio a ventanas de PVC con doble vidrio bajo emisivo puede generar un ahorro energético de hasta el 35% en climatización anual. Hemos completado más de 90 proyectos en Lloret, trabajando tanto con comunidades de vecinos de grandes bloques como con propietarios de chalets individuales. Ofrecemos soluciones específicas para cada tipología, con acabados que resisten el ambiente salino y una instalación limpia que se realiza habitualmente en un solo día por ventana.",
      contenidoEn: "Lloret de Mar, one of the most important tourist destinations on the Costa Brava, presents demanding environmental conditions for any exterior joinery. The combination of sea salt, high humidity, and constant noise from seasonal tourism makes Cortizo PVC windows the most suitable solution for homes in the area. Unlike aluminum, PVC does not corrode from salinity and maintains its insulation properties for decades.\n\nThe urban core of Lloret features varied building typologies: seafront tourist apartment blocks, residential buildings from the 60s-80s in the center and Fenals area, and villa developments in Canyelles, Santa Clotilde, and Lloret Residencial. For tourist apartments, acoustic insulation is critical, as summer nighttime noise can exceed 65 dB. Our Cortizo windows with acoustic glass reduce sound transmission by up to 42 dB.\n\nLloret falls within climate zone C2 under Spanish building regulations (CTE), with both summer cooling and winter heating needs. Switching to PVC windows with double low-emissivity glazing can generate energy savings of up to 35% on annual climate control costs. We have completed over 90 projects in Lloret, working with both large block homeowner associations and individual villa owners. We offer specific solutions for each building type, with finishes that withstand the salt-laden environment and a clean installation typically completed in a single day per window.",
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
      contenidoCa: "Tossa de Mar, amb la seva icònica Vila Vella i el seu encantador casc antic emmurallat, és un dels municipis amb més caràcter arquitectònic de la Costa Brava. La proximitat al mar exposa els habitatges a la sal marina i a la humitat constant, mentre que el turisme estacional genera soroll significatiu durant els mesos d'estiu, especialment a la zona de la platja Gran i el passeig del Mar. Les finestres de PVC Cortizo ofereixen la combinació perfecta d'estètica respectuosa amb l'entorn i rendiment tècnic superior.\n\nLa tipologia edificatòria de Tossa és molt particular. Al casc antic i les zones properes a la Vila Vella, trobem cases de pedra centenàries que requereixen finestres amb acabats en fusta que s'integrin amb la normativa de protecció del patrimoni. Els nostres perfils Cortizo amb laminat de fusta de roure o noguer aconsegueixen un aspecte traditional amb les prestacions del PVC modern. Als barris d'expansió com Can Magí, la Barraca i les urbanitzacions de la carretera de Sant Feliu, els edificis dels anys 70-80 necessiten una renovació integral de fusteria.\n\nTossa se situa en zona climàtica C2 del CTE, i el canvi de finestres antigues a PVC amb doble vidre baix emissiu pot representar un estalvi de fins al 35% en la factura energètica. Per als habitatges exposats directament al mar, recomanem perfils amb tractament anticorrosió i ferratges d'acer inoxidable. Hem completat més de 60 projectes a Tossa, incloent rehabilitacions en edificis del casc antic, xalets amb vistes al mar i apartaments turístics. Cada projecte inclou assessorament sobre la normativa estètica local, mesura in situ i instal·lació professional amb retirada dels materials antics.",
      contenidoEs: "Tossa de Mar, con su icónica Vila Vella y su encantador casco antiguo amurallado, es uno de los municipios con más carácter arquitectónico de la Costa Brava. La proximidad al mar expone las viviendas a la sal marina y a la humedad constante, mientras que el turismo estacional genera ruido significativo durante los meses de verano, especialmente en la zona de la playa Gran y el paseo del Mar. Las ventanas de PVC Cortizo ofrecen la combinación perfecta de estética respetuosa con el entorno y rendimiento técnico superior.\n\nLa tipología edificatoria de Tossa es muy particular. En el casco antiguo y las zonas cercanas a la Vila Vella, encontramos casas de piedra centenarias que requieren ventanas con acabados en madera que se integren con la normativa de protección del patrimonio. Nuestros perfiles Cortizo con laminado de madera de roble o nogal consiguen un aspecto tradicional con las prestaciones del PVC moderno. En los barrios de expansión como Can Magí, la Barraca y las urbanizaciones de la carretera de Sant Feliu, los edificios de los años 70-80 necesitan una renovación integral de carpintería.\n\nTossa se sitúa en zona climática C2 del CTE, y el cambio de ventanas antiguas a PVC con doble vidrio bajo emisivo puede representar un ahorro de hasta el 35% en la factura energética. Para las viviendas expuestas directamente al mar, recomendamos perfiles con tratamiento anticorrosión y herrajes de acero inoxidable. Hemos completado más de 60 proyectos en Tossa, incluyendo rehabilitaciones en edificios del casco antiguo, chalets con vistas al mar y apartamentos turísticos. Cada proyecto incluye asesoramiento sobre la normativa estética local, medición in situ e instalación profesional con retirada de los materiales antiguos.",
      contenidoEn: "Tossa de Mar, with its iconic Vila Vella and charming walled old town, is one of the municipalities with the most architectural character on the Costa Brava. Proximity to the sea exposes homes to marine salt and constant humidity, while seasonal tourism generates significant noise during the summer months, especially around the Gran beach and the seafront promenade. Cortizo PVC windows offer the perfect combination of aesthetics that respect the surroundings and superior technical performance.\n\nTossa's building typology is quite distinctive. In the old town and areas near the Vila Vella, we find centuries-old stone houses that require windows with wood finishes that comply with heritage protection regulations. Our Cortizo profiles with oak or walnut wood laminate achieve a traditional appearance with the performance of modern PVC. In the expansion neighborhoods such as Can Magi, la Barraca, and the developments along the Sant Feliu road, buildings from the 70s-80s need comprehensive window renovation.\n\nTossa falls within climate zone C2 under Spanish building regulations (CTE), and replacing old windows with PVC and double low-emissivity glazing can represent savings of up to 35% on energy bills. For homes directly exposed to the sea, we recommend profiles with anti-corrosion treatment and stainless steel hardware. We have completed over 60 projects in Tossa, including rehabilitations in old town buildings, sea-view villas, and tourist apartments. Every project includes advice on local aesthetic regulations, on-site measurement, and professional installation with removal of old materials.",
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
      contenidoCa: "Girona, capital de província, té un clima continental mediterrani amb hiverns freds marcats per la influència de la tramuntana i estius calorosos. La ciutat se situa en zona climàtica D1 segons el Codi Tècnic de l'Edificació, una de les més exigents de Catalunya en termes d'aïllament tèrmic obligatori. Això fa que la qualitat de les finestres sigui un factor determinant en el consum energètic dels habitatges gironins. Les finestres de PVC Cortizo amb vidre baix emissiu compleixen sobradament els requisits del CTE i poden generar un estalvi de fins al 40% en calefacció.\n\nGirona presenta una gran diversitat arquitectònica. El Barri Vell, amb els seus edificis medievals al llarg del riu Onyar, requereix finestres amb acabats que respectin el patrimoni històric; els nostres perfils amb laminat de fusta s'integren perfectament amb les façanes de colors del riu. Al sector de l'Eixample i Sant Narcís, els blocs residencials dels anys 60-80 necessiten urgentment una renovació de fusteria per millorar l'eficiència energètica. Les zones de Montjuïc, Palau, Vila-roja i les urbanitzacions noves de Domeny i Taialà presenten necessitats específiques d'aïllament acústic per la proximitat a vies de comunicació.\n\nLa tramuntana, que pot bufar amb ratxes superiors als 100 km/h, posa a prova l'estanqueïtat de qualsevol finestra. Els perfils Cortizo amb classificació d'estanqueïtat E1200 i permeabilitat a l'aire de classe 4 garanteixen protecció total contra el vent. Hem completat més de 200 projectes a Girona, des de pisos al centre històric fins a grans comunitats de veïns a Santa Eugènia i Can Gibert del Pla. Treballem amb comunitats, particulars i constructores, oferint pressupostos detallats i finançament flexible per a projectes de totes les dimensions.",
      contenidoEs: "Girona, capital de provincia, tiene un clima continental mediterráneo con inviernos fríos marcados por la influencia de la tramontana y veranos calurosos. La ciudad se sitúa en zona climática D1 según el Código Técnico de la Edificación, una de las más exigentes de Cataluña en términos de aislamiento térmico obligatorio. Esto hace que la calidad de las ventanas sea un factor determinante en el consumo energético de las viviendas gerundenses. Las ventanas de PVC Cortizo con vidrio bajo emisivo cumplen sobradamente los requisitos del CTE y pueden generar un ahorro de hasta el 40% en calefacción.\n\nGirona presenta una gran diversidad arquitectónica. El Barri Vell, con sus edificios medievales a lo largo del río Onyar, requiere ventanas con acabados que respeten el patrimonio histórico; nuestros perfiles con laminado de madera se integran perfectamente con las fachadas de colores del río. En el sector del Eixample y Sant Narcís, los bloques residenciales de los años 60-80 necesitan urgentemente una renovación de carpintería para mejorar la eficiencia energética. Las zonas de Montjuïc, Palau, Vila-roja y las urbanizaciones nuevas de Domeny y Taialà presentan necesidades específicas de aislamiento acústico por la proximidad a vías de comunicación.\n\nLa tramontana, que puede soplar con rachas superiores a los 100 km/h, pone a prueba la estanqueidad de cualquier ventana. Los perfiles Cortizo con clasificación de estanqueidad E1200 y permeabilidad al aire de clase 4 garantizan protección total contra el viento. Hemos completado más de 200 proyectos en Girona, desde pisos en el centro histórico hasta grandes comunidades de vecinos en Santa Eugènia y Can Gibert del Pla. Trabajamos con comunidades, particulares y constructoras, ofreciendo presupuestos detallados y financiación flexible para proyectos de todas las dimensiones.",
      contenidoEn: "Girona, the provincial capital, has a continental Mediterranean climate with cold winters shaped by the tramontana wind and hot summers. The city falls within climate zone D1 under Spanish building regulations (CTE), one of the most demanding in Catalonia for mandatory thermal insulation. This makes window quality a decisive factor in the energy consumption of Girona homes. Cortizo PVC windows with low-emissivity glass comfortably exceed CTE requirements and can generate savings of up to 40% on heating costs.\n\nGirona features great architectural diversity. The Barri Vell (Old Quarter), with its medieval buildings along the Onyar River, requires windows with finishes that respect the historical heritage; our profiles with wood laminate integrate seamlessly with the river's colorful facades. In the Eixample and Sant Narcis sectors, residential blocks from the 60s-80s urgently need window renovation to improve energy efficiency. The Montjuic, Palau, Vila-roja areas and the newer developments in Domeny and Taiala have specific acoustic insulation needs due to proximity to transport routes.\n\nThe tramontana, which can gust at over 100 km/h, tests the airtightness of any window. Cortizo profiles with E1200 watertightness classification and class 4 air permeability guarantee total wind protection. We have completed over 200 projects in Girona, from apartments in the historic center to large homeowner associations in Santa Eugenia and Can Gibert del Pla. We work with communities, individuals, and construction companies, offering detailed quotes and flexible financing for projects of all sizes.",
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
      contenidoCa: "Figueres, la capital de l'Alt Empordà, és una de les ciutats més castigades per la tramuntana a tot Catalunya. Aquest vent del nord, que pot superar els 120 km/h en les ratxes més fortes, converteix l'aïllament de les finestres en una prioritat absoluta per al confort dels habitatges. Figueres se situa en zona climàtica D1 del Codi Tècnic de l'Edificació, amb hiverns freds i secs que exigeixen el màxim nivell d'aïllament tèrmic. Les finestres de PVC Cortizo amb triple vidre i cambra d'argó ofereixen la millor protecció disponible al mercat.\n\nLa tipologia urbana de Figueres és variada. El centre històric, al voltant de la Rambla i el Museu Dalí, presenta edificis antics amb finestres de fusta deteriorades que necessiten substitució. Al barri de la Marca de l'Ham, l'Eixample i les zones de Sant Pau i la Creu de la Mà, predominen els blocs de pisos dels anys 60-80 amb finestres d'alumini sense ruptura de pont tèrmic, que són autèntiques fonts de pèrdua energètica. Les urbanitzacions més noves al sector nord i a Vilatenim ofereixen l'oportunitat d'instal·lar finestres d'alta gamma des de l'inici.\n\nAmb la tramuntana, l'estanqueïtat és fonamental. Els perfils Cortizo de la sèrie C-70 i E-170 ofereixen una classificació d'estanqueïtat a l'aigua E1200-E1500 i permeabilitat a l'aire de classe 4, les més altes del mercat. El canvi a finestres de PVC amb triple vidre a Figueres pot suposar un estalvi de fins al 45% en calefacció, ja que les pèrdues per les finestres representen fins al 30% del total de pèrdues energètiques d'un habitatge. Hem completat més de 80 projectes a Figueres i pobles propers com Vilafant i el Far d'Empordà, treballant amb comunitats de veïns, particulars i promotores. Oferim assessorament personalitzat per escollir la millor solució segons l'orientació i l'exposició al vent de cada habitatge.",
      contenidoEs: "Figueres, la capital del Alt Empordà, es una de las ciudades más castigadas por la tramontana en toda Cataluña. Este viento del norte, que puede superar los 120 km/h en las rachas más fuertes, convierte el aislamiento de las ventanas en una prioridad absoluta para el confort de las viviendas. Figueres se sitúa en zona climática D1 del Código Técnico de la Edificación, con inviernos fríos y secos que exigen el máximo nivel de aislamiento térmico. Las ventanas de PVC Cortizo con triple vidrio y cámara de argón ofrecen la mejor protección disponible en el mercado.\n\nLa tipología urbana de Figueres es variada. El centro histórico, en torno a la Rambla y el Museo Dalí, presenta edificios antiguos con ventanas de madera deterioradas que necesitan sustitución. En el barrio de la Marca de l'Ham, el Eixample y las zonas de Sant Pau y la Creu de la Mà, predominan los bloques de pisos de los años 60-80 con ventanas de aluminio sin rotura de puente térmico, que son auténticas fuentes de pérdida energética. Las urbanizaciones más nuevas en el sector norte y en Vilatenim ofrecen la oportunidad de instalar ventanas de alta gama desde el inicio.\n\nCon la tramontana, la estanqueidad es fundamental. Los perfiles Cortizo de la serie C-70 y E-170 ofrecen una clasificación de estanqueidad al agua E1200-E1500 y permeabilidad al aire de clase 4, las más altas del mercado. El cambio a ventanas de PVC con triple vidrio en Figueres puede suponer un ahorro de hasta el 45% en calefacción, ya que las pérdidas por las ventanas representan hasta el 30% del total de pérdidas energéticas de una vivienda. Hemos completado más de 80 proyectos en Figueres y pueblos cercanos como Vilafant y el Far d'Empordà, trabajando con comunidades de vecinos, particulares y promotoras. Ofrecemos asesoramiento personalizado para elegir la mejor solución según la orientación y la exposición al viento de cada vivienda.",
      contenidoEn: "Figueres, the capital of Alt Emporda, is one of the cities most affected by the tramontana in all of Catalonia. This northerly wind, which can exceed 120 km/h in the strongest gusts, makes window insulation an absolute priority for home comfort. Figueres falls within climate zone D1 under Spanish building regulations (CTE), with cold, dry winters that demand the highest level of thermal insulation. Cortizo PVC windows with triple glazing and argon-filled chambers offer the best protection available on the market.\n\nThe urban typology of Figueres is varied. The historic center, around the Rambla and the Dali Museum, features old buildings with deteriorated wooden windows that need replacement. In the Marca de l'Ham neighborhood, the Eixample, and the Sant Pau and Creu de la Ma areas, 60s-80s apartment blocks with aluminum windows lacking thermal break predominate, acting as significant sources of energy loss. Newer developments in the northern sector and Vilatenim offer the opportunity to install high-end windows from the start.\n\nWith the tramontana, airtightness is essential. Cortizo C-70 and E-170 series profiles offer E1200-E1500 water tightness classification and class 4 air permeability, the highest on the market. Switching to PVC windows with triple glazing in Figueres can deliver savings of up to 45% on heating, as window losses account for up to 30% of a home's total energy losses. We have completed over 80 projects in Figueres and nearby towns such as Vilafant and el Far d'Emporda, working with homeowner associations, individuals, and developers. We offer personalized advice to choose the best solution based on each home's orientation and wind exposure.",
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
      contenidoCa: "Mataró, capital del Maresme, és una ciutat de transició entre la costa i l'interior que combina la brisa marina amb les necessitats d'aïllament d'una gran ciutat. Amb més de 130.000 habitants, és el nucli urbà més important de la comarca i presenta una gran diversitat d'habitatges amb necessitats molt específiques. La zona costanera, des del port fins a la platja de Sant Simó, rep l'impacte de la humitat salina, mentre que els barris interiors com Cerdanyola, Rocafonda i Vista Alegre estan més exposats al soroll del trànsit de la N-II, l'autopista C-32 i la línia de tren de Rodalies.\n\nLa tipologia edificatòria de Mataró és molt variada. El centre històric, amb els seus edificis modernistes i cases antigues al voltant de la Riera i el carrer de Barcelona, requereix finestres amb acabats que respectin l'estètica patrimonial. Els grans blocs de pisos dels anys 60-80 als barris de Peramàs, Rocafonda i el Palau són els que més urgentment necessiten renovació de fusteria, ja que les seves finestres d'alumini originals provoquen condensacions i pèrdues tèrmiques enormes. Les urbanitzacions noves cap a Valldeix i la zona alta ofereixen opcions per a instal·lacions d'alta gamma.\n\nMataró se situa en zona climàtica C2 del CTE, amb hiverns moderats però estius calorosos que fan necessari un bon aïllament tèrmic en ambdues direccions. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot suposar un estalvi de fins al 35% en climatització. Per als habitatges propers a la N-II i la via del tren, el nostre vidre acústic 44.2 redueix la transmissió sonora fins a 42 dB. Hem completat més de 150 projectes a Mataró, incloent grans comunitats de veïns al barri de l'Havana, xalets a les Cinc Sènies i rehabilitacions al centre. Oferim pressupostos sense compromís i finançament adaptat a comunitats de propietaris.",
      contenidoEs: "Mataró, capital del Maresme, es una ciudad de transición entre la costa y el interior que combina la brisa marina con las necesidades de aislamiento de una gran ciudad. Con más de 130.000 habitantes, es el núcleo urbano más importante de la comarca y presenta una gran diversidad de viviendas con necesidades muy específicas. La zona costera, desde el puerto hasta la playa de Sant Simó, recibe el impacto de la humedad salina, mientras que los barrios interiores como Cerdanyola, Rocafonda y Vista Alegre están más expuestos al ruido del tráfico de la N-II, la autopista C-32 y la línea de tren de Cercanías.\n\nLa tipología edificatoria de Mataró es muy variada. El centro histórico, con sus edificios modernistas y casas antiguas en torno a la Riera y la calle de Barcelona, requiere ventanas con acabados que respeten la estética patrimonial. Los grandes bloques de pisos de los años 60-80 en los barrios de Peramàs, Rocafonda y el Palau son los que más urgentemente necesitan renovación de carpintería, ya que sus ventanas de aluminio originales provocan condensaciones y pérdidas térmicas enormes. Las urbanizaciones nuevas hacia Valldeix y la zona alta ofrecen opciones para instalaciones de alta gama.\n\nMataró se sitúa en zona climática C2 del CTE, con inviernos moderados pero veranos calurosos que hacen necesario un buen aislamiento térmico en ambas direcciones. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede suponer un ahorro de hasta el 35% en climatización. Para las viviendas cercanas a la N-II y la vía del tren, nuestro vidrio acústico 44.2 reduce la transmisión sonora hasta 42 dB. Hemos completado más de 150 proyectos en Mataró, incluyendo grandes comunidades de vecinos en el barrio de l'Havana, chalets en les Cinc Sènies y rehabilitaciones en el centro. Ofrecemos presupuestos sin compromiso y financiación adaptada a comunidades de propietarios.",
      contenidoEn: "Mataro, capital of the Maresme, is a transitional city between the coast and the interior that combines sea breezes with the insulation needs of a major urban center. With over 130,000 inhabitants, it is the most important urban hub in the region and features a wide diversity of housing with very specific requirements. The coastal zone, from the port to Sant Simo beach, receives the impact of salt humidity, while inland neighborhoods such as Cerdanyola, Rocafonda, and Vista Alegre are more exposed to traffic noise from the N-II highway, the C-32 motorway, and the commuter train line.\n\nMataro's building typology is highly varied. The historic center, with its Art Nouveau buildings and old houses around the Riera and Barcelona Street, requires windows with finishes that respect the heritage aesthetics. The large apartment blocks from the 60s-80s in the Peramas, Rocafonda, and Palau neighborhoods most urgently need window renovation, as their original aluminum windows cause condensation and enormous thermal losses. Newer developments toward Valldeix and the upper area offer options for high-end installations.\n\nMataro falls within climate zone C2 under Spanish building regulations (CTE), with moderate winters but hot summers requiring good thermal insulation in both directions. Switching to Cortizo PVC windows with double low-emissivity glazing can deliver savings of up to 35% on climate control. For homes near the N-II and the train line, our 44.2 acoustic glass reduces sound transmission by up to 42 dB. We have completed over 150 projects in Mataro, including large homeowner associations in the Havana neighborhood, villas in les Cinc Senies, and rehabilitations in the center. We offer no-obligation quotes and financing tailored to property owner communities.",
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
      contenidoCa: "Calella, la capital turística del Maresme nord, és una vila costanera amb un parc d'habitatges extens que necessita urgentment renovació energètica. La seva ubicació entre el mar i les muntanyes del Montnegre li confereix un microclima particular, amb la brisa marina constant i una humitat relativa elevada que accelera el deteriorament de les finestres antigues d'alumini i fusta. A més, la línia de tren de Rodalies que travessa el nucli urbà i la carretera N-II generen un nivell de soroll significatiu que afecta especialment els habitatges del centre i la zona de la platja.\n\nLa tipologia edificatòria de Calella és molt representativa del Maresme: el nucli antic al voltant de l'Església de Santa Maria i el carrer de l'Església, amb cases de poble tradicionals; els blocs d'apartaments dels anys 60-80 que van créixer amb el boom turístic, especialment al passeig de les Roques, el carrer d'Anníbal i la zona del Parc Dalmau; i les urbanitzacions residencials més noves cap a la zona de Vallalta i el Poblenou. Cadascuna d'aquestes tipologies requereix solucions específiques de fusteria.\n\nCalella se situa en zona climàtica C2 del CTE, amb estius calorosos i hiverns moderats. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot suposar un estalvi de fins al 35% en la factura de climatització. Per als habitatges propers al tren, recomanem vidre acústic laminar que redueix la transmissió sonora fins a 42 dB. Hem completat més de 70 projectes a Calella, incloent comunitats de veïns al front marítim, habitatges unifamiliars a la zona residencial i rehabilitacions d'edificis antics al centre. Cada instal·lació inclou mesura personalitzada, assessorament sobre el millor vidre segons l'orientació i la retirada neta de les finestres antigues.",
      contenidoEs: "Calella, la capital turística del Maresme norte, es una villa costera con un parque de viviendas extenso que necesita urgentemente renovación energética. Su ubicación entre el mar y las montañas del Montnegre le confiere un microclima particular, con la brisa marina constante y una humedad relativa elevada que acelera el deterioro de las ventanas antiguas de aluminio y madera. Además, la línea de tren de Cercanías que atraviesa el núcleo urbano y la carretera N-II generan un nivel de ruido significativo que afecta especialmente a las viviendas del centro y la zona de la playa.\n\nLa tipología edificatoria de Calella es muy representativa del Maresme: el núcleo antiguo en torno a la Iglesia de Santa Maria y la calle de la Iglesia, con casas de pueblo tradicionales; los bloques de apartamentos de los años 60-80 que crecieron con el boom turístico, especialmente en el paseo de les Roques, la calle de Aníbal y la zona del Parc Dalmau; y las urbanizaciones residenciales más nuevas hacia la zona de Vallalta y el Poblenou. Cada una de estas tipologías requiere soluciones específicas de carpintería.\n\nCalella se sitúa en zona climática C2 del CTE, con veranos calurosos e inviernos moderados. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede suponer un ahorro de hasta el 35% en la factura de climatización. Para las viviendas cercanas al tren, recomendamos vidrio acústico laminar que reduce la transmisión sonora hasta 42 dB. Hemos completado más de 70 proyectos en Calella, incluyendo comunidades de vecinos en el frente marítimo, viviendas unifamiliares en la zona residencial y rehabilitaciones de edificios antiguos en el centro. Cada instalación incluye medición personalizada, asesoramiento sobre el mejor vidrio según la orientación y la retirada limpia de las ventanas antiguas.",
      contenidoEn: "Calella, the tourist capital of the northern Maresme, is a coastal town with an extensive housing stock that urgently needs energy renovation. Its location between the sea and the Montnegre mountains gives it a particular microclimate, with constant sea breezes and high relative humidity that accelerate the deterioration of old aluminum and wood windows. Additionally, the commuter train line running through the town center and the N-II highway generate significant noise levels that especially affect homes in the center and beach area.\n\nCalella's building typology is very representative of the Maresme: the old town around the Santa Maria Church and Esglesia Street, with traditional village houses; the apartment blocks from the 60s-80s that grew with the tourist boom, especially along Passeig de les Roques, Anibal Street, and the Parc Dalmau area; and newer residential developments toward the Vallalta area and Poblenou. Each of these typologies requires specific window solutions.\n\nCalella falls within climate zone C2 under Spanish building regulations (CTE), with hot summers and moderate winters. Switching to Cortizo PVC windows with double low-emissivity glazing can deliver savings of up to 35% on climate control bills. For homes near the train, we recommend laminated acoustic glass that reduces sound transmission by up to 42 dB. We have completed over 70 projects in Calella, including homeowner associations on the seafront, single-family homes in the residential area, and rehabilitations of old buildings in the center. Every installation includes custom measurement, advice on the best glass for each orientation, and clean removal of old windows.",
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
      contenidoCa: "Palafrugell, al cor del Baix Empordà, és un municipi singular que combina un nucli interior amb els encantadors pobles costaners de Calella de Palafrugell, Llafranc i Tamariu. Aquesta dualitat fa que les necessitats d'aïllament siguin molt variades: els habitatges costaners requereixen protecció contra la sal marina i la humitat, mentre que el nucli de Palafrugell, més a l'interior, està més exposat als canvis de temperatura i a la tramuntana que baixa de l'Empordà. El clima és mediterrani amb influència costanera, però les nits d'hivern poden ser fredes, especialment quan bufa vent del nord.\n\nL'arquitectura de Palafrugell és rica i diversa. Al nucli antic, al voltant de la plaça Nova i l'Església de Sant Martí, trobem cases de pedra tradicionals empordaneses amb finestres de fusta que sovint necessiten substitució. A Calella de Palafrugell, les cases del carrer de les Voltes i el front marítim presenten un caràcter mariner que exigeix acabats respectuosos amb l'estètica del poble. Llafranc i Tamariu, amb els seus xalets i cases senyorials, requereixen solucions d'alta gamma. Les urbanitzacions residencials com Mont-ras i la zona de Sant Sebastià de la Guarda necessiten finestres que combinin vistes panoràmiques amb aïllament.\n\nPalafrugell se situa en zona climàtica C2 del CTE, i el canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot generar un estalvi de fins al 35% en climatització. Per a les cases de pedra del nucli antic, oferim perfils amb laminat d'efecte fusta que s'integren perfectament amb l'arquitectura empordanesa. Per als habitatges costaners, utilitzem ferratges d'acer inoxidable i tractaments específics contra la corrosió. Hem completat més de 50 projectes al municipi, des de rehabilitacions al casc antic fins a xalets de luxe a primera línia de mar. Oferim assessorament personalitzat per a cada nucli, respectant les normatives estètiques locals de cadascun.",
      contenidoEs: "Palafrugell, en el corazón del Baix Empordà, es un municipio singular que combina un núcleo interior con los encantadores pueblos costeros de Calella de Palafrugell, Llafranc y Tamariu. Esta dualidad hace que las necesidades de aislamiento sean muy variadas: las viviendas costeras requieren protección contra la sal marina y la humedad, mientras que el núcleo de Palafrugell, más al interior, está más expuesto a los cambios de temperatura y a la tramontana que baja del Empordà. El clima es mediterráneo con influencia costera, pero las noches de invierno pueden ser frías, especialmente cuando sopla viento del norte.\n\nLa arquitectura de Palafrugell es rica y diversa. En el núcleo antiguo, en torno a la plaza Nova y la Iglesia de Sant Martí, encontramos casas de piedra tradicionales ampurdanesas con ventanas de madera que a menudo necesitan sustitución. En Calella de Palafrugell, las casas de la calle de les Voltes y el frente marítimo presentan un carácter marinero que exige acabados respetuosos con la estética del pueblo. Llafranc y Tamariu, con sus chalets y casas señoriales, requieren soluciones de alta gama. Las urbanizaciones residenciales como Mont-ras y la zona de Sant Sebastià de la Guarda necesitan ventanas que combinen vistas panorámicas con aislamiento.\n\nPalafrugell se sitúa en zona climática C2 del CTE, y el cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede generar un ahorro de hasta el 35% en climatización. Para las casas de piedra del núcleo antiguo, ofrecemos perfiles con laminado de efecto madera que se integran perfectamente con la arquitectura ampurdanesa. Para las viviendas costeras, utilizamos herrajes de acero inoxidable y tratamientos específicos contra la corrosión. Hemos completado más de 50 proyectos en el municipio, desde rehabilitaciones en el casco antiguo hasta chalets de lujo en primera línea de mar. Ofrecemos asesoramiento personalizado para cada núcleo, respetando las normativas estéticas locales de cada uno.",
      contenidoEn: "Palafrugell, in the heart of the Baix Emporda, is a unique municipality that combines an inland center with the charming coastal villages of Calella de Palafrugell, Llafranc, and Tamariu. This duality means insulation needs are highly varied: coastal homes require protection against sea salt and humidity, while the Palafrugell center, further inland, is more exposed to temperature changes and the tramontana wind coming down from the Emporda. The climate is Mediterranean with coastal influence, but winter nights can be cold, especially when the northerly wind blows.\n\nPalafrugell's architecture is rich and diverse. In the old town, around Placa Nova and the Sant Marti Church, we find traditional Empordanese stone houses with wooden windows that often need replacement. In Calella de Palafrugell, the houses on Voltes Street and the seafront have a maritime character that demands finishes respectful of the village aesthetics. Llafranc and Tamariu, with their villas and stately homes, require high-end solutions. Residential developments like Mont-ras and the Sant Sebastia de la Guarda area need windows that combine panoramic views with insulation.\n\nPalafrugell falls within climate zone C2 under Spanish building regulations (CTE), and switching to Cortizo PVC windows with double low-emissivity glazing can generate savings of up to 35% on climate control. For the stone houses in the old town, we offer profiles with wood-effect laminate that integrate perfectly with Empordanese architecture. For coastal homes, we use stainless steel hardware and specific anti-corrosion treatments. We have completed over 50 projects in the municipality, from old town rehabilitations to luxury seafront villas. We offer personalized advice for each village, respecting the local aesthetic regulations of each one.",
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
      contenidoCa: "Olot, capital de la Garrotxa, és la ciutat amb el clima més fred de les comarques gironines. Situada a 443 metres d'altitud, en una vall volcànica envoltada de muntanyes, els seus hiverns són llargs i rigorosos, amb temperatures que sovint baixen dels 0 graus i gelades freqüents de novembre a març. Olot se situa en zona climàtica D1 del Codi Tècnic de l'Edificació, la més exigent del nostre territori de servei, on el triple vidre no és un luxe sinó una necessitat real per garantir el confort tèrmic i controlar la factura de calefacció.\n\nLa tipologia edificatòria d'Olot reflecteix la seva història industrial. El nucli antic, al voltant de la plaça Major, el carrer dels Sastres i l'Hospici, presenta cases de pedra volcànica amb finestres de fusta molt deteriorades per la humitat. El barri de Sant Roc, les zones de Morrot i la Canya, i els eixamples dels anys 60-80 al voltant del passeig de Barcelona i Sant Pere Màrtir estan plens de blocs de pisos amb finestres d'alumini que són autèntics ponts tèrmics. Les urbanitzacions noves cap a la zona del volcà Montsacopa i la sortida cap a Vic ofereixen possibilitats d'instal·lacions d'alta eficiència.\n\nEl canvi a finestres de PVC Cortizo amb triple vidre i cambra d'argó a Olot pot representar un estalvi de fins al 50% en calefacció, ja que les pèrdues per finestres antigues en un clima tan fred poden suposar fins a un 35% del consum total d'un habitatge. El nostre sistema Cortizo E-170 de 82 mm amb sis cambres i un valor Uw de 0,9 W/m2K és la solució ideal per al clima olotí. Hem completat més de 40 projectes a Olot i la Garrotxa, incloent comunitats de veïns al barri de Sant Ferriol, cases unifamiliars al Firal i rehabilitacions al nucli antic. Cada instal·lació inclou assessorament tèrmic personalitzat, ja que en un clima com el d'Olot, cada detall d'aïllament compta.",
      contenidoEs: "Olot, capital de la Garrotxa, es la ciudad con el clima más frío de las comarcas gerundenses. Situada a 443 metros de altitud, en un valle volcánico rodeado de montañas, sus inviernos son largos y rigurosos, con temperaturas que a menudo bajan de los 0 grados y heladas frecuentes de noviembre a marzo. Olot se sitúa en zona climática D1 del Código Técnico de la Edificación, la más exigente de nuestro territorio de servicio, donde el triple vidrio no es un lujo sino una necesidad real para garantizar el confort térmico y controlar la factura de calefacción.\n\nLa tipología edificatoria de Olot refleja su historia industrial. El núcleo antiguo, en torno a la plaza Mayor, la calle dels Sastres y el Hospicio, presenta casas de piedra volcánica con ventanas de madera muy deterioradas por la humedad. El barrio de Sant Roc, las zonas de Morrot y la Canya, y los ensanches de los años 60-80 en torno al paseo de Barcelona y Sant Pere Màrtir están llenos de bloques de pisos con ventanas de aluminio que son auténticos puentes térmicos. Las urbanizaciones nuevas hacia la zona del volcán Montsacopa y la salida hacia Vic ofrecen posibilidades de instalaciones de alta eficiencia.\n\nEl cambio a ventanas de PVC Cortizo con triple vidrio y cámara de argón en Olot puede representar un ahorro de hasta el 50% en calefacción, ya que las pérdidas por ventanas antiguas en un clima tan frío pueden suponer hasta un 35% del consumo total de una vivienda. Nuestro sistema Cortizo E-170 de 82 mm con seis cámaras y un valor Uw de 0,9 W/m2K es la solución ideal para el clima olotense. Hemos completado más de 40 proyectos en Olot y la Garrotxa, incluyendo comunidades de vecinos en el barrio de Sant Ferriol, casas unifamiliares en el Firal y rehabilitaciones en el núcleo antiguo. Cada instalación incluye asesoramiento térmico personalizado, ya que en un clima como el de Olot, cada detalle de aislamiento cuenta.",
      contenidoEn: "Olot, capital of the Garrotxa, is the coldest city in the Girona counties. Situated at 443 meters altitude in a volcanic valley surrounded by mountains, its winters are long and harsh, with temperatures frequently dropping below freezing and regular frosts from November to March. Olot falls within climate zone D1 under Spanish building regulations (CTE), the most demanding in our service territory, where triple glazing is not a luxury but a real necessity to ensure thermal comfort and control heating bills.\n\nOlot's building typology reflects its industrial history. The old town, around the Placa Major, Sastres Street, and the Hospici, features volcanic stone houses with wooden windows severely deteriorated by humidity. The Sant Roc neighborhood, the Morrot and la Canya areas, and the 60s-80s expansion zones around Passeig de Barcelona and Sant Pere Martir are full of apartment blocks with aluminum windows that act as significant thermal bridges. Newer developments toward the Montsacopa volcano area and the road to Vic offer possibilities for high-efficiency installations.\n\nSwitching to Cortizo PVC windows with triple glazing and argon-filled chambers in Olot can represent savings of up to 50% on heating, as losses through old windows in such a cold climate can account for up to 35% of a home's total energy consumption. Our 82 mm Cortizo E-170 system with six chambers and a Uw value of 0.9 W/m2K is the ideal solution for Olot's climate. We have completed over 40 projects in Olot and the Garrotxa, including homeowner associations in the Sant Ferriol neighborhood, single-family homes in the Firal area, and rehabilitations in the old town. Every installation includes personalized thermal advice, because in a climate like Olot's, every insulation detail matters.",
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
      contenidoCa: "Salt, municipi adjacent a Girona, comparteix les mateixes condicions climàtiques que la capital: zona climàtica D1 del CTE, amb hiverns freds marcats per la tramuntana i estius calorosos. Tanmateix, Salt presenta un parc d'habitatges amb característiques pròpies i un enorme potencial de millora energètica. Amb una alta densitat de blocs de pisos construïts entre els anys 60 i 80, la renovació de fusteria exterior és una de les intervencions amb millor relació cost-benefici per millorar el confort i reduir la despesa energètica.\n\nLa tipologia edificatòria de Salt es concentra principalment en blocs residencials. Al barri de l'Estació i el sector de Santa Eugènia de Ter, predominen els edificis de 4-6 plantes amb finestres d'alumini sense ruptura de pont tèrmic que provoquen condensacions, filtracions d'aire i pèrdues tèrmiques importants. La zona del carrer Major i el nucli antic presenta cases més antigues amb finestres de fusta deteriorades. Les àrees de desenvolupament més recent cap a Veïnat de Salt i la zona del Parc de les Deveses ofereixen habitatges més nous però que també poden beneficiar-se d'una millora de fusteria.\n\nEl canvi a finestres de PVC Cortizo amb doble vidre baix emissiu a Salt pot suposar un estalvi de fins al 40% en calefacció, especialment significatiu per a les famílies del municipi. La tramuntana, que a Salt bufa amb força a causa de la seva situació a la plana del Ter, fa que l'estanqueïtat de les finestres sigui fonamental. Els perfils Cortizo amb classificació de permeabilitat a l'aire de classe 4 eliminen les corrents d'aire i milloren radicalment el confort. Hem completat més de 60 projectes a Salt, treballant principalment amb comunitats de veïns en projectes de renovació integral d'edificis. Oferim pressupostos adaptats a comunitats, amb possibilitat de finançament i gestió de subvencions per a rehabilitació energètica.",
      contenidoEs: "Salt, municipio adyacente a Girona, comparte las mismas condiciones climáticas que la capital: zona climática D1 del CTE, con inviernos fríos marcados por la tramontana y veranos calurosos. Sin embargo, Salt presenta un parque de viviendas con características propias y un enorme potencial de mejora energética. Con una alta densidad de bloques de pisos construidos entre los años 60 y 80, la renovación de carpintería exterior es una de las intervenciones con mejor relación coste-beneficio para mejorar el confort y reducir el gasto energético.\n\nLa tipología edificatoria de Salt se concentra principalmente en bloques residenciales. En el barrio de la Estación y el sector de Santa Eugènia de Ter, predominan los edificios de 4-6 plantas con ventanas de aluminio sin rotura de puente térmico que provocan condensaciones, filtraciones de aire y pérdidas térmicas importantes. La zona de la calle Major y el núcleo antiguo presenta casas más antiguas con ventanas de madera deterioradas. Las áreas de desarrollo más reciente hacia Veïnat de Salt y la zona del Parc de les Deveses ofrecen viviendas más nuevas que también pueden beneficiarse de una mejora de carpintería.\n\nEl cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo en Salt puede suponer un ahorro de hasta el 40% en calefacción, especialmente significativo para las familias del municipio. La tramontana, que en Salt sopla con fuerza debido a su situación en la llanura del Ter, hace que la estanqueidad de las ventanas sea fundamental. Los perfiles Cortizo con clasificación de permeabilidad al aire de clase 4 eliminan las corrientes de aire y mejoran radicalmente el confort. Hemos completado más de 60 proyectos en Salt, trabajando principalmente con comunidades de vecinos en proyectos de renovación integral de edificios. Ofrecemos presupuestos adaptados a comunidades, con posibilidad de financiación y gestión de subvenciones para rehabilitación energética.",
      contenidoEn: "Salt, a municipality adjacent to Girona, shares the same climatic conditions as the capital: climate zone D1 under the CTE, with cold winters shaped by the tramontana and hot summers. However, Salt has a housing stock with its own characteristics and enormous potential for energy improvement. With a high density of apartment blocks built between the 60s and 80s, exterior window renovation is one of the most cost-effective interventions for improving comfort and reducing energy expenditure.\n\nSalt's building typology is concentrated mainly in residential blocks. In the Estacio neighborhood and the Santa Eugenia de Ter sector, 4-6 story buildings with aluminum windows lacking thermal break predominate, causing condensation, air leaks, and significant thermal losses. The Carrer Major area and old town feature older houses with deteriorated wooden windows. More recent development areas toward Veinat de Salt and the Parc de les Deveses zone offer newer homes that can also benefit from window upgrades.\n\nSwitching to Cortizo PVC windows with double low-emissivity glazing in Salt can deliver savings of up to 40% on heating, especially significant for the municipality's families. The tramontana, which blows strongly in Salt due to its location on the Ter plain, makes window airtightness essential. Cortizo profiles with class 4 air permeability classification eliminate drafts and radically improve comfort. We have completed over 60 projects in Salt, working primarily with homeowner associations on comprehensive building renovation projects. We offer quotes tailored to communities, with financing options and assistance managing energy rehabilitation subsidies.",
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
      contenidoCa: "Roses, a la badia de l'Alt Empordà, és una de les localitats on les finestres estan sotmeses a les condicions més extremes de tot el nostre territori. La combinació de la tramuntana, que pot bufar amb ratxes de més de 100 km/h directament des del nord, i la salinitat del mar Mediterrani, crea un entorn molt agressiu per a qualsevol fusteria exterior. Les finestres de PVC Cortizo, a diferència de l'alumini que es corroeix ràpidament en aquestes condicions, mantenen les seves propietats durant dècades sense necessitat de manteniment.\n\nRoses presenta una tipologia edificatòria molt vinculada al turisme. El nucli antic, al voltant de la Ciutadella i el barri de pescadors, conserva cases tradicionals que necessiten finestres amb acabats respectuosos amb l'entorn patrimonial. La zona del port esportiu i la marina, Santa Margarida, Mas Fumats i el sector de l'Almadrava concentren grans comunitats d'apartaments turístics i segones residències on l'aïllament acústic és fonamental durant la temporada alta. Les urbanitzacions de Mas Buscà, Canyelles Petites i la zona de Puig-rom ofereixen xalets amb grans obertures que requereixen solucions tècniques especials per garantir l'estanqueïtat al vent.\n\nRoses se situa en una zona de transició climàtica entre la C2 costanera i la D1 influenciada per la tramuntana. Per als habitatges permanents, recomanem triple vidre amb cambra d'argó que pot generar un estalvi de fins al 40% en climatització anual. Per a segones residències, el PVC és ideal perquè no requereix manteniment durant els mesos de tancament. Hem completat més de 70 projectes a Roses, des d'apartaments al port fins a xalets a Canyelles i comunitats de veïns a Santa Margarida. Oferim servei integral amb assessorament sobre l'orientació al vent dominant, mesura personalitzada i instal·lació professional amb garantia de 10 anys.",
      contenidoEs: "Roses, en la bahía del Alt Empordà, es una de las localidades donde las ventanas están sometidas a las condiciones más extremas de todo nuestro territorio. La combinación de la tramontana, que puede soplar con rachas de más de 100 km/h directamente desde el norte, y la salinidad del mar Mediterráneo, crea un entorno muy agresivo para cualquier carpintería exterior. Las ventanas de PVC Cortizo, a diferencia del aluminio que se corroe rápidamente en estas condiciones, mantienen sus propiedades durante décadas sin necesidad de mantenimiento.\n\nRoses presenta una tipología edificatoria muy vinculada al turismo. El núcleo antiguo, en torno a la Ciudadela y el barrio de pescadores, conserva casas tradicionales que necesitan ventanas con acabados respetuosos con el entorno patrimonial. La zona del puerto deportivo y la marina, Santa Margarida, Mas Fumats y el sector de l'Almadrava concentran grandes comunidades de apartamentos turísticos y segundas residencias donde el aislamiento acústico es fundamental durante la temporada alta. Las urbanizaciones de Mas Buscà, Canyelles Petites y la zona de Puig-rom ofrecen chalets con grandes aberturas que requieren soluciones técnicas especiales para garantizar la estanqueidad al viento.\n\nRoses se sitúa en una zona de transición climática entre la C2 costera y la D1 influenciada por la tramontana. Para las viviendas permanentes, recomendamos triple vidrio con cámara de argón que puede generar un ahorro de hasta el 40% en climatización anual. Para segundas residencias, el PVC es ideal porque no requiere mantenimiento durante los meses de cierre. Hemos completado más de 70 proyectos en Roses, desde apartamentos en el puerto hasta chalets en Canyelles y comunidades de vecinos en Santa Margarida. Ofrecemos servicio integral con asesoramiento sobre la orientación al viento dominante, medición personalizada e instalación profesional con garantía de 10 años.",
      contenidoEn: "Roses, on the Alt Emporda bay, is one of the locations where windows face the most extreme conditions in our entire territory. The combination of the tramontana, which can gust at over 100 km/h directly from the north, and Mediterranean sea salinity creates a very aggressive environment for any exterior joinery. Cortizo PVC windows, unlike aluminum which corrodes rapidly under these conditions, maintain their properties for decades without maintenance.\n\nRoses features a building typology closely linked to tourism. The old town, around the Citadel and the fishing quarter, retains traditional houses that need windows with heritage-respectful finishes. The marina area, Santa Margarida, Mas Fumats, and the Almadrava sector concentrate large communities of tourist apartments and second homes where acoustic insulation is essential during high season. The Mas Busca, Canyelles Petites, and Puig-rom developments feature villas with large openings that require special technical solutions to ensure wind tightness.\n\nRoses sits in a climatic transition zone between the coastal C2 and the tramontana-influenced D1. For permanent homes, we recommend triple glazing with argon chambers that can generate savings of up to 40% on annual climate control. For second homes, PVC is ideal because it requires no maintenance during months of closure. We have completed over 70 projects in Roses, from port apartments to Canyelles villas and homeowner associations in Santa Margarida. We offer a comprehensive service with advice on dominant wind orientation, custom measurement, and professional installation with a 10-year warranty.",
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
      contenidoCa: "Pineda de Mar, al Maresme nord, és una localitat costanera amb un parc d'habitatges que reflecteix el creixement turístic de les dècades dels 60, 70 i 80. Molts d'aquests edificis conserven encara les finestres d'alumini originals, sense ruptura de pont tèrmic, que provoquen condensacions, filtracions d'aire fred a l'hivern i un confort acústic molt deficient. La brisa marina constant i la humitat salina acceleren la degradació d'aquests tancaments, fent que la renovació amb PVC Cortizo sigui la inversió més rendible per millorar l'habitabilitat.\n\nEl nucli urbà de Pineda s'estén entre la línia de tren de Rodalies i la platja. La zona del passeig marítim i els carrers propers a la platja pateixen l'impacte directe de la sal marina. El centre, al voltant del carrer de l'Església i la plaça de les Mèlies, combina cases antigues amb blocs residencials. La zona interior, cap a l'avinguda del Maresme i la sortida cap a Tordera, està més exposada al soroll de la carretera N-II i de la via del tren, que travessa tot el municipi generant vibracions i soroll constant. Les urbanitzacions de Poblenou i la zona de Can Torrents presenten necessitats d'aïllament tèrmic per a cases unifamiliars.\n\nPineda se situa en zona climàtica C2 del CTE, amb estius calorosos i hiverns moderats. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot representar un estalvi de fins al 35% en climatització. Per als habitatges propers al tren i la N-II, el vidre acústic laminar és essencial per recuperar el silenci interior. Hem completat més de 55 projectes a Pineda de Mar, especialment comunitats de veïns dels blocs del front marítim i cases unifamiliars a la zona interior. Oferim servei complet amb retirada de les finestres antigues, gestió de runes i acabat net en jornades planificades per minimitzar les molèsties als veïns.",
      contenidoEs: "Pineda de Mar, en el Maresme norte, es una localidad costera con un parque de viviendas que refleja el crecimiento turístico de las décadas de los 60, 70 y 80. Muchos de estos edificios conservan aún las ventanas de aluminio originales, sin rotura de puente térmico, que provocan condensaciones, filtraciones de aire frío en invierno y un confort acústico muy deficiente. La brisa marina constante y la humedad salina aceleran la degradación de estos cerramientos, haciendo que la renovación con PVC Cortizo sea la inversión más rentable para mejorar la habitabilidad.\n\nEl núcleo urbano de Pineda se extiende entre la línea de tren de Cercanías y la playa. La zona del paseo marítimo y las calles cercanas a la playa sufren el impacto directo de la sal marina. El centro, en torno a la calle de la Iglesia y la plaza de les Mèlies, combina casas antiguas con bloques residenciales. La zona interior, hacia la avenida del Maresme y la salida hacia Tordera, está más expuesta al ruido de la carretera N-II y de la vía del tren, que atraviesa todo el municipio generando vibraciones y ruido constante. Las urbanizaciones de Poblenou y la zona de Can Torrents presentan necesidades de aislamiento térmico para casas unifamiliares.\n\nPineda se sitúa en zona climática C2 del CTE, con veranos calurosos e inviernos moderados. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede representar un ahorro de hasta el 35% en climatización. Para las viviendas cercanas al tren y la N-II, el vidrio acústico laminar es esencial para recuperar el silencio interior. Hemos completado más de 55 proyectos en Pineda de Mar, especialmente comunidades de vecinos de los bloques del frente marítimo y casas unifamiliares en la zona interior. Ofrecemos servicio completo con retirada de las ventanas antiguas, gestión de escombros y acabado limpio en jornadas planificadas para minimizar las molestias a los vecinos.",
      contenidoEn: "Pineda de Mar, in the northern Maresme, is a coastal town with a housing stock that reflects the tourist growth of the 60s, 70s, and 80s. Many of these buildings still have their original aluminum windows without thermal break, which cause condensation, cold air leaks in winter, and very poor acoustic comfort. The constant sea breeze and salt humidity accelerate the degradation of these enclosures, making renovation with Cortizo PVC the most cost-effective investment for improving livability.\n\nPineda's urban center extends between the commuter train line and the beach. The promenade area and streets near the beach suffer the direct impact of sea salt. The center, around Esglesia Street and Placa de les Melies, combines old houses with residential blocks. The inland area, toward Avinguda del Maresme and the road to Tordera, is more exposed to noise from the N-II highway and the train line, which crosses the entire municipality generating constant vibrations and noise. The Poblenou developments and Can Torrents area have thermal insulation needs for single-family homes.\n\nPineda falls within climate zone C2 under Spanish building regulations (CTE), with hot summers and moderate winters. Switching to Cortizo PVC windows with double low-emissivity glazing can represent savings of up to 35% on climate control. For homes near the train and N-II, laminated acoustic glass is essential to restore indoor quiet. We have completed over 55 projects in Pineda de Mar, especially homeowner associations in seafront blocks and single-family homes in the inland area. We offer a complete service including removal of old windows, debris management, and a clean finish in planned workdays to minimize disruption to neighbors.",
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
      contenidoCa: "Tordera, situada entre el Maresme i la Selva, ocupa una posició geogràfica de transició entre la costa mediterrània i l'interior prelitoral. Aquesta ubicació li confereix un clima particular: més fred a l'hivern que els municipis estrictament costaners, amb gelades ocasionals, però sense els extrems de les zones de muntanya. La humitat relativa és elevada per la proximitat del riu Tordera, i els estius són calorosos. Aquesta combinació fa que l'aïllament tèrmic eficient sigui important durant tot l'any.\n\nLa tipologia edificatòria de Tordera és molt diferent de la dels municipis costaners. Predominen les cases unifamiliars, les masies rehabilitades i les urbanitzacions residencials disperses pel terme municipal. El nucli antic, al voltant de l'Església de Sant Esteve i la plaça de la Vila, presenta cases de poble amb finestres de fusta antigues. Les urbanitzacions de Can Domenec, Mas Mora, Agora Parc i Roca Rossa concentren xalets i cases adossades que necessiten finestres amb bona relació qualitat-aïllament. La zona industrial i comercial propera a la carretera N-II i l'autopista C-32 requereix solucions acústiques específiques.\n\nTordera se situa en una zona de transició climàtica entre la C2 costanera i la C1 interior del CTE. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot generar un estalvi de fins al 35% en climatització. Per a les masies i cases rurals, oferim acabats amb laminat de fusta de roure, noguer o avet que s'integren perfectament amb l'entorn rural i l'arquitectura tradicional. Hem completat més de 45 projectes a Tordera i les urbanitzacions del seu entorn, incloent cases unifamiliars a Mas Mora, rehabilitacions de masies al terme municipal i habitatges al nucli urbà. Cada projecte inclou assessorament sobre el tipus de vidre i perfil més adequat segons l'orientació i l'exposició de cada habitatge.",
      contenidoEs: "Tordera, situada entre el Maresme y la Selva, ocupa una posición geográfica de transición entre la costa mediterránea y el interior prelitoral. Esta ubicación le confiere un clima particular: más frío en invierno que los municipios estrictamente costeros, con heladas ocasionales, pero sin los extremos de las zonas de montaña. La humedad relativa es elevada por la proximidad del río Tordera, y los veranos son calurosos. Esta combinación hace que el aislamiento térmico eficiente sea importante durante todo el año.\n\nLa tipología edificatoria de Tordera es muy diferente de la de los municipios costeros. Predominan las casas unifamiliares, las masías rehabilitadas y las urbanizaciones residenciales dispersas por el término municipal. El núcleo antiguo, en torno a la Iglesia de Sant Esteve y la plaza de la Vila, presenta casas de pueblo con ventanas de madera antiguas. Las urbanizaciones de Can Domenec, Mas Mora, Agora Parc y Roca Rossa concentran chalets y casas adosadas que necesitan ventanas con buena relación calidad-aislamiento. La zona industrial y comercial cercana a la carretera N-II y la autopista C-32 requiere soluciones acústicas específicas.\n\nTordera se sitúa en una zona de transición climática entre la C2 costera y la C1 interior del CTE. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede generar un ahorro de hasta el 35% en climatización. Para las masías y casas rurales, ofrecemos acabados con laminado de madera de roble, nogal o abeto que se integran perfectamente con el entorno rural y la arquitectura tradicional. Hemos completado más de 45 proyectos en Tordera y las urbanizaciones de su entorno, incluyendo casas unifamiliares en Mas Mora, rehabilitaciones de masías en el término municipal y viviendas en el núcleo urbano. Cada proyecto incluye asesoramiento sobre el tipo de vidrio y perfil más adecuado según la orientación y la exposición de cada vivienda.",
      contenidoEn: "Tordera, situated between the Maresme and la Selva, occupies a transitional geographic position between the Mediterranean coast and the pre-coastal interior. This location gives it a particular climate: colder in winter than strictly coastal municipalities, with occasional frosts, but without the extremes of mountain areas. Relative humidity is high due to the proximity of the Tordera River, and summers are hot. This combination makes efficient thermal insulation important year-round.\n\nTordera's building typology is very different from coastal municipalities. Single-family homes, renovated farmhouses, and scattered residential developments across the municipal area predominate. The old town, around the Sant Esteve Church and Placa de la Vila, features village houses with old wooden windows. The Can Domenec, Mas Mora, Agora Parc, and Roca Rossa developments concentrate villas and townhouses that need windows with a good quality-to-insulation ratio. The industrial and commercial area near the N-II highway and C-32 motorway requires specific acoustic solutions.\n\nTordera sits in a climatic transition zone between the coastal C2 and interior C1 under the CTE. Switching to Cortizo PVC windows with double low-emissivity glazing can generate savings of up to 35% on climate control. For farmhouses and rural homes, we offer finishes with oak, walnut, or fir wood laminate that integrate perfectly with the rural surroundings and traditional architecture. We have completed over 45 projects in Tordera and surrounding developments, including single-family homes in Mas Mora, farmhouse rehabilitations across the municipal area, and homes in the town center. Every project includes advice on the most suitable glass type and profile based on each home's orientation and exposure.",
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
      contenidoCa: "Arenys de Mar, vila marinera amb segles d'història al Maresme, combina un ric patrimoni arquitectònic amb zones residencials modernes. El port pesquer i esportiu genera una humitat salina constant que afecta directament les finestres dels habitatges propers, mentre que la línia de tren de Rodalies, que travessa el centre del municipi, és una font de soroll continu que requereix solucions d'aïllament acústic efectives. La brisa marina, present gairebé tot l'any, aporta humitat i salinitat que deterioren les finestres d'alumini i fusta convencionals.\n\nL'arquitectura d'Arenys de Mar és particularment interessant. El casc antic, amb els seus carrers estrets al voltant del Rierot, la plaça del Calisay i l'Església de Santa Maria, presenta cases senyorials i edificis amb elements modernistes que requereixen finestres amb acabats respectuosos amb el patrimoni. El barri del port i la zona de la Musclera estan directament exposats a l'ambient marí. Les noves promocions al sector de la riera d'Arenys i les urbanitzacions cap a la carretera de Canet ofereixen habitatges més moderns. La zona propera a l'estació de tren i la N-II necessita prioritàriament aïllament acústic.\n\nArenys se situa en zona climàtica C2 del CTE, amb un clima suavitzat per la influència marina però amb necessitats reals d'aïllament tèrmic a l'hivern. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot generar un estalvi de fins al 30% en climatització. Per als habitatges propers al tren, el nostre vidre acústic laminar 44.2 redueix la transmissió de soroll fins a 42 dB, transformant completament la qualitat de vida interior. Hem completat més de 50 projectes a Arenys de Mar, des de rehabilitacions d'edificis senyorials al casc antic fins a comunitats de veïns al barri del port i cases unifamiliars a la zona alta. Totes les instal·lacions inclouen garantia de 10 anys, mesura personalitzada i retirada dels materials antics.",
      contenidoEs: "Arenys de Mar, villa marinera con siglos de historia en el Maresme, combina un rico patrimonio arquitectónico con zonas residenciales modernas. El puerto pesquero y deportivo genera una humedad salina constante que afecta directamente a las ventanas de las viviendas cercanas, mientras que la línea de tren de Cercanías, que atraviesa el centro del municipio, es una fuente de ruido continuo que requiere soluciones de aislamiento acústico efectivas. La brisa marina, presente casi todo el año, aporta humedad y salinidad que deterioran las ventanas de aluminio y madera convencionales.\n\nLa arquitectura de Arenys de Mar es particularmente interesante. El casco antiguo, con sus calles estrechas en torno al Rierot, la plaza del Calisay y la Iglesia de Santa Maria, presenta casas señoriales y edificios con elementos modernistas que requieren ventanas con acabados respetuosos con el patrimonio. El barrio del puerto y la zona de la Musclera están directamente expuestos al ambiente marino. Las nuevas promociones en el sector de la riera de Arenys y las urbanizaciones hacia la carretera de Canet ofrecen viviendas más modernas. La zona cercana a la estación de tren y la N-II necesita prioritariamente aislamiento acústico.\n\nArenys se sitúa en zona climática C2 del CTE, con un clima suavizado por la influencia marina pero con necesidades reales de aislamiento térmico en invierno. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede generar un ahorro de hasta el 30% en climatización. Para las viviendas cercanas al tren, nuestro vidrio acústico laminar 44.2 reduce la transmisión de ruido hasta 42 dB, transformando completamente la calidad de vida interior. Hemos completado más de 50 proyectos en Arenys de Mar, desde rehabilitaciones de edificios señoriales en el casco antiguo hasta comunidades de vecinos en el barrio del puerto y casas unifamiliares en la zona alta. Todas las instalaciones incluyen garantía de 10 años, medición personalizada y retirada de los materiales antiguos.",
      contenidoEn: "Arenys de Mar, a seafaring town with centuries of history in the Maresme, combines a rich architectural heritage with modern residential areas. The fishing and sports port generates constant salt humidity that directly affects nearby home windows, while the commuter train line crossing through the town center is a continuous noise source requiring effective acoustic insulation solutions. The sea breeze, present almost year-round, brings humidity and salinity that deteriorate conventional aluminum and wood windows.\n\nThe architecture of Arenys de Mar is particularly interesting. The old town, with its narrow streets around the Rierot, Placa del Calisay, and the Santa Maria Church, features stately homes and buildings with Art Nouveau elements that require windows with heritage-respectful finishes. The port neighborhood and Musclera area are directly exposed to the marine environment. New developments in the Arenys stream sector and developments toward the Canet road offer more modern housing. The area near the train station and N-II primarily needs acoustic insulation.\n\nArenys falls within climate zone C2 under Spanish building regulations (CTE), with a climate softened by marine influence but with real winter thermal insulation needs. Switching to Cortizo PVC windows with double low-emissivity glazing can generate savings of up to 30% on climate control. For homes near the train, our 44.2 laminated acoustic glass reduces noise transmission by up to 42 dB, completely transforming indoor quality of life. We have completed over 50 projects in Arenys de Mar, from rehabilitations of stately buildings in the old town to homeowner associations in the port neighborhood and single-family homes in the upper area. All installations include a 10-year warranty, custom measurement, and removal of old materials.",
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
      contenidoCa: "Sant Feliu de Guíxols, al Baix Empordà, és una localitat costanera amb un patrimoni arquitectònic excepcional que combina el llegat de la seva indústria surera amb l'arquitectura residencial modernista i noucentista. La seva ubicació a la costa, protegida parcialment per la badia, l'exposa a la brisa marina i a la humitat salina constant, però amb menys intensitat de vent que les zones de l'Empordà nord. El soroll del trànsit costaner a l'estiu i la proximitat de la carretera GI-682 són factors acústics a considerar.\n\nLa tipologia edificatòria de Sant Feliu és molt rica. El nucli antic, al voltant del Monestir benedictí, la plaça del Mercat i el passeig del Mar, conserva edificis amb elements arquitectònics singulars que requereixen finestres amb acabats personalitzats per respectar el patrimoni. El barri de la Rambla Vidal i el sector del port esportiu presenten edificis residencials dels anys 50-70 amb necessitats urgents de renovació. Les zones del Fortim, el Vall-llobrega i les urbanitzacions cap a la carretera de Tossa i Sant Pol concentren xalets i cases unifamiliars amb grans obertures orientades al mar. La zona de la platja de Sant Pol, una de les més exclusives de la Costa Brava, demanda solucions d'alta gamma.\n\nSant Feliu se situa en zona climàtica C2 del CTE, amb un clima mediterrani suavitzat per la badia. El canvi a finestres de PVC Cortizo amb doble vidre baix emissiu pot generar un estalvi de fins al 30% en climatització. Per als edificis patrimonials, oferim perfils amb laminat de fusta en més de 30 tonalitats que s'adapten a qualsevol estètica. Per als habitatges de primera línia, els nostres perfils amb tractament anticorrosió i ferratges d'acer inoxidable garanteixen la durabilitat davant l'ambient marí. Hem completat més de 45 projectes a Sant Feliu de Guíxols, des de rehabilitacions d'edificis emblemàtics del centre fins a xalets a Sant Pol i comunitats de veïns al passeig del Mar. Oferim mesura in situ, fabricació a mida i instal·lació professional amb garantia de 10 anys.",
      contenidoEs: "Sant Feliu de Guíxols, en el Baix Empordà, es una localidad costera con un patrimonio arquitectónico excepcional que combina el legado de su industria corchera con la arquitectura residencial modernista y novecentista. Su ubicación en la costa, protegida parcialmente por la bahía, la expone a la brisa marina y a la humedad salina constante, pero con menos intensidad de viento que las zonas del Empordà norte. El ruido del tráfico costero en verano y la proximidad de la carretera GI-682 son factores acústicos a considerar.\n\nLa tipología edificatoria de Sant Feliu es muy rica. El núcleo antiguo, en torno al Monasterio benedictino, la plaza del Mercado y el paseo del Mar, conserva edificios con elementos arquitectónicos singulares que requieren ventanas con acabados personalizados para respetar el patrimonio. El barrio de la Rambla Vidal y el sector del puerto deportivo presentan edificios residenciales de los años 50-70 con necesidades urgentes de renovación. Las zonas del Fortim, Vall-llobrega y las urbanizaciones hacia la carretera de Tossa y Sant Pol concentran chalets y casas unifamiliares con grandes aberturas orientadas al mar. La zona de la playa de Sant Pol, una de las más exclusivas de la Costa Brava, demanda soluciones de alta gama.\n\nSant Feliu se sitúa en zona climática C2 del CTE, con un clima mediterráneo suavizado por la bahía. El cambio a ventanas de PVC Cortizo con doble vidrio bajo emisivo puede generar un ahorro de hasta el 30% en climatización. Para los edificios patrimoniales, ofrecemos perfiles con laminado de madera en más de 30 tonalidades que se adaptan a cualquier estética. Para las viviendas de primera línea, nuestros perfiles con tratamiento anticorrosión y herrajes de acero inoxidable garantizan la durabilidad frente al ambiente marino. Hemos completado más de 45 proyectos en Sant Feliu de Guíxols, desde rehabilitaciones de edificios emblemáticos del centro hasta chalets en Sant Pol y comunidades de vecinos en el paseo del Mar. Ofrecemos medición in situ, fabricación a medida e instalación profesional con garantía de 10 años.",
      contenidoEn: "Sant Feliu de Guixols, in the Baix Emporda, is a coastal town with exceptional architectural heritage that combines the legacy of its cork industry with Modernist and Noucentist residential architecture. Its coastal location, partially sheltered by the bay, exposes it to sea breezes and constant salt humidity, but with less wind intensity than the northern Emporda areas. Summer coastal traffic noise and the proximity of the GI-682 road are acoustic factors to consider.\n\nSant Feliu's building typology is very rich. The old town, around the Benedictine Monastery, the Market Square, and the Passeig del Mar, preserves buildings with unique architectural elements that require windows with custom finishes to respect the heritage. The Rambla Vidal neighborhood and the marina sector feature residential buildings from the 50s-70s with urgent renovation needs. The Fortim and Vall-llobrega areas and developments toward the Tossa and Sant Pol roads concentrate villas and single-family homes with large sea-facing openings. The Sant Pol beach area, one of the most exclusive on the Costa Brava, demands high-end solutions.\n\nSant Feliu falls within climate zone C2 under Spanish building regulations (CTE), with a Mediterranean climate softened by the bay. Switching to Cortizo PVC windows with double low-emissivity glazing can generate savings of up to 30% on climate control. For heritage buildings, we offer profiles with wood laminate in over 30 shades that adapt to any aesthetic. For seafront homes, our profiles with anti-corrosion treatment and stainless steel hardware ensure durability against the marine environment. We have completed over 45 projects in Sant Feliu de Guixols, from rehabilitations of landmark buildings in the center to villas in Sant Pol and homeowner associations on the Passeig del Mar. We offer on-site measurement, custom manufacturing, and professional installation with a 10-year warranty.",
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
        certificacion: "Passivhaus compatible (amb triple acristalament)",
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
    { key: "telefono", valueCa: "+34 611 500 372", valueEs: "+34 611 500 372", valueEn: "+34 611 500 372" },
    { key: "email", valueCa: "info@arafinestra.com", valueEs: "info@arafinestra.com", valueEn: "info@arafinestra.com" },
    { key: "whatsapp", valueCa: "34611500372", valueEs: "34611500372", valueEn: "34611500372" },
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
    {
      nombre: "Núria S.",
      localidad: "Lloret de Mar",
      textoCa: "Vam canviar totes les persianes de casa per unes noves d'alumini amb Ara Finestra. La diferència és brutal: ara es pugen i baixen amb molta suavitat i aïllen molt millor del fred i la calor. Els instal·ladors van ser molt nets i puntuals, van deixar-ho tot impecable.",
      textoEs: "Cambiamos todas las persianas de casa por unas nuevas de aluminio con Ara Finestra. La diferencia es brutal: ahora suben y bajan con mucha suavidad y aíslan mucho mejor del frío y el calor. Los instaladores fueron muy limpios y puntuales, lo dejaron todo impecable.",
      textoEn: "We replaced all our shutters with new aluminum ones from Ara Finestra. The difference is huge: they now go up and down very smoothly and insulate much better from cold and heat. The installers were very clean and punctual, they left everything spotless.",
      puntuacion: 5,
      published: true,
    },
    {
      nombre: "Ferran M.",
      localidad: "Tossa de Mar",
      textoCa: "Ens van posar mosquiteres enrollables a totes les finestres de la planta baixa. Per fi podem dormir amb les finestres obertes a l'estiu sense que entrin mosquits. La qualitat del material és excel·lent i el preu molt raonable. Molt recomanable.",
      textoEs: "Nos pusieron mosquiteras enrollables en todas las ventanas de la planta baja. Por fin podemos dormir con las ventanas abiertas en verano sin que entren mosquitos. La calidad del material es excelente y el precio muy razonable. Muy recomendable.",
      textoEn: "They installed roller mosquito nets on all the ground floor windows. We can finally sleep with the windows open in summer without mosquitoes getting in. The material quality is excellent and the price very reasonable. Highly recommended.",
      puntuacion: 5,
      published: true,
    },
    {
      nombre: "Carles R.",
      localidad: "Mataró",
      textoCa: "Vam demanar pressupost a tres empreses i Ara Finestra va ser la millor relació qualitat-preu. Ens van instal·lar finestres oscil·lobatents amb vidre doble i hem notat un estalvi important a la factura de la calefacció, gairebé un 30% menys. El tracte va ser molt proper i professional.",
      textoEs: "Pedimos presupuesto a tres empresas y Ara Finestra fue la mejor relación calidad-precio. Nos instalaron ventanas oscilobatientes con doble acristalamiento y hemos notado un ahorro importante en la factura de calefacción, casi un 30% menos. El trato fue muy cercano y profesional.",
      textoEn: "We asked three companies for quotes and Ara Finestra had the best value for money. They installed tilt-and-turn windows with double glazing and we noticed significant savings on our heating bill, almost 30% less. The service was very friendly and professional.",
      puntuacion: 4,
      published: true,
    },
    {
      nombre: "Montse V.",
      localidad: "Calella",
      textoCa: "Teníem unes finestres d'alumini molt velles que no tancaven bé i entrava molta humitat. Ara Finestra ens va assessorar perfectament i vam optar per PVC amb trencament de pont tèrmic. La casa ara és molt més silenciosa i s'ha acabat la condensació als vidres. Estem encantats.",
      textoEs: "Teníamos unas ventanas de aluminio muy viejas que no cerraban bien y entraba mucha humedad. Ara Finestra nos asesoró perfectamente y optamos por PVC con rotura de puente térmico. La casa ahora es mucho más silenciosa y se acabó la condensación en los cristales. Estamos encantados.",
      textoEn: "We had very old aluminum windows that didn't close properly and let in a lot of moisture. Ara Finestra advised us perfectly and we chose PVC with thermal bridge break. The house is now much quieter and the condensation on the glass is gone. We are delighted.",
      puntuacion: 5,
      published: true,
    },
    {
      nombre: "Pere L.",
      localidad: "Palafrugell",
      textoCa: "Reforma integral de fusteria a la nostra casa de poble: finestres, balconera corredissa i persianes. Tot coordinat per Ara Finestra sense cap problema. El que més valoro és que van respectar l'estètica de la façana antiga amb uns acabats molt cuidats. Bon preu pel volum de feina.",
      textoEs: "Reforma integral de carpintería en nuestra casa de pueblo: ventanas, balconera corredera y persianas. Todo coordinado por Ara Finestra sin ningún problema. Lo que más valoro es que respetaron la estética de la fachada antigua con unos acabados muy cuidados. Buen precio por el volumen de trabajo.",
      textoEn: "Full carpentry renovation in our village house: windows, sliding balcony door and shutters. Everything coordinated by Ara Finestra without any issues. What I value most is that they respected the aesthetics of the old facade with very careful finishes. Good price for the volume of work.",
      puntuacion: 4,
      published: true,
    },
  ];

  for (const t of testimonialsData) {
    await db.insert(testimonials).values(t).onConflictDoNothing();
  }
  console.log("  6 Testimonials OK");

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
<p>Busca finestres amb una <strong>transmitància tèrmica (valor U) baixa</strong>. A Catalunya, recomanem un valor U inferior a 1.4 W/m²K per complir amb el CTE i accedir a subvencions Next Generation. El model Cortizo E-170 aconsegueix Uf 0.9 W/m²K, i amb triple vidre pot assolir Uw ≤ 0.8 W/m²K, apte per a estàndards Passivhaus.</p>

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
<p>Busca ventanas con una <strong>transmitancia térmica (valor U) baja</strong>. En Cataluña, recomendamos un valor U inferior a 1.4 W/m²K para cumplir con el CTE y acceder a subvenciones Next Generation. El modelo Cortizo E-170 alcanza Uf 0.9 W/m²K, y con triple acristalamiento puede lograr Uw ≤ 0.8 W/m²K, apto para estándares Passivhaus.</p>

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
<p>Look for windows with a <strong>low thermal transmittance (U-value)</strong>. In Catalonia, we recommend a U-value below 1.4 W/m²K to comply with CTE regulations and access Next Generation subsidies. The Cortizo E-170 model achieves Uf 0.9 W/m²K, and with triple glazing can reach Uw ≤ 0.8 W/m²K, suitable for Passivhaus standards.</p>

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
<p>Totes les finestres Cortizo de PVC compleixen sobradament amb la normativa, i els models E-170 amb triple vidre estan preparats per a l'estàndard Passivhaus.</p>

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
<p>Todas las ventanas Cortizo de PVC cumplen sobradamente con la normativa, y los modelos E-170 con triple acristalamiento están preparados para el estándar Passivhaus.</p>

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
<p>All Cortizo PVC windows comfortably meet the regulations, and the E-170 models with triple glazing are Passivhaus-ready.</p>

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
<p>A més, l'estalvi energètic anual de 450-720€ fa que la inversió neta es recuperi en 5-8 anys.</p>

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
<p>Además, el ahorro energético anual de 450-720€ hace que la inversión neta se recupere en 5-8 años.</p>

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
<p>Additionally, annual energy savings of €450-720 mean the net investment pays for itself in 5-8 years.</p>

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

  // ── 6 Portfolio Projects ────────────────────────────────────
  const portfolioData = [
    {
      tituloCa: "Renovació completa de finestres PVC a Blanes",
      tituloEs: "Renovación completa de ventanas PVC en Blanes",
      tituloEn: "Complete PVC window renovation in Blanes",
      descripcionCa: "Instal·lació de 6 finestres Cortizo A-70 amb vidre baix emissiu en un pis de 90m² a primera línia de mar. Reducció del soroll exterior de 38 dB (51% de reducció).",
      descripcionEs: "Instalación de 6 ventanas Cortizo A-70 con vidrio bajo emisivo en un piso de 90m² en primera línea de mar. Reducción del ruido exterior de 38 dB (51% de reducción).",
      descripcionEn: "Installation of 6 Cortizo A-70 windows with low-emissivity glass in a 90m² apartment on the seafront. 38 dB exterior noise reduction (51% reduction).",
      localidad: "Blanes",
      tipoInmueble: "Pis",
      productosUsados: "Cortizo A-70, Persiana compacta",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80"],
      destacado: true,
      published: true,
    },
    {
      tituloCa: "Porta corredissa elevable a Lloret de Mar",
      tituloEs: "Puerta corredera elevable en Lloret de Mar",
      tituloEn: "Lift-and-slide door in Lloret de Mar",
      descripcionCa: "Instal·lació d'una gran porta corredissa elevable de 3 metres amb vidre triple per a un saló amb vistes al jardí. Màxima lluminositat i aïllament.",
      descripcionEs: "Instalación de una gran puerta corredera elevable de 3 metros con vidrio triple para un salón con vistas al jardín. Máxima luminosidad y aislamiento.",
      descripcionEn: "Installation of a large 3-metre lift-and-slide door with triple glazing for a living room overlooking the garden. Maximum light and insulation.",
      localidad: "Lloret de Mar",
      tipoInmueble: "Casa",
      productosUsados: "Cortizo Sliding Premium",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
      destacado: true,
      published: true,
    },
    {
      tituloCa: "Persianes motoritzades a Girona centre",
      tituloEs: "Persianas motorizadas en Girona centro",
      tituloEn: "Motorised shutters in Girona city centre",
      descripcionCa: "Substitució de persianes antigues per persianes motoritzades amb comandament a distància en un edifici del Barri Vell. 8 finestres renovades.",
      descripcionEs: "Sustitución de persianas antiguas por persianas motorizadas con mando a distancia en un edificio del Barri Vell. 8 ventanas renovadas.",
      descripcionEn: "Replacement of old shutters with remote-controlled motorised shutters in a Barri Vell building. 8 windows renovated.",
      localidad: "Girona",
      tipoInmueble: "Pis",
      productosUsados: "Persiana motoritzada, Cortizo C-70",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"],
      destacado: false,
      published: true,
    },
    {
      tituloCa: "Casa passiva amb finestres Cortizo E-170 a Figueres",
      tituloEs: "Casa pasiva con ventanas Cortizo E-170 en Figueres",
      tituloEn: "Passive house with Cortizo E-170 windows in Figueres",
      descripcionCa: "Projecte de rehabilitació energètica amb finestres d'altes prestacions. Valor Uf de 0.9 W/m²K (marc), Uw ≤ 0.8 W/m²K amb triple vidre. Certificació energètica A.",
      descripcionEs: "Proyecto de rehabilitación energética con ventanas de altas prestaciones. Valor Uf de 0.9 W/m²K (marco), Uw ≤ 0.8 W/m²K con triple acristalamiento. Certificación energética A.",
      descripcionEn: "Energy renovation project with high-performance windows. Uf value 0.9 W/m²K (frame), Uw ≤ 0.8 W/m²K with triple glazing. Energy certification A.",
      localidad: "Figueres",
      tipoInmueble: "Casa",
      productosUsados: "Cortizo E-170, Vidre triple",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=800&q=80"],
      destacado: true,
      published: true,
    },
    {
      tituloCa: "Mosquiteres a mida per a xalet a Tossa de Mar",
      tituloEs: "Mosquiteras a medida para chalet en Tossa de Mar",
      tituloEn: "Custom mosquito screens for a villa in Tossa de Mar",
      descripcionCa: "Instal·lació de 12 mosquiteres (corredisses i plissades) en un xalet amb jardí. Protecció total sense renunciar a la ventilació natural.",
      descripcionEs: "Instalación de 12 mosquiteras (correderas y plisadas) en un chalet con jardín. Protección total sin renunciar a la ventilación natural.",
      descripcionEn: "Installation of 12 mosquito screens (sliding and pleated) in a villa with garden. Full protection without sacrificing natural ventilation.",
      localidad: "Tossa de Mar",
      tipoInmueble: "Xalet",
      productosUsados: "Mosquitera corredissa, Mosquitera plissada",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
      destacado: false,
      published: true,
    },
    {
      tituloCa: "Renovació integral de comunitat a Mataró",
      tituloEs: "Renovación integral de comunidad en Mataró",
      tituloEn: "Full community renovation in Mataró",
      descripcionCa: "Projecte per a una comunitat de 24 veïns. 72 finestres, 48 persianes i 36 mosquiteres instal·lades en 3 setmanes. Estalvi energètic del 40%.",
      descripcionEs: "Proyecto para una comunidad de 24 vecinos. 72 ventanas, 48 persianas y 36 mosquiteras instaladas en 3 semanas. Ahorro energético del 40%.",
      descripcionEn: "Project for a 24-resident community. 72 windows, 48 shutters, and 36 mosquito screens installed in 3 weeks. 40% energy savings.",
      localidad: "Mataró",
      tipoInmueble: "Comunitat",
      productosUsados: "Cortizo A-70, Persiana compacta, Mosquitera",
      fotosAntes: [],
      fotosDespues: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"],
      destacado: true,
      published: true,
    },
  ];

  for (const p of portfolioData) {
    await db.insert(portfolio).values(p).onConflictDoNothing();
  }
  console.log("  6 Portfolio Projects OK");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
