import { db } from "./db.js";
import { blogPosts } from "@shared/schema";

const posts = [
  {
    slug: "soroll-casa-solucions-aillament-acustic",
    tituloCa: "Tens soroll a casa? Solucions d'aillament acustic amb finestres PVC",
    tituloEs: "Tienes ruido en casa? Soluciones de aislamiento acustico con ventanas PVC",
    tituloEn: "Too much noise at home? Acoustic insulation solutions with PVC windows",
    contenidoCa: `<h2>Per que sento tant soroll a casa?</h2>
<p>El soroll es un dels problemes mes frequeents en habitatges de Catalunya, especialment a zones costaneres amb turisme, carreteres transitades o aeroports propers. El 80% del soroll exterior entra per les <strong>finestres i portes</strong>.</p>

<h3>Com es mesura l'aillament acustic?</h3>
<p>L'aillament acustic es mesura en decibels (dB). Una finestra de PVC moderna pot reduir el soroll entre <strong>32 dB i 47 dB</strong>, depenent del vidre i el perfil:</p>
<ul>
<li><strong>Vidre simple 4mm:</strong> 28 dB de reduccio</li>
<li><strong>Doble vidre 4/16/4:</strong> 32 dB de reduccio</li>
<li><strong>Doble vidre acustic 6/16/4:</strong> 38 dB de reduccio</li>
<li><strong>Triple vidre amb laminar acustic:</strong> 42-47 dB de reduccio</li>
</ul>

<h3>La importancia del perfil PVC</h3>
<p>El vidre es important, pero el perfil tambe juga un paper clau. Els perfils Cortizo de 5 cambres amb junta de EPDM ofereixen una estanqueitat superior a l'alumini:</p>
<ul>
<li>Les <strong>cambres d'aire</strong> dins el perfil actuen com a barreres acustiques</li>
<li>El PVC es un material amb <strong>baixa conductivitat sonora</strong> (molt inferior a l'alumini)</li>
<li>Les juntes perimentrals dobles eliminen filtracions d'aire i soroll</li>
</ul>

<h3>Solucions segons el teu nivell de soroll</h3>
<p><strong>Soroll moderat</strong> (carrer residencial, 50-60 dB): doble vidre estandard amb perfil Cortizo C-70 es suficient. Inversio aproximada: 250-400eur per finestra.</p>
<p><strong>Soroll alt</strong> (avinguda principal, 60-70 dB): vidre acustic laminar 6/16/4 amb perfil A-70. Aconseguiras un interior per sota dels 35 dB. Inversio: 350-550eur per finestra.</p>
<p><strong>Soroll molt alt</strong> (aeroport, discoteca propera, >70 dB): triple vidre amb laminar acustic i perfil de 6 cambres. Reduccio fins a 47 dB. Inversio: 500-750eur per finestra.</p>

<h3>Casos reals a la Costa Brava</h3>
<p>Un client de Lloret de Mar vivia al costat d'una discoteca. Amb finestres Cortizo A-70 i vidre acustic 44.2/20/6, va passar de 72 dB dins la casa a 30 dB. "Es com viure en un altre pis", ens va dir.</p>

<h3>Demanar pressupost acustic</h3>
<p>Cada situacio es diferent. Fes servir el nostre <a href="/ca/pressupost">calculador de pressupost</a> o contacta'ns per una visita tecnica gratuita on mesurem el soroll real del teu habitatge.</p>`,
    contenidoEs: `<h2>Por que escucho tanto ruido en casa?</h2>
<p>El ruido es uno de los problemas mas frecuentes en viviendas de Cataluna, especialmente en zonas costeras con turismo, carreteras transitadas o aeropuertos cercanos. El 80% del ruido exterior entra por las <strong>ventanas y puertas</strong>.</p>

<h3>Como se mide el aislamiento acustico?</h3>
<p>El aislamiento acustico se mide en decibelios (dB). Una ventana de PVC moderna puede reducir el ruido entre <strong>32 dB y 47 dB</strong>, dependiendo del vidrio y el perfil.</p>

<h3>La importancia del perfil PVC</h3>
<p>El vidrio es importante, pero el perfil tambien juega un papel clave. Los perfiles Cortizo de 5 camaras con junta EPDM ofrecen una estanqueidad superior al aluminio.</p>

<h3>Pide presupuesto acustico</h3>
<p>Cada situacion es diferente. Usa nuestro <a href="/es/presupuesto">calculador de presupuesto</a> o contactanos para una visita tecnica gratuita donde medimos el ruido real de tu vivienda.</p>`,
    contenidoEn: `<h2>Why is my home so noisy?</h2>
<p>Noise is one of the most common problems in homes in Catalonia, especially in coastal tourist areas, busy roads, or near airports. 80% of exterior noise enters through <strong>windows and doors</strong>.</p>

<h3>How is acoustic insulation measured?</h3>
<p>Acoustic insulation is measured in decibels (dB). A modern PVC window can reduce noise between <strong>32 dB and 47 dB</strong>, depending on the glass and profile.</p>

<h3>Request an acoustic quote</h3>
<p>Every situation is different. Use our <a href="/en/quote">quote calculator</a> or contact us for a free technical visit where we measure your home's actual noise levels.</p>`,
    extractoCa: "Guia completa sobre aillament acustic amb finestres PVC: tipus de vidre, perfils Cortizo i solucions segons el nivell de soroll del teu habitatge.",
    extractoEs: "Guia completa sobre aislamiento acustico con ventanas PVC: tipos de vidrio, perfiles Cortizo y soluciones segun el nivel de ruido de tu vivienda.",
    extractoEn: "Complete guide to acoustic insulation with PVC windows: glass types, Cortizo profiles, and solutions based on your home's noise level.",
    categoria: "Guies",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Aillament acustic amb finestres PVC: solucions per al soroll | Ara Finestra",
    metaTitleEs: "Aislamiento acustico con ventanas PVC: soluciones para el ruido | Ara Finestra",
    metaTitleEn: "Acoustic insulation with PVC windows: noise solutions | Ara Finestra",
    metaDescriptionCa: "Descobreix com les finestres PVC Cortizo redueixen el soroll fins a 47 dB. Guia amb solucions per nivell de soroll i preus orientatius.",
    metaDescriptionEs: "Descubre como las ventanas PVC Cortizo reducen el ruido hasta 47 dB. Guia con soluciones por nivel de ruido y precios orientativos.",
    metaDescriptionEn: "Discover how Cortizo PVC windows reduce noise by up to 47 dB. Guide with solutions by noise level and indicative prices.",
    published: true,
    publishedAt: new Date("2026-02-20"),
  },
  {
    slug: "quant-costa-canviar-finestres-pvc-2026",
    tituloCa: "Quant costa canviar les finestres a PVC el 2026? Preus reals",
    tituloEs: "Cuanto cuesta cambiar las ventanas a PVC en 2026? Precios reales",
    tituloEn: "How much does it cost to replace windows with PVC in 2026? Real prices",
    contenidoCa: `<h2>Preus reals de finestres PVC el 2026</h2>
<p>Una de les preguntes mes frequents que rebem es: "quant em costaran les finestres noves?" La resposta depeen de molts factors, pero aqui tens una <strong>guia de preus reals</strong> basada en les nostres instal.lacions recents a la provincia de Girona.</p>

<h3>Factors que determinen el preu</h3>
<ul>
<li><strong>Mida de la finestra:</strong> una finestra estandard (120x120cm) no costa el mateix que un gran finestrall (200x220cm)</li>
<li><strong>Tipus d'obertura:</strong> practicable, oscil.lobatent, corredissa, elevable...</li>
<li><strong>Serie del perfil:</strong> C-70 (gama mitja) vs A-70 (gama alta) vs Cor-Vision (premium)</li>
<li><strong>Tipus de vidre:</strong> doble, triple, baix emissiu, acustic, de seguretat</li>
<li><strong>Acabat:</strong> blanc estandard, foliats imitacio fusta, colors RAL</li>
<li><strong>Accessoris:</strong> persiana, mosquitera, reixes, motoritzacio</li>
</ul>

<h3>Taula de preus orientatius 2026</h3>
<table>
<tr><th>Producte</th><th>Mida</th><th>Preu (IVA inclos)</th></tr>
<tr><td>Finestra practicable C-70</td><td>120x120cm</td><td>350-500eur</td></tr>
<tr><td>Finestra oscil.lobatent A-70</td><td>120x120cm</td><td>450-650eur</td></tr>
<tr><td>Balconera 2 fulles</td><td>160x210cm</td><td>700-1.000eur</td></tr>
<tr><td>Porta corredissa elevable</td><td>300x220cm</td><td>2.500-4.000eur</td></tr>
<tr><td>Persiana compacta PVC</td><td>120cm</td><td>180-280eur</td></tr>
<tr><td>Mosquitera enrotllable</td><td>120x120cm</td><td>80-150eur</td></tr>
</table>

<h3>Exemple real: pis de 3 habitacions a Blanes</h3>
<p>Pressupost real per a un pis de 80m2 amb 5 finestres i 1 balconera:</p>
<ul>
<li>3 finestres oscil.lobatent A-70 (120x120): 1.650eur</li>
<li>2 finestres bany (60x80): 500eur</li>
<li>1 balconera 2 fulles (180x210): 900eur</li>
<li>5 persianes compactes: 1.100eur</li>
<li>Desmuntatge i retirada antigues: 300eur</li>
<li>Instal.lacio professional: inclos</li>
<li><strong>TOTAL: 4.450eur (IVA inclos)</strong></li>
</ul>

<h3>Com estalviar en finestres PVC</h3>
<ul>
<li><strong>Subvencions Next Generation:</strong> fins al 40% del cost (consulta <a href="/ca/subvencions">la nostra guia</a>)</li>
<li><strong>Deduccio IRPF:</strong> fins a 5.000eur en obres de millora energetica</li>
<li><strong>Financament:</strong> oferim financament fins a 24 mesos sense interessos</li>
</ul>

<h3>Per que no comparar nomes pel preu</h3>
<p>La diferencia entre una instal.lacio professional i una de low-cost pot suposar:</p>
<ul>
<li>Filtracions d'aigua i aire per mals segellats</li>
<li>Condensacio per ponts termics no resolts</li>
<li>Ferramentes de baixa qualitat que fallen als 2-3 anys</li>
<li>Sense garantia real ni servei postvenda</li>
</ul>
<p>A ARA FINESTRA oferim <strong>10 anys de garantia</strong> en tots els nostres productes i instal.lacions.</p>`,
    contenidoEs: `<h2>Precios reales de ventanas PVC en 2026</h2>
<p>Una de las preguntas mas frecuentes que recibimos es: "cuanto me costaran las ventanas nuevas?" La respuesta depende de muchos factores, pero aqui tienes una <strong>guia de precios reales</strong> basada en nuestras instalaciones recientes en la provincia de Girona.</p>

<h3>Tabla de precios orientativos 2026</h3>
<p>Ventana practicable C-70 (120x120cm): 350-500eur. Ventana oscilobatiente A-70: 450-650eur. Balconera 2 hojas: 700-1.000eur. Corredera elevable: 2.500-4.000eur.</p>

<h3>Como ahorrar</h3>
<p>Subvenciones Next Generation (hasta 40%), deduccion IRPF y financiacion sin intereses hasta 24 meses.</p>`,
    contenidoEn: `<h2>Real PVC window prices in 2026</h2>
<p>One of the most frequent questions we receive is: "how much will new windows cost?" The answer depends on many factors, but here is a <strong>real price guide</strong> based on our recent installations in Girona province.</p>

<h3>2026 indicative price table</h3>
<p>Casement window C-70 (120x120cm): 350-500EUR. Tilt-and-turn A-70: 450-650EUR. 2-leaf balcony door: 700-1,000EUR. Lift-and-slide: 2,500-4,000EUR.</p>`,
    extractoCa: "Preus reals de finestres PVC el 2026: taula orientativa, exemple de pressupost per a un pis i consells per estalviar amb subvencions.",
    extractoEs: "Precios reales de ventanas PVC en 2026: tabla orientativa, ejemplo de presupuesto para un piso y consejos para ahorrar con subvenciones.",
    extractoEn: "Real PVC window prices in 2026: indicative table, apartment budget example and tips for saving with subsidies.",
    categoria: "Preus",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Quant costa canviar finestres PVC 2026? Preus reals | Ara Finestra",
    metaTitleEs: "Cuanto cuesta cambiar ventanas PVC 2026? Precios reales | Ara Finestra",
    metaTitleEn: "PVC window replacement cost 2026: real prices | Ara Finestra",
    metaDescriptionCa: "Preus reals de finestres PVC el 2026 a Girona. Taula de preus, exemple de pressupost i com estalviar amb subvencions Next Generation.",
    metaDescriptionEs: "Precios reales de ventanas PVC en 2026 en Girona. Tabla de precios, ejemplo de presupuesto y como ahorrar con subvenciones Next Generation.",
    metaDescriptionEn: "Real PVC window prices in 2026 in Girona. Price table, budget example and how to save with Next Generation subsidies.",
    published: true,
    publishedAt: new Date("2026-02-15"),
  },
  {
    slug: "persianes-motoritzades-pvc-guia-completa",
    tituloCa: "Persianes motoritzades de PVC: guia completa 2026",
    tituloEs: "Persianas motorizadas de PVC: guia completa 2026",
    tituloEn: "Motorized PVC roller shutters: complete guide 2026",
    contenidoCa: `<h2>Tot el que necessites saber sobre persianes motoritzades</h2>
<p>Les persianes motoritzades son un dels complements mes demandats en les nostres instal.lacions. Combinen <strong>comoditat, seguretat i eficiencia energetica</strong> en un sol element.</p>

<h3>Tipus de motoritzacio</h3>
<ul>
<li><strong>Motor tubular estandard:</strong> s'instal.la dins l'eix de la persiana. Accionament per polsador de paret. Preu: 150-250eur per unitat.</li>
<li><strong>Motor amb receptor radio:</strong> permet control per comandament a distancia. Ideal per a finestres de dificil acces. Preu: 200-350eur.</li>
<li><strong>Motor intel.ligent (WiFi):</strong> control des del mobil, programacio horaria, integració amb Alexa/Google Home. Preu: 280-450eur.</li>
</ul>

<h3>Avantatges de la motoritzacio</h3>
<ul>
<li><strong>Comoditat:</strong> puja i baixa totes les persianes amb un sol botó o des del mobil</li>
<li><strong>Seguretat:</strong> programacio horaria simula presencia quan ets de vacances</li>
<li><strong>Eficiencia:</strong> programar l'obertura/tancament optimitza la temperatura natural</li>
<li><strong>Durabilitat:</strong> la cinta de la persiana es el primer element que falla. Sense cinta, sense problemes</li>
<li><strong>Accessibilitat:</strong> ideal per a persones grans o amb mobilitat reduida</li>
</ul>

<h3>Es pot motoritzar una persiana existent?</h3>
<p>Si, en la majoria de casos. Si la persiana es de PVC o alumini i el caixo te espai suficient, es pot instal.lar un motor tubular sense canviar la persiana. El proces dura unes 2 hores per finestra.</p>

<h3>La nostra recomanacio</h3>
<p>Per a obra nova o renovacio completa, recomanem el <strong>motor intel.ligent amb WiFi</strong>. La diferencia de preu es petita i la comoditat de controlar-ho tot des del mobil es inigualable. A mes, es pot integrar amb sistemes de domoetica existents.</p>`,
    contenidoEs: `<h2>Todo lo que necesitas saber sobre persianas motorizadas</h2>
<p>Las persianas motorizadas son uno de los complementos mas demandados en nuestras instalaciones. Combinan <strong>comodidad, seguridad y eficiencia energetica</strong> en un solo elemento.</p>

<h3>Tipos de motorizacion</h3>
<p>Motor tubular estandar (150-250eur), motor con receptor radio (200-350eur), motor inteligente WiFi (280-450eur).</p>

<h3>Se puede motorizar una persiana existente?</h3>
<p>Si, en la mayoria de casos. Si la persiana es de PVC o aluminio y el cajon tiene espacio suficiente, se puede instalar un motor tubular sin cambiar la persiana.</p>`,
    contenidoEn: `<h2>Everything you need to know about motorized shutters</h2>
<p>Motorized shutters are one of the most requested accessories in our installations. They combine <strong>comfort, security, and energy efficiency</strong> in one element.</p>

<h3>Types of motorization</h3>
<p>Standard tubular motor (150-250EUR), radio receiver motor (200-350EUR), smart WiFi motor (280-450EUR).</p>`,
    extractoCa: "Guia completa sobre persianes motoritzades de PVC: tipus de motors, preus, avantatges i com motoritzar persianes existents.",
    extractoEs: "Guia completa sobre persianas motorizadas de PVC: tipos de motores, precios, ventajas y como motorizar persianas existentes.",
    extractoEn: "Complete guide to motorized PVC shutters: motor types, prices, advantages and how to motorize existing shutters.",
    categoria: "Productes",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Persianes motoritzades PVC: guia completa i preus 2026 | Ara Finestra",
    metaTitleEs: "Persianas motorizadas PVC: guia completa y precios 2026 | Ara Finestra",
    metaTitleEn: "Motorized PVC shutters: complete guide and prices 2026 | Ara Finestra",
    metaDescriptionCa: "Tot sobre persianes motoritzades de PVC: tipus de motors, preus, avantatges i possibilitat de motoritzar persianes existents. Guia 2026.",
    metaDescriptionEs: "Todo sobre persianas motorizadas de PVC: tipos de motores, precios, ventajas y posibilidad de motorizar persianas existentes. Guia 2026.",
    metaDescriptionEn: "Everything about motorized PVC shutters: motor types, prices, advantages and the possibility of motorizing existing shutters. 2026 guide.",
    published: true,
    publishedAt: new Date("2026-02-10"),
  },
  {
    slug: "certificat-energetic-finestres-com-millorar",
    tituloCa: "Com millorar el certificat energetic de casa teva amb finestres PVC",
    tituloEs: "Como mejorar el certificado energetico de tu casa con ventanas PVC",
    tituloEn: "How to improve your home energy certificate with PVC windows",
    contenidoCa: `<h2>Que es el certificat energetic i per que importa?</h2>
<p>El certificat d'eficiencia energetica (CEE) es obligatori per vendre o llogar un habitatge a Espanya. Classifica l'immoble de la <strong>A (mes eficient) a la G (menys eficient)</strong>. La majoria de pisos a Catalunya son classe E, F o G.</p>

<h3>Com afecten les finestres al certificat?</h3>
<p>Les finestres representen entre el <strong>25% i el 40% de les perdues energetiques</strong> d'un habitatge. El certificat energetic avalua:</p>
<ul>
<li><strong>Transmitancia termica (valor U):</strong> quanta calor passa a traves de la finestra. Finestres antigues d'alumini: U=5.7 W/m2K. Finestres PVC amb doble vidre: U=1.2-1.4 W/m2K</li>
<li><strong>Factor solar (g):</strong> quanta energia solar entra. Important per controlar la calor a l'estiu</li>
<li><strong>Permeabilitat a l'aire:</strong> quantes filtracions te la finestra. Les finestres PVC assoleixen Classe 4 (la mes alta)</li>
</ul>

<h3>Quantes lletres puc millorar?</h3>
<p>Canviar les finestres pot millorar el certificat entre <strong>1 i 3 lletres</strong>:</p>
<ul>
<li>De G a E/D: canviant finestres d'alumini sense RPT per PVC amb doble vidre</li>
<li>De F a D/C: PVC amb triple vidre o vidre baix emissiu</li>
<li>De E a C/B: combinant finestres PVC + aillament de fatxada + caldera eficient</li>
</ul>

<h3>Impacte economic</h3>
<ul>
<li><strong>Estalvi en calefaccio:</strong> entre 200 i 500eur anuals, depenent de la superficie</li>
<li><strong>Valor de l'immoble:</strong> un certificat A o B pot incrementar el valor entre un 5% i 15%</li>
<li><strong>Lloguer:</strong> pisos amb bon certificat es lloguen mes rapid i a millor preu</li>
<li><strong>Subvencions:</strong> millorar el certificat es requisit per accedir als fons Next Generation</li>
</ul>

<h3>El nostre servei de millora energetica</h3>
<p>A ARA FINESTRA oferim un servei integral: mesurem les teves finestres actuals, calculem la millora esperada al certificat i tramitem les subvencions disponibles. <a href="/ca/contacte">Contacta'ns</a> per una avaluacio gratuita.</p>`,
    contenidoEs: `<h2>Que es el certificado energetico y por que importa?</h2>
<p>El certificado de eficiencia energetica (CEE) es obligatorio para vender o alquilar una vivienda en Espana. Clasifica el inmueble de la <strong>A (mas eficiente) a la G (menos eficiente)</strong>.</p>

<h3>Como afectan las ventanas al certificado?</h3>
<p>Las ventanas representan entre el 25% y el 40% de las perdidas energeticas de una vivienda. Cambiar las ventanas puede mejorar el certificado entre 1 y 3 letras.</p>

<h3>Nuestro servicio de mejora energetica</h3>
<p>En ARA FINESTRA ofrecemos un servicio integral: medimos tus ventanas actuales, calculamos la mejora esperada y tramitamos las subvenciones disponibles.</p>`,
    contenidoEn: `<h2>What is the energy certificate and why does it matter?</h2>
<p>The Energy Performance Certificate (EPC) is mandatory for selling or renting a property in Spain. It classifies the property from <strong>A (most efficient) to G (least efficient)</strong>.</p>

<h3>How do windows affect the certificate?</h3>
<p>Windows account for 25-40% of a home's energy losses. Replacing windows can improve the certificate by 1 to 3 grades.</p>`,
    extractoCa: "Com les finestres PVC milloren el certificat energetic: impacte en la classificacio, estalvi annual i accés a subvencions Next Generation.",
    extractoEs: "Como las ventanas PVC mejoran el certificado energetico: impacto en la clasificacion, ahorro anual y acceso a subvenciones Next Generation.",
    extractoEn: "How PVC windows improve the energy certificate: impact on classification, annual savings and access to Next Generation subsidies.",
    categoria: "Eficiencia",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Millorar el certificat energetic amb finestres PVC | Ara Finestra",
    metaTitleEs: "Mejorar el certificado energetico con ventanas PVC | Ara Finestra",
    metaTitleEn: "Improve your energy certificate with PVC windows | Ara Finestra",
    metaDescriptionCa: "Descobreix com canviar les finestres a PVC pot millorar el teu certificat energetic entre 1 i 3 lletres. Estalvi, valor immobiliari i subvencions.",
    metaDescriptionEs: "Descubre como cambiar las ventanas a PVC puede mejorar tu certificado energetico entre 1 y 3 letras. Ahorro, valor inmobiliario y subvenciones.",
    metaDescriptionEn: "Discover how replacing windows with PVC can improve your energy certificate by 1 to 3 grades. Savings, property value and subsidies.",
    published: true,
    publishedAt: new Date("2026-02-05"),
  },
  {
    slug: "errors-frequents-comprar-finestres",
    tituloCa: "7 errors frequents al comprar finestres (i com evitar-los)",
    tituloEs: "7 errores frecuentes al comprar ventanas (y como evitarlos)",
    tituloEn: "7 common mistakes when buying windows (and how to avoid them)",
    contenidoCa: `<h2>No cometis aquests errors al canviar les finestres</h2>
<p>Despres de mes de 500 instal.lacions, hem vist repetidament els mateixos errors. Aqui tens els 7 mes frequents i com evitar-los.</p>

<h3>1. Triar nomes pel preu</h3>
<p>El preu mes baix sovint amaga: perfils de baixa qualitat (3 cambres en lloc de 5), vidres sense tractament baix emissiu, ferramentes generiques que fallen als 2 anys, i instal.ladors sense experiencia que deixen ponts termics.</p>

<h3>2. No considerar el tipus d'obertura adequat</h3>
<p>Cada espai te un tipus d'obertura optim. Una finestra practicable en un bany petit es un error (no podras obrir-la amb mobles a prop). L'oscil.lobatent es gairebe sempre la millor opcio: ventilacio segura sense obrir del tot.</p>

<h3>3. Ignorar l'aillament acustic</h3>
<p>Si vius a prop d'una carretera o zona turistica, el vidre estandard no sera suficient. Invertir 50-80eur mes per finestra en vidre acustic pot canviar radicalment la teva qualitat de vida.</p>

<h3>4. Oblidar les persianes</h3>
<p>Si canvies les finestres pero mantens les persianes antigues, perdras gran part de l'aillament. Les persianes compactes de PVC s'integren perfectament i eliminen ponts termics al caixo.</p>

<h3>5. No verificar certificacions</h3>
<p>Exigeix sempre el <strong>marcatge CE</strong>, la <strong>classe de permeabilitat a l'aire</strong> (ha de ser Classe 4) i la <strong>transmitancia termica</strong> documentada. Sense certificacions, no pots accedir a subvencions.</p>

<h3>6. Contractar sense visita tecnica previa</h3>
<p>Un pressupost "a ull" pot derivar en sorpreses: mides incorrectes, problemes estructurals no detectats, o accessoris necessaris no inclosos. Insisteix en una visita tecnica gratuita abans de signar res.</p>

<h3>7. No preguntar per la garantia i el servei postvenda</h3>
<p>Una finestra de PVC hauria de durar 40-50 anys, pero les ferramentes i juntes necessiten manteniment. Assegura't que l'empresa ofereix:</p>
<ul>
<li>Garantia minima de 10 anys en perfil i vidre</li>
<li>Garantia de 5 anys en ferramentes</li>
<li>Servei de manteniment i reparacio postinstal.lacio</li>
<li>Empresa local amb taller propi (no intermediaris)</li>
</ul>

<h3>La nostra garantia</h3>
<p>A ARA FINESTRA oferim 10 anys de garantia total, servei postvenda local i visita tecnica gratuita abans de cada pressupost. <a href="/ca/pressupost">Calcula el teu pressupost</a> o <a href="/ca/contacte">parla amb nosaltres</a>.</p>`,
    contenidoEs: `<h2>No cometas estos errores al cambiar las ventanas</h2>
<p>Despues de mas de 500 instalaciones, hemos visto repetidamente los mismos errores. Aqui tienes los 7 mas frecuentes y como evitarlos.</p>

<h3>Los 7 errores</h3>
<p>1. Elegir solo por precio. 2. No considerar el tipo de apertura. 3. Ignorar el aislamiento acustico. 4. Olvidar las persianas. 5. No verificar certificaciones. 6. Contratar sin visita tecnica. 7. No preguntar por la garantia.</p>

<h3>Nuestra garantia</h3>
<p>En ARA FINESTRA ofrecemos 10 anos de garantia total, servicio postventa local y visita tecnica gratuita.</p>`,
    contenidoEn: `<h2>Don't make these mistakes when replacing windows</h2>
<p>After more than 500 installations, we've seen the same mistakes repeatedly. Here are the 7 most common and how to avoid them.</p>

<h3>The 7 mistakes</h3>
<p>1. Choosing only by price. 2. Wrong opening type. 3. Ignoring acoustic insulation. 4. Forgetting shutters. 5. No certifications. 6. No technical visit. 7. No warranty check.</p>`,
    extractoCa: "Els 7 errors mes frequents al comprar finestres: triar nomes pel preu, ignorar l'acustica, oblidar persianes i mes. Consells d'experts.",
    extractoEs: "Los 7 errores mas frecuentes al comprar ventanas: elegir solo por precio, ignorar la acustica, olvidar persianas y mas. Consejos de expertos.",
    extractoEn: "The 7 most common mistakes when buying windows: choosing by price alone, ignoring acoustics, forgetting shutters and more. Expert advice.",
    categoria: "Consells",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "7 errors frequents al comprar finestres: com evitar-los | Ara Finestra",
    metaTitleEs: "7 errores frecuentes al comprar ventanas: como evitarlos | Ara Finestra",
    metaTitleEn: "7 common mistakes when buying windows: how to avoid them | Ara Finestra",
    metaDescriptionCa: "Descobreix els 7 errors mes habituals al canviar finestres i com evitar-los. Guia practica d'experts en finestres PVC a Girona.",
    metaDescriptionEs: "Descubre los 7 errores mas habituales al cambiar ventanas y como evitarlos. Guia practica de expertos en ventanas PVC en Girona.",
    metaDescriptionEn: "Discover the 7 most common mistakes when replacing windows and how to avoid them. Practical expert guide for PVC windows in Girona.",
    published: true,
    publishedAt: new Date("2026-01-28"),
  },
];

async function seedBlogExtra() {
  console.log("Seeding 5 extra blog posts...");
  for (const post of posts) {
    await db.insert(blogPosts).values(post).onConflictDoNothing({ target: blogPosts.slug });
    console.log(`  Blog: ${post.slug}`);
  }
  console.log("Done!");
  process.exit(0);
}

seedBlogExtra().catch(console.error);
