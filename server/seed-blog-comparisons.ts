import { db } from "./db.js";
import { blogPosts } from "@shared/schema";

const articles = [
  // ── 1. Oscilobatents vs corredisses ──────────────────────────
  {
    slug: "finestres-oscilobatents-vs-corredisses",
    tituloCa: "Finestres oscilobatents vs corredisses: quina tria es millor?",
    tituloEs: "Ventanas oscilobatientes vs correderas: cual es mejor?",
    tituloEn: "Tilt-and-turn vs sliding windows: which is the better choice?",
    contenidoCa: `<h2>Dues opcions, dues filosofies</h2>
<p>Quan un client ens demana pressupost a ARA FINESTRA, una de les primeres decisions que ha de prendre es el tipus d'obertura. A la provincia de Girona les dues opcions mes populars son la <strong>finestra oscilobatent</strong> i la <strong>finestra corredissa</strong>. Cadascuna te avantatges reals, pero tambe limitacions que cal coneixer abans de decidir.</p>

<h3>Com funciona cada sistema?</h3>
<p>La finestra <strong>oscilobatent</strong> te dos moviments: s'obre com una porta cap a l'interior (batent) o s'inclina per la part superior per ventilar (oscil·lant). Utilitza un mecanisme perimetral amb punts de tancament multiples — el perfil Cortizo C-70 incorpora fins a 8 punts de tancament per fulla.</p>
<p>La finestra <strong>corredissa</strong> llisca horitzontalment sobre un carril. El model Cortizo E-170 utilitza rodaments d'acer inoxidable i un sistema de tancat per pressio que millora l'estanqueitat respecte a les corredisses antigues.</p>

<h3>Aillament termic: la diferencia es clara</h3>
<p>Aqui no hi ha discussio. Una oscilobatent amb perfil Cortizo C-70 aconsegueix un valor <strong>Uf de 1,3 W/m2K</strong>, amb juntes perimentrals que pressionen contra el marc quan es tanca. El segellat es gairebe hermatic.</p>
<p>Una corredissa, per disseny, necessita un espai entre la fulla i el marc perque pugui lliscar. Fins i tot el model elevable Cortizo E-170 HI, que es el mes aillant de la gamma, te un <strong>Uf d'uns 1,8 W/m2K</strong>. La diferencia sembla petita, pero en una casa amb 8 finestres a Olot o la Garrotxa, on l'hivern arriba a -5°C, l'estalvi anual pot ser de 150-250 EUR nomes en calefaccio.</p>

<h3>Aillament acustic</h3>
<p>El mecanisme perimetral de l'oscilobatent tambe guanya en acustica. Amb vidre doble 4/16/4 aconsegueix <strong>35-38 dB de reduccio</strong>. Una corredissa amb el mateix vidre queda en <strong>28-32 dB</strong>. Si vius al costat d'una carretera principal a Blanes o a la Nacional II, la diferencia es notable.</p>

<h3>Espai i llum: el punt fort de la corredissa</h3>
<p>On la corredissa guanya clarament es en l'aprofitament de l'espai. No necessita cap area lliure per obrir-se — la fulla es desplaca lateralment. Aixo la fa ideal per a:</p>
<ul>
<li><strong>Terrasses i balcons</strong>: sortides al jardi o terrassa sense cap fulla que estorbi</li>
<li><strong>Cuines petites</strong>: on una finestra oberta cap a dins bloquejaria el pas</li>
<li><strong>Grans obertures</strong>: la corredissa E-170 permet fulles de fins a 3 metres d'alt i 1,5 metres d'ample</li>
</ul>
<p>A mes, les corredisses permeten buits mes grans i per tant mes entrada de llum natural, un factor important en pisos interiors de Girona o Salt.</p>

<h3>Preus orientatius (instal·lacio inclosa)</h3>
<p>Per una obertura estandard de 120 x 120 cm amb doble vidre baix emissiu:</p>
<ul>
<li><strong>Oscilobatent Cortizo C-70:</strong> 350 – 500 EUR per finestra</li>
<li><strong>Corredissa Cortizo E-170:</strong> 450 – 650 EUR per finestra</li>
<li><strong>Corredissa elevable E-170 HI:</strong> 900 – 1.400 EUR per finestra (per grans dimensions)</li>
</ul>
<p>La corredissa sol ser mes cara perque requereix mes perfil i un sistema de guia mes elaborat.</p>

<h3>Manteniment</h3>
<p>Ambdues opcions en PVC Cortizo requereixen poc manteniment: netejar les guies o juntes un cop l'any amb sabio neutre i lubricar els ferratges. Les corredisses necesiten una mica mes d'atencio al carril inferior, que acumula pols i sorra — especialment a primera linia de mar a Tossa o Lloret.</p>

<h3>Quina triar? Depeen de l'habitacio</h3>
<p>El nostre consell despres de centenars d'instal·lacions a la Costa Brava:</p>
<ul>
<li><strong>Dormitoris i salas d'estar:</strong> oscilobatent. L'aillament acustic i termic es prioritari on dorms i passes hores.</li>
<li><strong>Sortida a terrassa o jardi:</strong> corredissa o elevable. La comoditat d'us es imbatible.</li>
<li><strong>Cuina amb espai limitat:</strong> corredissa petita o oscilobatent amb fulla estreta.</li>
<li><strong>Bany:</strong> oscilobatent amb vidre opac — la funcio oscil·lant permet ventilar mantenint la privacitat.</li>
</ul>

<h3>Es poden combinar?</h3>
<p>Absolutament. La majoria dels nostres projectes a Girona combinen oscilobatents als dormitoris i corredisses a la sala o terrassa. Tots els perfils Cortizo comparteixen la mateixa estetica i gama de colors, aixi que la fatxada queda uniforme.</p>

<p>Vols saber quina combinacio es la millor per a casa teva? Fes servir el nostre <a href="/ca/pressupost">calculador de pressupost</a> o demana una visita tecnica gratuita.</p>`,

    contenidoEs: `<h2>Dos opciones, dos filosofias</h2>
<p>Cuando un cliente nos pide presupuesto en ARA FINESTRA, una de las primeras decisiones es el tipo de apertura. En la provincia de Girona las dos opciones mas populares son la <strong>ventana oscilobatiente</strong> y la <strong>ventana corredera</strong>. Cada una tiene ventajas reales, pero tambien limitaciones que conviene conocer antes de decidir.</p>

<h3>Como funciona cada sistema?</h3>
<p>La ventana <strong>oscilobatiente</strong> tiene dos movimientos: se abre como una puerta hacia el interior (batiente) o se inclina por la parte superior para ventilar (oscilante). Utiliza un mecanismo perimetral con multiples puntos de cierre — el perfil Cortizo C-70 incorpora hasta 8 puntos de cierre por hoja.</p>
<p>La ventana <strong>corredera</strong> se desliza horizontalmente sobre un carril. El modelo Cortizo E-170 utiliza rodamientos de acero inoxidable y un sistema de cierre por presion que mejora la estanqueidad respecto a las correderas antiguas.</p>

<h3>Aislamiento termico: la diferencia es clara</h3>
<p>Aqui no hay discusion. Una oscilobatiente con perfil Cortizo C-70 consigue un valor <strong>Uf de 1,3 W/m2K</strong>, con juntas perimetrales que presionan contra el marco al cerrarse. El sellado es practicamente hermetico.</p>
<p>Una corredera, por diseno, necesita un espacio entre la hoja y el marco para poder deslizarse. Incluso el modelo elevable Cortizo E-170 HI, el mas aislante de la gama, tiene un <strong>Uf de aproximadamente 1,8 W/m2K</strong>. La diferencia parece pequena, pero en una casa con 8 ventanas en Olot o la Garrotxa, donde el invierno llega a -5°C, el ahorro anual puede ser de 150-250 EUR solo en calefaccion.</p>

<h3>Aislamiento acustico</h3>
<p>El mecanismo perimetral de la oscilobatiente tambien gana en acustica. Con vidrio doble 4/16/4 consigue <strong>35-38 dB de reduccion</strong>. Una corredera con el mismo vidrio queda en <strong>28-32 dB</strong>. Si vives al lado de una carretera principal en Blanes o en la Nacional II, la diferencia es notable.</p>

<h3>Espacio y luz: el punto fuerte de la corredera</h3>
<p>Donde la corredera gana claramente es en el aprovechamiento del espacio. No necesita ningun area libre para abrirse — la hoja se desplaza lateralmente. Esto la hace ideal para:</p>
<ul>
<li><strong>Terrazas y balcones</strong>: salidas al jardin o terraza sin ninguna hoja que estorbe</li>
<li><strong>Cocinas pequenas</strong>: donde una ventana abierta hacia dentro bloquea el paso</li>
<li><strong>Grandes aberturas</strong>: la corredera E-170 permite hojas de hasta 3 metros de alto y 1,5 metros de ancho</li>
</ul>
<p>Ademas, las correderas permiten huecos mayores y por tanto mas entrada de luz natural, un factor importante en pisos interiores de Girona o Salt.</p>

<h3>Precios orientativos (instalacion incluida)</h3>
<p>Para una abertura estandar de 120 x 120 cm con doble vidrio bajo emisivo:</p>
<ul>
<li><strong>Oscilobatiente Cortizo C-70:</strong> 350 – 500 EUR por ventana</li>
<li><strong>Corredera Cortizo E-170:</strong> 450 – 650 EUR por ventana</li>
<li><strong>Corredera elevable E-170 HI:</strong> 900 – 1.400 EUR por ventana (para grandes dimensiones)</li>
</ul>

<h3>Cual elegir? Depende de la habitacion</h3>
<p>Nuestro consejo tras cientos de instalaciones en la Costa Brava:</p>
<ul>
<li><strong>Dormitorios y salones:</strong> oscilobatiente. El aislamiento acustico y termico es prioritario donde duermes y pasas horas.</li>
<li><strong>Salida a terraza o jardin:</strong> corredera o elevable. La comodidad de uso es inmejorable.</li>
<li><strong>Cocina con espacio limitado:</strong> corredera pequena o oscilobatiente con hoja estrecha.</li>
<li><strong>Bano:</strong> oscilobatiente con vidrio opaco — la funcion oscilante permite ventilar manteniendo la privacidad.</li>
</ul>

<p>Quieres saber que combinacion es la mejor para tu casa? Usa nuestro <a href="/es/presupuesto">calculador de presupuesto</a> o pide una visita tecnica gratuita.</p>`,

    contenidoEn: `<h2>Two options, two philosophies</h2>
<p>When a client asks for a quote at ARA FINESTRA, one of the first decisions is the opening type. In the province of Girona the two most popular choices are <strong>tilt-and-turn windows</strong> and <strong>sliding windows</strong>. Each has genuine advantages, but also limitations worth knowing before you decide.</p>

<h3>How does each system work?</h3>
<p>A <strong>tilt-and-turn</strong> window has two movements: it opens inward like a door (turn) or tilts at the top for ventilation (tilt). It uses a perimeter mechanism with multiple locking points — the Cortizo C-70 profile features up to 8 locking points per sash.</p>
<p>A <strong>sliding</strong> window glides horizontally along a track. The Cortizo E-170 model uses stainless steel bearings and a pressure-lock system that improves airtightness over older sliders.</p>

<h3>Thermal insulation: the difference is clear</h3>
<p>No contest here. A tilt-and-turn with Cortizo C-70 profile achieves a <strong>Uf value of 1.3 W/m2K</strong>, with perimeter gaskets pressing against the frame when closed. The seal is virtually airtight.</p>
<p>A slider, by design, needs clearance between sash and frame to move. Even the Cortizo E-170 HI lift-and-slide — the most insulating in the range — sits at around <strong>Uf 1.8 W/m2K</strong>. The gap looks small, but in a home with 8 windows in Olot or the Garrotxa area, where winter drops to -5°C, the annual saving can reach 150-250 EUR in heating alone.</p>

<h3>Acoustic insulation</h3>
<p>The perimeter mechanism of the tilt-and-turn also wins on acoustics. With double glazing 4/16/4 it achieves <strong>35-38 dB reduction</strong>. A slider with the same glass manages <strong>28-32 dB</strong>. If you live next to a main road in Blanes or the N-II highway, the difference is unmistakable.</p>

<h3>Space and light: the slider's strong suit</h3>
<p>Where the slider clearly wins is space efficiency. It needs no swing area — the sash moves sideways. This makes it ideal for:</p>
<ul>
<li><strong>Terraces and balconies</strong>: step out to the garden without any sash in the way</li>
<li><strong>Small kitchens</strong>: where an inward-opening window blocks the worktop</li>
<li><strong>Large openings</strong>: the E-170 allows sashes up to 3 metres tall and 1.5 metres wide</li>
</ul>
<p>Sliders also allow bigger openings and therefore more natural light — an important factor in inner-city apartments in Girona or Salt.</p>

<h3>Guide prices (installation included)</h3>
<p>For a standard 120 x 120 cm opening with double low-e glazing:</p>
<ul>
<li><strong>Tilt-and-turn Cortizo C-70:</strong> EUR 350 – 500 per window</li>
<li><strong>Sliding Cortizo E-170:</strong> EUR 450 – 650 per window</li>
<li><strong>Lift-and-slide E-170 HI:</strong> EUR 900 – 1,400 per window (for large dimensions)</li>
</ul>

<h3>Which to choose? It depends on the room</h3>
<p>Our advice after hundreds of installations along the Costa Brava:</p>
<ul>
<li><strong>Bedrooms and living rooms:</strong> tilt-and-turn. Acoustic and thermal insulation matters most where you sleep and spend hours.</li>
<li><strong>Terrace or garden access:</strong> sliding or lift-and-slide. Ease of use is unbeatable.</li>
<li><strong>Kitchen with limited space:</strong> small slider or tilt-and-turn with a narrow sash.</li>
<li><strong>Bathroom:</strong> tilt-and-turn with frosted glass — the tilt function lets you ventilate while keeping privacy.</li>
</ul>

<p>Want to know the best combination for your home? Use our <a href="/en/quote">quote calculator</a> or request a free site visit.</p>`,

    extractoCa: "Comparem finestres oscilobatents i corredisses: aillament termic i acustic, preus, espai necessari i quina tria per a cada habitacio de casa teva a Girona.",
    extractoEs: "Comparamos ventanas oscilobatientes y correderas: aislamiento termico y acustico, precios, espacio necesario y que elegir para cada habitacion de tu casa en Girona.",
    extractoEn: "We compare tilt-and-turn and sliding windows: thermal and acoustic insulation, prices, space requirements and which to choose for each room in your Girona home.",
    categoria: "guies",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Oscilobatents vs corredisses: comparativa | Ara Finestra",
    metaTitleEs: "Oscilobatientes vs correderas: comparativa | Ara Finestra",
    metaTitleEn: "Tilt-and-turn vs sliding windows compared | Ara Finestra",
    metaDescriptionCa: "Finestres oscilobatents o corredisses? Comparem aillament, preus i usos ideals amb perfils Cortizo C-70 i E-170 a Girona.",
    metaDescriptionEs: "Ventanas oscilobatientes o correderas? Comparamos aislamiento, precios y usos ideales con perfiles Cortizo C-70 y E-170 en Girona.",
    metaDescriptionEn: "Tilt-and-turn or sliding windows? We compare insulation, prices and ideal uses with Cortizo C-70 and E-170 profiles in Girona.",
    published: true,
    publishedAt: new Date("2026-03-10"),
  },

  // ── 2. Triple vidre vs doble vidre ───────────────────────────
  {
    slug: "triple-vidre-vs-doble-vidre",
    tituloCa: "Triple vidre vs doble vidre: val la pena la inversio?",
    tituloEs: "Triple vidrio vs doble vidrio: vale la pena la inversion?",
    tituloEn: "Triple glazing vs double glazing: is the investment worth it?",
    contenidoCa: `<h2>El debat del tercer vidre</h2>
<p>Des de fa uns anys, cada cop mes clients ens pregunten pel triple vidre. La resposta curta: <strong>depeen d'on vius i de quantes hores fas servir la calefaccio</strong>. Aqui t'expliquem amb dades reals quan el triple vidre es una inversio intel·ligent i quan el doble ja compleix perfectament.</p>

<h3>Que es exactament el triple vidre?</h3>
<p>Un vidre doble estandard te dues lamines de vidre separades per una cambra d'aire o gas argon. La composicio tipica es <strong>4/16/4</strong>: vidres de 4 mm amb 16 mm de cambra. El valor Ug (transmitancia termica del vidre) d'un doble amb argon i capa baix emissiva es d'aproximadament <strong>1,1 W/m2K</strong>.</p>
<p>El triple vidre afegeix una tercera lamina i una segona cambra. Una composicio habitual es <strong>4/12/4/12/4</strong> amb doble cambra d'argon i dues capes baix emissives. El seu Ug baixa fins a <strong>0,6 W/m2K</strong> — gairebe la meitat de perdua termica.</p>

<h3>On te sentit el triple vidre a la provincia de Girona?</h3>
<p>No tot el territori gironí te el mateix clima. Distingim tres zones:</p>

<p><strong>Zona interior freda (Olot, Banyoles, Besalu, Garrotxa, Pla de l'Estany):</strong> hiverns amb temperatures frequents per sota de 0°C, gelades nocturnes de novembre a marc. Aqui el triple vidre es <strong>molt recomanable</strong>. La temporada de calefaccio dura 5-6 mesos i la diferencia de consum es significativa.</p>

<p><strong>Zona de transicio (Girona ciutat, Salt, Bascara, Figueres):</strong> hiverns moderats pero amb algunes setmanes de fred intens, especialment quan bufa la tramuntana. El triple vidre <strong>es justifica</strong> en habitatges amb molta superficie vidriada (grans finestrals al nord) o en cases antigues amb poc aillament a la resta de l'envolvent.</p>

<p><strong>Zona costanera (Blanes, Lloret, Tossa, l'Escala, Roses):</strong> hiverns suaus gracies a la influencia del mar. Temperatures rarament per sota de 3-4°C. Aqui un <strong>doble vidre de qualitat amb capa baix emissiva es suficient</strong> per a la majoria d'habitatges.</p>

<h3>Diferencia de preu real</h3>
<p>El sobrecost del triple vidre respecte al doble es d'uns <strong>40-70 EUR per metre quadrat de vidre</strong>, depenent de la composicio. Per una finestra estandard de 120 x 120 cm, el vidre ocupa uns 0,8 m2, aixi que parlem d'uns <strong>30-55 EUR de sobrecost per finestra</strong>.</p>
<p>Per una casa amb 10 finestres, la diferencia total es de <strong>300-550 EUR</strong>. No es un import enorme si la casa es a Olot i l'estalvi anual en calefaccio compensa la inversio en 2-4 anys.</p>

<h3>Calcul de retorn de la inversio (ROI)</h3>
<p>Posem un exemple concret. Casa unifamiliar a Besalu, 10 finestres estandard:</p>
<ul>
<li><strong>Consum anual de calefaccio amb doble vidre:</strong> ~1.200 EUR (gas natural)</li>
<li><strong>Consum estimat amb triple vidre:</strong> ~950 EUR</li>
<li><strong>Estalvi anual:</strong> ~250 EUR</li>
<li><strong>Sobrecost triple vidre:</strong> ~450 EUR</li>
<li><strong>Retorn de la inversio:</strong> menys de 2 anys</li>
</ul>

<p>Ara posem el mateix calcul per un pis a Blanes:</p>
<ul>
<li><strong>Consum anual de calefaccio amb doble vidre:</strong> ~500 EUR</li>
<li><strong>Consum estimat amb triple vidre:</strong> ~420 EUR</li>
<li><strong>Estalvi anual:</strong> ~80 EUR</li>
<li><strong>Sobrecost triple vidre:</strong> ~350 EUR</li>
<li><strong>Retorn de la inversio:</strong> mes de 4 anys</li>
</ul>

<h3>Pes i gruix: consideracions practiques</h3>
<p>El triple vidre es mes gruixut (uns 36 mm vs 24 mm del doble) i mes pesat (uns 30 kg/m2 vs 20 kg/m2). Aixo afecta els ferratges i el perfil. El Cortizo C-70 admet triple vidre sense problemes gracies a la seva amplada de galze de 40 mm. En canvi, perfils mes estrets podrien no ser compatibles.</p>
<p>El pes extra tambe obliga a ferratges reforçats, que ja venen de serie als sistemes Cortizo que instal·lem.</p>

<h3>Confort termic: el factor que no es mesura en euros</h3>
<p>Mes enlla de l'estalvi, el triple vidre elimina la sensacio de "paret freda" prop de la finestra. En una nit de gener a Olot a -3°C, la cara interior d'un doble vidre pot estar a 12-13°C. La d'un triple, a 16-17°C. Aquesta diferencia fa que no necessitis col·locar el sofa lluny de la finestra ni sentir corrent d'aire per conveccio.</p>

<h3>La nostra recomanacio</h3>
<p>A ARA FINESTRA no venem triple vidre a tothom perque si. El recomanem quan les dades ho justifiquen:</p>
<ul>
<li><strong>Si</strong> al triple vidre: interior de Girona (Garrotxa, Pla de l'Estany, Alt Emporda interior), cases amb grans finestrals orientats al nord, i habitatges on el confort termic es prioritari.</li>
<li><strong>Doble vidre de qualitat es suficient</strong>: costa de Girona, pisos petits amb poca superficie vidriada, i rehabilitacions amb pressupost ajustat.</li>
</ul>

<p>Calcula el teu pressupost amb les dues opcions al nostre <a href="/ca/pressupost">calculador online</a> i compara. O truca'ns per una consulta personalitzada.</p>`,

    contenidoEs: `<h2>El debate del tercer vidrio</h2>
<p>Desde hace unos anos, cada vez mas clientes nos preguntan por el triple vidrio. La respuesta corta: <strong>depende de donde vives y de cuantas horas usas la calefaccion</strong>. Aqui te explicamos con datos reales cuando el triple vidrio es una inversion inteligente y cuando el doble ya cumple perfectamente.</p>

<h3>Que es exactamente el triple vidrio?</h3>
<p>Un vidrio doble estandar tiene dos laminas de vidrio separadas por una camara de aire o gas argon. La composicion tipica es <strong>4/16/4</strong>: vidrios de 4 mm con 16 mm de camara. El valor Ug de un doble con argon y capa bajo emisiva es de aproximadamente <strong>1,1 W/m2K</strong>.</p>
<p>El triple vidrio anade una tercera lamina y una segunda camara. Una composicion habitual es <strong>4/12/4/12/4</strong> con doble camara de argon y dos capas bajo emisivas. Su Ug baja hasta <strong>0,6 W/m2K</strong> — casi la mitad de perdida termica.</p>

<h3>Donde tiene sentido el triple vidrio en la provincia de Girona?</h3>
<p>No todo el territorio tiene el mismo clima. Distinguimos tres zonas:</p>

<p><strong>Zona interior fria (Olot, Banyoles, Besalu, Garrotxa, Pla de l'Estany):</strong> inviernos con temperaturas frecuentes por debajo de 0°C, heladas nocturnas de noviembre a marzo. Aqui el triple vidrio es <strong>muy recomendable</strong>. La temporada de calefaccion dura 5-6 meses y la diferencia de consumo es significativa.</p>

<p><strong>Zona de transicion (Girona ciudad, Salt, Bascara, Figueres):</strong> inviernos moderados pero con algunas semanas de frio intenso, especialmente cuando sopla la tramontana. El triple vidrio <strong>se justifica</strong> en viviendas con mucha superficie acristalada o en casas antiguas con poco aislamiento.</p>

<p><strong>Zona costera (Blanes, Lloret, Tossa, l'Escala, Roses):</strong> inviernos suaves gracias al mar. Temperaturas raramente por debajo de 3-4°C. Aqui un <strong>doble vidrio de calidad con capa bajo emisiva es suficiente</strong> para la mayoria de viviendas.</p>

<h3>Diferencia de precio real</h3>
<p>El sobrecoste del triple vidrio respecto al doble es de unos <strong>40-70 EUR por metro cuadrado de vidrio</strong>. Para una ventana estandar de 120 x 120 cm, hablamos de unos <strong>30-55 EUR de sobrecoste por ventana</strong>. Para una casa con 10 ventanas, la diferencia total es de <strong>300-550 EUR</strong>.</p>

<h3>Calculo de retorno de la inversion (ROI)</h3>
<p>Ejemplo concreto. Casa unifamiliar en Besalu, 10 ventanas estandar:</p>
<ul>
<li><strong>Consumo anual de calefaccion con doble vidrio:</strong> ~1.200 EUR (gas natural)</li>
<li><strong>Consumo estimado con triple vidrio:</strong> ~950 EUR</li>
<li><strong>Ahorro anual:</strong> ~250 EUR</li>
<li><strong>Sobrecoste triple vidrio:</strong> ~450 EUR</li>
<li><strong>Retorno de la inversion:</strong> menos de 2 anos</li>
</ul>

<p>Mismo calculo para un piso en Blanes:</p>
<ul>
<li><strong>Consumo anual calefaccion con doble vidrio:</strong> ~500 EUR</li>
<li><strong>Consumo estimado con triple vidrio:</strong> ~420 EUR</li>
<li><strong>Ahorro anual:</strong> ~80 EUR</li>
<li><strong>Sobrecoste triple vidrio:</strong> ~350 EUR</li>
<li><strong>Retorno:</strong> mas de 4 anos</li>
</ul>

<h3>Peso y grosor: consideraciones practicas</h3>
<p>El triple vidrio es mas grueso (unos 36 mm vs 24 mm) y mas pesado (unos 30 kg/m2 vs 20 kg/m2). Esto afecta a los herrajes y al perfil. El Cortizo C-70 admite triple vidrio sin problemas gracias a su anchura de galce de 40 mm.</p>

<h3>Confort termico: el factor que no se mide en euros</h3>
<p>Mas alla del ahorro, el triple vidrio elimina la sensacion de "pared fria" cerca de la ventana. En una noche de enero en Olot a -3°C, la cara interior de un doble vidrio puede estar a 12-13°C. La de un triple, a 16-17°C.</p>

<h3>Nuestra recomendacion</h3>
<p>En ARA FINESTRA no vendemos triple vidrio a todo el mundo. Lo recomendamos cuando los datos lo justifican:</p>
<ul>
<li><strong>Si</strong> al triple: interior de Girona (Garrotxa, Pla de l'Estany, Alt Emporda interior), casas con grandes ventanales al norte.</li>
<li><strong>Doble de calidad es suficiente</strong>: costa de Girona, pisos pequenos, rehabilitaciones con presupuesto ajustado.</li>
</ul>

<p>Calcula tu presupuesto con ambas opciones en nuestro <a href="/es/presupuesto">calculador online</a> y compara.</p>`,

    contenidoEn: `<h2>The third-pane debate</h2>
<p>In recent years more and more clients ask us about triple glazing. The short answer: <strong>it depends on where you live and how many hours you run the heating</strong>. Here we explain, with real data, when triple glazing is a smart investment and when double glazing already does the job.</p>

<h3>What exactly is triple glazing?</h3>
<p>A standard double-glazed unit has two panes separated by an air or argon gas cavity. The typical makeup is <strong>4/16/4</strong>: 4 mm panes with a 16 mm cavity. The Ug value (glass thermal transmittance) of a double unit with argon and a low-e coating is around <strong>1.1 W/m2K</strong>.</p>
<p>Triple glazing adds a third pane and a second cavity. A common makeup is <strong>4/12/4/12/4</strong> with dual argon cavities and two low-e coatings. Its Ug drops to <strong>0.6 W/m2K</strong> — nearly half the heat loss.</p>

<h3>Where does triple glazing make sense in the province of Girona?</h3>
<p>Not all of the region shares the same climate. We distinguish three zones:</p>

<p><strong>Cold interior (Olot, Banyoles, Besalu, Garrotxa, Pla de l'Estany):</strong> winters frequently below 0°C, overnight frost from November to March. Here triple glazing is <strong>highly recommended</strong>. The heating season lasts 5-6 months and the consumption difference is significant.</p>

<p><strong>Transition zone (Girona city, Salt, Bascara, Figueres):</strong> moderate winters but with some weeks of intense cold, especially when the tramontana blows. Triple glazing <strong>is justified</strong> in homes with a lot of glazed area or older buildings with poor envelope insulation.</p>

<p><strong>Coastal zone (Blanes, Lloret, Tossa, l'Escala, Roses):</strong> mild winters thanks to the sea. Temperatures rarely below 3-4°C. Here a <strong>quality double-glazed unit with low-e coating is sufficient</strong> for most homes.</p>

<h3>Real price difference</h3>
<p>The surcharge for triple over double glazing is around <strong>EUR 40-70 per square metre of glass</strong>. For a standard 120 x 120 cm window, that means roughly <strong>EUR 30-55 extra per window</strong>. For a house with 10 windows the total difference is <strong>EUR 300-550</strong>.</p>

<h3>Return on investment (ROI) calculation</h3>
<p>A concrete example. Detached house in Besalu, 10 standard windows:</p>
<ul>
<li><strong>Annual heating cost with double glazing:</strong> ~EUR 1,200 (natural gas)</li>
<li><strong>Estimated with triple glazing:</strong> ~EUR 950</li>
<li><strong>Annual saving:</strong> ~EUR 250</li>
<li><strong>Triple glazing surcharge:</strong> ~EUR 450</li>
<li><strong>Payback:</strong> under 2 years</li>
</ul>

<p>Same calculation for an apartment in Blanes:</p>
<ul>
<li><strong>Annual heating with double:</strong> ~EUR 500</li>
<li><strong>Estimated with triple:</strong> ~EUR 420</li>
<li><strong>Annual saving:</strong> ~EUR 80</li>
<li><strong>Surcharge:</strong> ~EUR 350</li>
<li><strong>Payback:</strong> over 4 years</li>
</ul>

<h3>Weight and thickness: practical considerations</h3>
<p>Triple glazing is thicker (about 36 mm vs 24 mm) and heavier (about 30 kg/m2 vs 20 kg/m2). This affects hardware and profile choice. The Cortizo C-70 accommodates triple glazing thanks to its 40 mm glazing rebate. Reinforced hardware comes standard on the Cortizo systems we install.</p>

<h3>Thermal comfort: the factor you can't measure in euros</h3>
<p>Beyond savings, triple glazing eliminates the "cold wall" sensation near the window. On a January night in Olot at -3°C, the inner surface of a double pane may sit at 12-13°C. A triple pane reaches 16-17°C. That difference means you don't need to pull the sofa away from the window or feel convection draughts.</p>

<h3>Our recommendation</h3>
<ul>
<li><strong>Yes</strong> to triple: Girona interior (Garrotxa, Pla de l'Estany, inland Alt Emporda), homes with large north-facing glazing, and clients who value thermal comfort.</li>
<li><strong>Quality double is enough</strong>: Girona coast, small apartments, renovations on a tight budget.</li>
</ul>

<p>Calculate your quote with both options on our <a href="/en/quote">online calculator</a> and compare.</p>`,

    extractoCa: "Triple vidre o doble vidre? Analitzem les zones climatiques de Girona, calculem el ROI real i t'ajudem a decidir amb dades concretes i preus.",
    extractoEs: "Triple vidrio o doble? Analizamos las zonas climaticas de Girona, calculamos el ROI real y te ayudamos a decidir con datos concretos y precios.",
    extractoEn: "Triple or double glazing? We analyse Girona's climate zones, calculate real ROI and help you decide with hard data and prices.",
    categoria: "eficiencia",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Triple vidre vs doble vidre: val la pena? | Ara Finestra",
    metaTitleEs: "Triple vidrio vs doble: merece la pena? | Ara Finestra",
    metaTitleEn: "Triple vs double glazing: is it worth it? | Ara Finestra",
    metaDescriptionCa: "Comparem triple i doble vidre amb dades reals per a la provincia de Girona. Preus, ROI i zones on el triple vidre te sentit.",
    metaDescriptionEs: "Comparamos triple y doble vidrio con datos reales para la provincia de Girona. Precios, ROI y zonas donde el triple vidrio tiene sentido.",
    metaDescriptionEn: "We compare triple and double glazing with real data for Girona province. Prices, ROI and zones where triple glazing makes sense.",
    published: true,
    publishedAt: new Date("2026-03-08"),
  },

  // ── 3. Cortizo vs Kommerling ─────────────────────────────────
  {
    slug: "cortizo-vs-kommerling-comparativa",
    tituloCa: "Cortizo vs Kommerling: comparativa de perfils PVC",
    tituloEs: "Cortizo vs Kommerling: comparativa de perfiles PVC",
    tituloEn: "Cortizo vs Kommerling: PVC profile comparison",
    contenidoCa: `<h2>Les dues grans marques del mercat espanyol</h2>
<p>Quan un client investiga sobre finestres de PVC a Espanya, els dos noms que apareixen mes son <strong>Cortizo</strong> i <strong>Kommerling</strong>. Ambdues son marques solides amb decades d'experiencia, pero hi ha diferencies importants que cal coneixer. A ARA FINESTRA treballem exclusivament amb Cortizo, i aqui t'expliquem per que — amb honestietat i dades.</p>

<h3>Origen i fabricacio</h3>
<p><strong>Cortizo</strong> es una empresa gallega fundada el 1972 a Extramundi (A Coruna). Fabrica a Espanya, amb 9 plantes de produccio al territori nacional. Tot el perfil que instal·lem arriba des de les seves fabriques a Galicia, amb cadena logistica curta i control de qualitat directe.</p>
<p><strong>Kommerling</strong> es una marca alemanya (fundada el 1897) que pertany al grup profine GmbH. No te fabrica propia a Espanya — els perfils es fabriquen a Alemanya i es distribueixen a traves d'una xarxa de majoristes. Aixo implica terminis de lliurament mes llargs i menys flexibilitat per a comandes especials.</p>

<h3>Prestacions termiques: molt similars</h3>
<p>En termes de transmitancia termica, els dos estan molt a prop:</p>
<ul>
<li><strong>Cortizo C-70:</strong> Uf = 1,3 W/m2K (5 cambres, 70 mm de profunditat)</li>
<li><strong>Kommerling 76:</strong> Uf = 1,2 W/m2K (6 cambres, 76 mm de profunditat)</li>
<li><strong>Cortizo A-70 (gamma alta):</strong> Uf = 1,2 W/m2K (6 cambres, reforcos especials)</li>
</ul>
<p>La diferencia de 0,1 W/m2K es marginal a la practica. En un habitatge estandard de Girona, la diferencia de consum energetic entre un perfil i l'altre es inapreciable.</p>

<h3>Estanqueitat i resistencia al vent</h3>
<p>Ambdues marques compleixen la norma UNE-EN 14351 amb classificacions altes. Pero en zones exposades a la tramuntana — Figueres, l'Escala, Cap de Creus — l'estanqueitat a l'aire es critica.</p>
<ul>
<li><strong>Cortizo C-70:</strong> Classe 4 (la mes alta) en permeabilitat a l'aire, classe E1500 en resistencia al vent</li>
<li><strong>Kommerling 76:</strong> Classe 4 en permeabilitat, classe C5 en resistencia al vent</li>
</ul>
<p>El sistema de juntes Cortizo amb doble junta perimteral EPDM ofereix un segellat excel·lent contra la tramuntana.</p>

<h3>Gamma de colors i acabats</h3>
<p>Cortizo ofereix <strong>mes de 40 acabats foliats</strong> (imitacio fusta, gris antracita, verd, etc.) directament de fabrica. Kommerling te una gamma similar pero amb terminis de lliurament mes llargs per a colors especials al mercat espanyol.</p>
<p>A la Costa Brava, on l'estetica es important per a normatives municipals, poder triar color sense esperes extres es un avantatge real.</p>

<h3>Servei postvenda i disponibilitat de recanvis</h3>
<p>Aqui es on la diferencia es mes significativa per al client final:</p>
<ul>
<li><strong>Cortizo:</strong> recanvis disponibles des de fabrica a Espanya en 24-48h. Xarxa de servei tecnic amb cobertura directa a Catalunya. Si un mecanisme falla, tenim la peca en dies.</li>
<li><strong>Kommerling:</strong> recanvis que venen d'Alemanya, amb terminis de 1-3 setmanes per a peces especifiques. Si necessites una peca de ferratge poc habitual, l'espera pot ser frustrant.</li>
</ul>

<h3>Certificacions i sostenibilitat</h3>
<p>Les dues marques tenen certificacions mediambientals robustes:</p>
<ul>
<li><strong>Cortizo:</strong> ISO 14001, marca AENOR N, Declaracio Ambiental de Producte (DAP), perfils 100% reciclables, programa propi de recollida i reciclatge de PVC</li>
<li><strong>Kommerling:</strong> ISO 14001, Rewindo (programa de reciclatge alemany), greenline (formula amb menor empremta de carboni)</li>
</ul>
<p>Cortizo te l'avantatge de ser fabricant local: la petjada de carboni del transport es significativament menor. Un perfil fabricat a Galicia fa menys de 1.000 km fins a Girona. Un perfil fabricat a Renania (Alemanya) en fa mes de 1.500.</p>

<h3>Preu: avantatge Cortizo</h3>
<p>El preu final al client es similar, pero Cortizo sol ser entre un <strong>5% i 10% mes economic</strong> que Kommerling per un producte equivalent. La rao es senzilla: fabrica a Espanya, sense costos d'importacio ni marges de distribuidors intermediaris.</p>
<p>Per a un projecte de 8 finestres, la diferencia pot ser de 200-400 EUR a favor de Cortizo, amb prestacions gairebe identiques.</p>

<h3>Per que ARA FINESTRA treballa amb Cortizo?</h3>
<p>Ho resumim en quatre punts:</p>
<ul>
<li><strong>Producte espanyol:</strong> coneixem la fabrica, el control de qualitat i les persones darrere la marca</li>
<li><strong>Logistica rapida:</strong> comandes en 7-10 dies laborables, colors especials en 15 dies</li>
<li><strong>Recanvis immediats:</strong> qualsevol peca disponible en 24-48h des de fabrica</li>
<li><strong>Relacio qualitat-preu:</strong> prestacions d'alta gamma a un preu competitiu</li>
</ul>
<p>Aixo no vol dir que Kommerling sigui dolent — es una marca excel·lent. Pero per al mercat de Girona i la Costa Brava, Cortizo ofereix una combinacio de qualitat, servei i preu que considerem imbatible.</p>

<p>Vols veure els perfils Cortizo en persona? Visita'ns o demana mostres gratuites. Contacta a traves del nostre <a href="/ca/contacte">formulari</a> o truca'ns directament.</p>`,

    contenidoEs: `<h2>Las dos grandes marcas del mercado espanol</h2>
<p>Cuando un cliente investiga sobre ventanas de PVC en Espana, los dos nombres que mas aparecen son <strong>Cortizo</strong> y <strong>Kommerling</strong>. Ambas son marcas solidas con decadas de experiencia, pero hay diferencias importantes. En ARA FINESTRA trabajamos exclusivamente con Cortizo, y aqui te explicamos por que — con honestidad y datos.</p>

<h3>Origen y fabricacion</h3>
<p><strong>Cortizo</strong> es una empresa gallega fundada en 1972 en Extramundi (A Coruna). Fabrica en Espana con 9 plantas de produccion nacionales. Todo el perfil que instalamos llega desde sus fabricas en Galicia, con cadena logistica corta y control de calidad directo.</p>
<p><strong>Kommerling</strong> es una marca alemana (fundada en 1897) del grupo profine GmbH. No tiene fabrica propia en Espana — los perfiles se fabrican en Alemania y se distribuyen a traves de mayoristas. Esto implica plazos de entrega mas largos y menos flexibilidad para pedidos especiales.</p>

<h3>Prestaciones termicas: muy similares</h3>
<ul>
<li><strong>Cortizo C-70:</strong> Uf = 1,3 W/m2K (5 camaras, 70 mm de profundidad)</li>
<li><strong>Kommerling 76:</strong> Uf = 1,2 W/m2K (6 camaras, 76 mm de profundidad)</li>
<li><strong>Cortizo A-70 (gama alta):</strong> Uf = 1,2 W/m2K (6 camaras)</li>
</ul>
<p>La diferencia de 0,1 W/m2K es marginal en la practica.</p>

<h3>Estanqueidad y resistencia al viento</h3>
<p>Ambas marcas cumplen la norma UNE-EN 14351 con clasificaciones altas. En zonas expuestas a la tramontana — Figueres, l'Escala, Cap de Creus — la estanqueidad es critica. Ambos perfiles alcanzan Clase 4 en permeabilidad al aire.</p>

<h3>Servicio posventa y disponibilidad de recambios</h3>
<p>Aqui es donde la diferencia es mas significativa:</p>
<ul>
<li><strong>Cortizo:</strong> recambios desde fabrica en Espana en 24-48h. Red de servicio tecnico con cobertura directa en Catalunya.</li>
<li><strong>Kommerling:</strong> recambios desde Alemania, con plazos de 1-3 semanas para piezas especificas.</li>
</ul>

<h3>Certificaciones y sostenibilidad</h3>
<p>Cortizo tiene ISO 14001, marca AENOR N, DAP y programa propio de reciclaje. Ademas, la huella de carbono del transporte es menor al fabricar en Espana.</p>

<h3>Precio: ventaja Cortizo</h3>
<p>Cortizo suele ser entre un <strong>5% y 10% mas economico</strong> que Kommerling para un producto equivalente. Sin costes de importacion ni margenes de distribuidores intermediarios. Para un proyecto de 8 ventanas, la diferencia puede ser de 200-400 EUR.</p>

<h3>Por que ARA FINESTRA trabaja con Cortizo?</h3>
<ul>
<li><strong>Producto espanol:</strong> conocemos la fabrica y las personas detras de la marca</li>
<li><strong>Logistica rapida:</strong> pedidos en 7-10 dias laborables</li>
<li><strong>Recambios inmediatos:</strong> cualquier pieza en 24-48h</li>
<li><strong>Relacion calidad-precio:</strong> prestaciones de alta gama a precio competitivo</li>
</ul>

<p>Quieres ver los perfiles Cortizo en persona? Visitanos o pide muestras gratuitas a traves de nuestro <a href="/es/contacto">formulario de contacto</a>.</p>`,

    contenidoEn: `<h2>The two big names in the Spanish market</h2>
<p>When a client in Spain researches PVC windows, two brands come up repeatedly: <strong>Cortizo</strong> and <strong>Kommerling</strong>. Both are solid manufacturers with decades of experience, but there are important differences. At ARA FINESTRA we work exclusively with Cortizo, and here we explain why — honestly and with data.</p>

<h3>Origin and manufacturing</h3>
<p><strong>Cortizo</strong> is a Galician company founded in 1972 in Extramundi (A Coruna). It manufactures in Spain across 9 national production plants. Every profile we install ships from their Galician factories, with a short logistics chain and direct quality control.</p>
<p><strong>Kommerling</strong> is a German brand (founded 1897) belonging to the profine GmbH group. It has no factory of its own in Spain — profiles are made in Germany and distributed through wholesalers. This means longer lead times and less flexibility for special orders.</p>

<h3>Thermal performance: very close</h3>
<ul>
<li><strong>Cortizo C-70:</strong> Uf = 1.3 W/m2K (5 chambers, 70 mm depth)</li>
<li><strong>Kommerling 76:</strong> Uf = 1.2 W/m2K (6 chambers, 76 mm depth)</li>
<li><strong>Cortizo A-70 (premium range):</strong> Uf = 1.2 W/m2K (6 chambers)</li>
</ul>
<p>The 0.1 W/m2K difference is negligible in practice. In a standard home in Girona, the energy consumption gap between them is undetectable.</p>

<h3>Airtightness and wind resistance</h3>
<p>Both brands meet UNE-EN 14351 with top ratings. In areas exposed to the tramontana — Figueres, l'Escala, Cap de Creus — airtightness is critical. Both achieve Class 4 air permeability. Cortizo's dual EPDM perimeter gasket system provides excellent sealing against the tramontana.</p>

<h3>After-sales service and spare parts</h3>
<p>This is where the difference matters most to the end customer:</p>
<ul>
<li><strong>Cortizo:</strong> spare parts from the Spanish factory in 24-48 hours. Technical service network with direct coverage in Catalunya.</li>
<li><strong>Kommerling:</strong> parts shipped from Germany, with lead times of 1-3 weeks for specific pieces.</li>
</ul>

<h3>Certifications and sustainability</h3>
<p>Cortizo holds ISO 14001, AENOR N mark, Environmental Product Declaration (EPD), and runs its own PVC collection and recycling programme. The transport carbon footprint is also significantly lower: a profile made in Galicia travels under 1,000 km to Girona, versus over 1,500 km from the Rhineland.</p>

<h3>Price: Cortizo advantage</h3>
<p>Cortizo is typically <strong>5-10% more affordable</strong> than Kommerling for an equivalent product. No import costs, no intermediary distributor margins. On a project of 8 windows, the difference can be EUR 200-400 in Cortizo's favour with virtually identical performance.</p>

<h3>Why ARA FINESTRA works with Cortizo</h3>
<ul>
<li><strong>Spanish product:</strong> we know the factory, the quality control and the people behind the brand</li>
<li><strong>Fast logistics:</strong> orders delivered in 7-10 working days, special colours in 15 days</li>
<li><strong>Immediate spares:</strong> any part available in 24-48 hours from the factory</li>
<li><strong>Value for money:</strong> high-end performance at a competitive price</li>
</ul>

<p>This doesn't mean Kommerling is bad — it's an excellent brand. But for the Girona and Costa Brava market, Cortizo offers a combination of quality, service and price we consider unbeatable.</p>

<p>Want to see Cortizo profiles in person? Visit us or request free samples through our <a href="/en/contact">contact form</a>.</p>`,

    extractoCa: "Comparem Cortizo i Kommerling: prestacions termiques, origen de fabricacio, preus, servei postvenda i per que ARA FINESTRA treballa amb Cortizo.",
    extractoEs: "Comparamos Cortizo y Kommerling: prestaciones termicas, origen de fabricacion, precios, servicio posventa y por que ARA FINESTRA trabaja con Cortizo.",
    extractoEn: "We compare Cortizo and Kommerling: thermal performance, manufacturing origin, prices, after-sales service and why ARA FINESTRA works with Cortizo.",
    categoria: "productes",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Cortizo vs Kommerling: comparativa perfils PVC | Ara Finestra",
    metaTitleEs: "Cortizo vs Kommerling: comparativa perfiles PVC | Ara Finestra",
    metaTitleEn: "Cortizo vs Kommerling: PVC profile comparison | Ara Finestra",
    metaDescriptionCa: "Comparem Cortizo i Kommerling: aillament, preus, recanvis i fabricacio. Descobreix per que triem Cortizo per a instal·lacions a Girona.",
    metaDescriptionEs: "Comparamos Cortizo y Kommerling: aislamiento, precios, recambios y fabricacion. Descubre por que elegimos Cortizo para instalaciones en Girona.",
    metaDescriptionEn: "Cortizo vs Kommerling compared: insulation, prices, spare parts and manufacturing. Discover why we choose Cortizo for Girona installations.",
    published: true,
    publishedAt: new Date("2026-03-05"),
  },

  // ── 4. Mosquiteres comparativa ───────────────────────────────
  {
    slug: "mosquiteres-enrollables-vs-corredisses-vs-plissades",
    tituloCa: "Mosquiteres: enrollables vs corredisses vs plissades",
    tituloEs: "Mosquiteras: enrollables vs correderas vs plisadas",
    tituloEn: "Fly screens: roller vs sliding vs pleated",
    contenidoCa: `<h2>La mosquitera adequada per a cada finestra</h2>
<p>A la provincia de Girona, amb estius calorosos i proximitat a zones humides (l'Estany de Banyoles, els aiguamolls de l'Emporda), les mosquiteres no son un luxe — son una necessitat. Pero no totes les mosquiteres son iguals ni serveixen per a totes les finestres. Aqui comparem els tres tipus mes demandats.</p>

<h3>1. Mosquitera enrollable</h3>
<p>La mosquitera enrollable funciona com una persiana: es desplega verticalment des d'un caixo superior i es recull amb un moll. Es el tipus <strong>mes venut a Espanya</strong> i el que instal·lem amb mes frequencia a ARA FINESTRA.</p>

<p><strong>Avantatges:</strong></p>
<ul>
<li>Ocupa molt poc espai quan esta recollida (el caixo fa nomes 40-50 mm)</li>
<li>Facil d'usar: es baixa amb un tirador i puja sola</li>
<li>Ideal per a finestres oscilobatents que nomes s'obren de tant en tant</li>
<li>Preu ajustat: entre <strong>60 i 120 EUR</strong> per a una finestra estandard de 120 x 120 cm</li>
</ul>

<p><strong>Inconvenients:</strong></p>
<ul>
<li>El moll pot perdre tensio amb el temps (despres de 5-8 anys d'us intensiu)</li>
<li>No es poden obrir parcialment — es tot o res</li>
<li>No son adequades per a portes d'acces o grans obertures per on es passa frequentment</li>
</ul>

<p><strong>Millor us:</strong> finestres de dormitori, bany i cuina. On la mosquitera es baixa a la nit i es recull al mati.</p>

<h3>2. Mosquitera corredissa</h3>
<p>La mosquitera corredissa es munta sobre un marc que llisca per un carril horitzontal, com una finestra corredissa. Es fixa — no es recull ni es plega — pero es pot desplacar lateralment.</p>

<p><strong>Avantatges:</strong></p>
<ul>
<li>Molt robusta i duradora: no te molles ni mecanismes que es desgastin</li>
<li>Permet obertura parcial: pots desplacar la mosquitera per accedir a la part de la finestra que necessitis</li>
<li>Ideal per a finestres corredisses, ja que comparteixen el mateix sistema de guia</li>
<li>Facil de netejar: es desmunta sencera i es renta amb aigua</li>
<li>Preu: entre <strong>50 i 100 EUR</strong> per finestra estandard</li>
</ul>

<p><strong>Inconvenients:</strong></p>
<ul>
<li>Sempre ocupa un espai visible a la finestra — no desapareix quan no la necessites</li>
<li>No es pot instal·lar en finestres oscilobatents (no hi ha carril horitzontal)</li>
<li>En finestres petites, la guia inferior pot acumular pols</li>
</ul>

<p><strong>Millor us:</strong> finestres corredisses de terrassa o sala d'estar. Especialment recomanable a primera linia de mar a Blanes, Lloret o Tossa, on els mosquits son constants a l'estiu.</p>

<h3>3. Mosquitera plissada</h3>
<p>La mosquitera plissada es plega en acordio horitzontalment dins un perfil lateral. Es el sistema mes elegant i el mes modern dels tres.</p>

<p><strong>Avantatges:</strong></p>
<ul>
<li>Estetica superior: el teixit plissat queda gairebe invisible quan esta replegat</li>
<li>Permet obertura parcial: pots obrir-la exactament la quantitat que vulguis</li>
<li>Ideal per a portes d'acces al jardi o terrassa, ja que pots passar sense haver de desmuntar res</li>
<li>Sense molles: funciona per frec suau, aixi que no hi ha mecanismes que es desgastin</li>
<li>Disponible en versions dobles per a obertures grans (fins a 4 metres d'ample)</li>
</ul>

<p><strong>Inconvenients:</strong></p>
<ul>
<li>Preu mes elevat: entre <strong>150 i 350 EUR</strong> per unitat, depenent de la mida</li>
<li>El teixit plissat es mes delicat que la malla estandard — cal netejar-lo amb cura</li>
<li>Requereix una instal·lacio mes precisa</li>
</ul>

<p><strong>Millor us:</strong> portes de terrassa, grans obertures de sala d'estar i qualsevol lloc on l'estetica sigui prioritaria. Molt popular en cases i xalets de la Costa Brava.</p>

<h3>Comparativa rapida</h3>
<table>
<tr><th>Caracteristica</th><th>Enrollable</th><th>Corredissa</th><th>Plissada</th></tr>
<tr><td>Preu (120x120)</td><td>60-120 EUR</td><td>50-100 EUR</td><td>150-250 EUR</td></tr>
<tr><td>Durabilitat</td><td>Bona (5-8 anys moll)</td><td>Excel·lent</td><td>Molt bona</td></tr>
<tr><td>Estetica</td><td>Discreta</td><td>Visible</td><td>Excel·lent</td></tr>
<tr><td>Obertura parcial</td><td>No</td><td>Si</td><td>Si</td></tr>
<tr><td>Per a portes</td><td>No</td><td>Limitada</td><td>Ideal</td></tr>
<tr><td>Manteniment</td><td>Baix</td><td>Molt baix</td><td>Mitja</td></tr>
</table>

<h3>Quina tela triar?</h3>
<p>Independentment del tipus de mosquitera, la tela te importancia:</p>
<ul>
<li><strong>Fibra de vidre estandard:</strong> la mes comuna i economica. Bona visibilitat i ventilacio.</li>
<li><strong>Tela anti-pol·len:</strong> teixit mes dens que filtra el pol·len. Recomanable per a persones al·lergiques a Girona, especialment a la primavera.</li>
<li><strong>Tela anti-mascotes (pet screen):</strong> mes resistent a les urpes de gats. Necessaria si tens animals a casa.</li>
<li><strong>Tela solar:</strong> a mes de mosquits, redueix l'entrada de calor solar. Util per a finestres orientades al sud a l'estiu gironí.</li>
</ul>

<h3>Compatibilitat amb finestres Cortizo</h3>
<p>Tots els models de mosquiteres que instal·lem son compatibles amb els perfils Cortizo C-70 i E-170. Les corredisses s'integren al carril de la mateixa finestra. Les enrollables i plissades es munten al marc o a la paret amb fixacions especifiques que no danyen el perfil.</p>

<h3>La nostra recomanacio per a casa teva</h3>
<p>En la majoria de projectes a la Costa Brava, la combinacio optima es:</p>
<ul>
<li><strong>Enrollables</strong> als dormitoris i bany (us intermitent, preu ajustat)</li>
<li><strong>Corredisses</strong> a la cuina si la finestra es corredissa</li>
<li><strong>Plissada</strong> a la porta de sortida a la terrassa (acces frequent, estetica)</li>
</ul>

<p>Demana pressupost de mosquiteres juntament amb les teves finestres al nostre <a href="/ca/pressupost">calculador</a>. El preu conjunt sempre es mes avantatjos que comprar-les per separat.</p>`,

    contenidoEs: `<h2>La mosquitera adecuada para cada ventana</h2>
<p>En la provincia de Girona, con veranos calurosos y proximidad a zonas humedas (el lago de Banyoles, los humedales del Emporda), las mosquiteras no son un lujo — son una necesidad. Pero no todas las mosquiteras son iguales ni sirven para todas las ventanas. Aqui comparamos los tres tipos mas demandados.</p>

<h3>1. Mosquitera enrollable</h3>
<p>Funciona como una persiana: se despliega verticalmente desde un cajon superior y se recoge con un muelle. Es el tipo <strong>mas vendido en Espana</strong>.</p>

<p><strong>Ventajas:</strong></p>
<ul>
<li>Ocupa muy poco espacio recogida (el cajon mide solo 40-50 mm)</li>
<li>Facil de usar: se baja con un tirador y sube sola</li>
<li>Ideal para ventanas oscilobatientes</li>
<li>Precio ajustado: entre <strong>60 y 120 EUR</strong> para una ventana estandar</li>
</ul>

<p><strong>Inconvenientes:</strong></p>
<ul>
<li>El muelle puede perder tension con el tiempo (tras 5-8 anos de uso intensivo)</li>
<li>No se puede abrir parcialmente — es todo o nada</li>
<li>No adecuada para puertas de acceso frecuente</li>
</ul>

<h3>2. Mosquitera corredera</h3>
<p>Se monta sobre un marco que se desliza por un carril horizontal. Es fija — no se recoge — pero se puede desplazar lateralmente.</p>

<p><strong>Ventajas:</strong></p>
<ul>
<li>Muy robusta y duradera: sin muelles ni mecanismos que se desgasten</li>
<li>Permite apertura parcial</li>
<li>Ideal para ventanas correderas, compartiendo sistema de guia</li>
<li>Facil de limpiar: se desmonta entera</li>
<li>Precio: entre <strong>50 y 100 EUR</strong></li>
</ul>

<p><strong>Inconvenientes:</strong></p>
<ul>
<li>Siempre visible — no desaparece cuando no la necesitas</li>
<li>No compatible con ventanas oscilobatientes</li>
</ul>

<h3>3. Mosquitera plisada</h3>
<p>Se pliega en acordeon horizontalmente dentro de un perfil lateral. Es el sistema mas elegante.</p>

<p><strong>Ventajas:</strong></p>
<ul>
<li>Estetica superior: casi invisible cuando esta replegada</li>
<li>Apertura parcial precisa</li>
<li>Ideal para puertas de acceso a jardin o terraza</li>
<li>Sin muelles: funciona por friccion suave</li>
<li>Disponible en versiones dobles para aberturas grandes (hasta 4 metros)</li>
</ul>

<p><strong>Inconvenientes:</strong></p>
<ul>
<li>Precio mas elevado: entre <strong>150 y 350 EUR</strong> segun tamano</li>
<li>El tejido plisado es mas delicado</li>
<li>Requiere instalacion mas precisa</li>
</ul>

<h3>Que tela elegir?</h3>
<ul>
<li><strong>Fibra de vidrio estandar:</strong> la mas comun y economica</li>
<li><strong>Tela anti-polen:</strong> tejido mas denso, recomendable para alergicos en Girona</li>
<li><strong>Tela anti-mascotas (pet screen):</strong> resistente a garras de gato</li>
<li><strong>Tela solar:</strong> reduce la entrada de calor, util para ventanas al sur</li>
</ul>

<h3>Nuestra recomendacion</h3>
<ul>
<li><strong>Enrollables</strong> en dormitorios y bano</li>
<li><strong>Correderas</strong> en cocina si la ventana es corredera</li>
<li><strong>Plisada</strong> en la puerta de salida a terraza</li>
</ul>

<p>Pide presupuesto de mosquiteras junto con tus ventanas en nuestro <a href="/es/presupuesto">calculador</a>. El precio conjunto siempre es mas ventajoso.</p>`,

    contenidoEn: `<h2>The right fly screen for every window</h2>
<p>In the province of Girona, with hot summers and proximity to wetlands (Lake Banyoles, the Emporda marshes), fly screens are not a luxury — they are a necessity. But not all screens are equal, nor do they suit every window. Here we compare the three most popular types.</p>

<h3>1. Roller fly screen</h3>
<p>Works like a blind: it unrolls vertically from a top cassette and retracts with a spring. It is the <strong>best-selling type in Spain</strong> and the one we install most often at ARA FINESTRA.</p>

<p><strong>Advantages:</strong></p>
<ul>
<li>Takes up very little space when retracted (cassette is only 40-50 mm)</li>
<li>Easy to use: pull down by the handle, it springs back up on its own</li>
<li>Ideal for tilt-and-turn windows that are only opened occasionally</li>
<li>Affordable: between <strong>EUR 60 and 120</strong> for a standard 120 x 120 cm window</li>
</ul>

<p><strong>Drawbacks:</strong></p>
<ul>
<li>The spring can lose tension over time (after 5-8 years of heavy use)</li>
<li>Cannot be partially opened — it is all or nothing</li>
<li>Not suitable for doors or openings you walk through frequently</li>
</ul>

<p><strong>Best for:</strong> bedroom, bathroom and kitchen windows. Where you lower the screen at night and retract it in the morning.</p>

<h3>2. Sliding fly screen</h3>
<p>Mounted on a frame that glides along a horizontal track, like a sliding window. It is fixed — it doesn't retract or fold — but it can be pushed sideways.</p>

<p><strong>Advantages:</strong></p>
<ul>
<li>Very robust and long-lasting: no springs or mechanisms to wear out</li>
<li>Allows partial opening: slide it to access the part of the window you need</li>
<li>Ideal for sliding windows, sharing the same track system</li>
<li>Easy to clean: remove the whole frame and wash it</li>
<li>Price: between <strong>EUR 50 and 100</strong> per standard window</li>
</ul>

<p><strong>Drawbacks:</strong></p>
<ul>
<li>Always visible — it doesn't disappear when you don't need it</li>
<li>Cannot be installed on tilt-and-turn windows (no horizontal track)</li>
<li>The bottom track can collect dust on smaller windows</li>
</ul>

<p><strong>Best for:</strong> sliding terrace or living-room windows. Especially recommended on the Blanes, Lloret or Tossa seafront, where mosquitoes are constant in summer.</p>

<h3>3. Pleated fly screen</h3>
<p>Folds in a horizontal concertina into a side profile. It is the most elegant and modern of the three.</p>

<p><strong>Advantages:</strong></p>
<ul>
<li>Superior aesthetics: the pleated mesh is almost invisible when folded</li>
<li>Precise partial opening: open it exactly as much as you want</li>
<li>Ideal for garden or terrace doors — you can walk through without dismounting anything</li>
<li>No springs: works by gentle friction, so no mechanisms to wear out</li>
<li>Available in double versions for large openings (up to 4 metres wide)</li>
</ul>

<p><strong>Drawbacks:</strong></p>
<ul>
<li>Higher price: between <strong>EUR 150 and 350</strong> per unit depending on size</li>
<li>The pleated mesh is more delicate than standard — clean with care</li>
<li>Requires more precise installation</li>
</ul>

<p><strong>Best for:</strong> terrace doors, large living-room openings, and anywhere aesthetics matter. Very popular in Costa Brava villas and detached houses.</p>

<h3>Which mesh to choose?</h3>
<ul>
<li><strong>Standard fibreglass:</strong> the most common and affordable. Good visibility and ventilation.</li>
<li><strong>Anti-pollen mesh:</strong> denser weave that filters pollen. Recommended for allergy sufferers in Girona, especially in spring.</li>
<li><strong>Pet screen:</strong> more resistant to cat claws. A must if you have pets.</li>
<li><strong>Solar mesh:</strong> also reduces solar heat gain. Useful for south-facing windows in the Girona summer.</li>
</ul>

<h3>Compatibility with Cortizo windows</h3>
<p>All the fly screen models we install are compatible with Cortizo C-70 and E-170 profiles. Sliding screens integrate into the window's own track. Roller and pleated screens mount to the frame or wall with specific fixings that do not damage the profile.</p>

<h3>Our recommendation for your home</h3>
<p>In most Costa Brava projects, the optimal combination is:</p>
<ul>
<li><strong>Roller screens</strong> on bedrooms and bathrooms (occasional use, affordable)</li>
<li><strong>Sliding screens</strong> in the kitchen if the window is a slider</li>
<li><strong>Pleated screen</strong> on the terrace door (frequent access, aesthetics)</li>
</ul>

<p>Request a fly screen quote alongside your windows on our <a href="/en/quote">calculator</a>. The combined price is always better than buying them separately.</p>`,

    extractoCa: "Comparem mosquiteres enrollables, corredisses i plissades: preus, durabilitat, estetica i quina es la millor opcio per a cada finestra de casa teva.",
    extractoEs: "Comparamos mosquiteras enrollables, correderas y plisadas: precios, durabilidad, estetica y cual es la mejor opcion para cada ventana de tu casa.",
    extractoEn: "We compare roller, sliding and pleated fly screens: prices, durability, aesthetics and which is the best option for each window in your home.",
    categoria: "guies",
    autor: "ARA FINESTRA",
    imagenPortada: null,
    metaTitleCa: "Mosquiteres: enrollables vs corredisses vs plissades | Ara Finestra",
    metaTitleEs: "Mosquiteras: enrollables vs correderas vs plisadas | Ara Finestra",
    metaTitleEn: "Fly screens: roller vs sliding vs pleated | Ara Finestra",
    metaDescriptionCa: "Comparem 3 tipus de mosquiteres: enrollables, corredisses i plissades. Preus, avantatges i quina triar per a cada finestra a Girona.",
    metaDescriptionEs: "Comparamos 3 tipos de mosquiteras: enrollables, correderas y plisadas. Precios, ventajas y cual elegir para cada ventana en Girona.",
    metaDescriptionEn: "We compare 3 fly screen types: roller, sliding and pleated. Prices, advantages and which to choose for each window in Girona.",
    published: true,
    publishedAt: new Date("2026-03-02"),
  },
];

export async function seedBlogComparisons() {
  console.log("Seeding blog comparison articles...");
  for (const article of articles) {
    await db.insert(blogPosts).values(article).onConflictDoNothing({ target: blogPosts.slug });
    console.log(`  Blog: ${article.slug}`);
  }
  console.log("  Blog comparison articles seeded");
}
