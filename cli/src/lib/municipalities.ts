// ---------------------------------------------------------------------------
// Girona province + Maresme municipalities
// ---------------------------------------------------------------------------

export interface Municipality {
  name: string;
  pop: number;
}

export const GIRONA_MUNICIPALITIES: Municipality[] = [
  // Girona province — major towns
  { name: "Girona", pop: 103000 },
  { name: "Figueres", pop: 48000 },
  { name: "Blanes", pop: 40000 },
  { name: "Lloret de Mar", pop: 38000 },
  { name: "Olot", pop: 35000 },
  { name: "Salt", pop: 32000 },
  { name: "Pineda de Mar", pop: 28000 },
  { name: "Palafrugell", pop: 23000 },
  { name: "Sant Feliu de Guíxols", pop: 22000 },
  { name: "Roses", pop: 20000 },
  { name: "Banyoles", pop: 20000 },
  { name: "Calella", pop: 19000 },
  { name: "Palamós", pop: 18000 },
  { name: "Malgrat de Mar", pop: 18000 },
  { name: "Arenys de Mar", pop: 16000 },
  { name: "Canet de Mar", pop: 15000 },
  { name: "Torroella de Montgrí", pop: 12000 },
  { name: "Cassà de la Selva", pop: 11000 },
  { name: "Platja d'Aro", pop: 11000 },
  { name: "Ripoll", pop: 10500 },
  { name: "Sant Joan de les Abadesses", pop: 3500 },
  { name: "Tossa de Mar", pop: 6000 },
  { name: "L'Escala", pop: 10500 },
  { name: "Llagostera", pop: 8500 },
  { name: "Begur", pop: 4000 },
  { name: "Cadaqués", pop: 2800 },
  { name: "Llançà", pop: 5000 },
  { name: "Empuriabrava", pop: 7500 },
  { name: "Vidreres", pop: 8000 },
  { name: "Calonge", pop: 12000 },
  { name: "La Bisbal d'Empordà", pop: 10500 },
  { name: "Pals", pop: 2500 },
  { name: "Sils", pop: 6500 },
  { name: "Maçanet de la Selva", pop: 7500 },
  { name: "Santa Coloma de Farners", pop: 13000 },
  { name: "Anglès", pop: 5500 },
  { name: "Celrà", pop: 5000 },
  { name: "Besalú", pop: 2500 },
  { name: "Puigcerdà", pop: 9000 },
  // Maresme comarca
  { name: "Mataró", pop: 130000 },
  { name: "Premià de Mar", pop: 28000 },
  { name: "El Masnou", pop: 23000 },
  { name: "Vilassar de Mar", pop: 21000 },
  { name: "Sant Andreu de Llavaneres", pop: 11000 },
  { name: "Arenys de Munt", pop: 9500 },
  { name: "Sant Vicenç de Montalt", pop: 7000 },
  { name: "Cabrera de Mar", pop: 5000 },
  { name: "Santa Susanna", pop: 3500 },
  { name: "Sant Pol de Mar", pop: 5500 },
];
