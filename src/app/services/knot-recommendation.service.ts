import { Injectable } from '@angular/core';
import { Knot, KnotQuery, KnotResult } from '../models/knot.model';

const KNOTS: Knot[] = [
  {
    id: 'nodo-piano',
    name: 'Nodo Piano',
    englishName: 'Square / Reef Knot',
    category: ['join', 'binding'],
    description: 'Nodo classico per unire due corde dello stesso spessore. Piatto, non scivola se le corde sono asciutte.',
    steps: [
      { step: 1, instruction: 'Tieni un\'estremità in ogni mano.' },
      { step: 2, instruction: 'Incrocia la corda sinistra sopra la destra e passala sotto.' },
      { step: 3, instruction: 'Prendi ora la corda che è a destra, passala sopra e poi sotto la sinistra.' },
      { step: 4, instruction: 'Tira entrambe le estremità per stringere.' }
    ],
    warnings: ['Non usare come nodo di sicurezza per arrampicata', 'Si disfa se le corde sono bagnate', 'Non usare per corde di spessore diverso'],
    bestFor: ['Legare fasciature', 'Chiudere sacchi', 'Unire corde uguali'],
    avoidWhen: ['Condizioni bagnate', 'Carichi dinamici', 'Corde di diametro diverso'],
    difficulty: 'facile',
    worksWet: false,
    suitableFor: ['tent', 'general', 'tool'],
    loadTypes: ['static'],
    minExperience: 'beginner'
  },
  {
    id: 'gassa-amante',
    name: 'Gassa d\'Amante',
    englishName: 'Bowline',
    category: ['loop', 'anchor', 'climbing'],
    description: 'Il re dei nodi. Crea un anello fisso che non si stringe né si allarga sotto carico. Affidabile in ogni condizione.',
    steps: [
      { step: 1, instruction: 'Forma un piccolo anello a circa 30 cm dall\'estremità (il "pozzo").' },
      { step: 2, instruction: 'Passa l\'estremità libera attraverso l\'anello dal basso ("il coniglio esce dalla tana").' },
      { step: 3, instruction: 'Porta l\'estremità intorno alla corda principale ("il coniglio gira intorno all\'albero").' },
      { step: 4, instruction: 'Riporta l\'estremità nel piccolo anello dall\'alto ("il coniglio rientra nella tana").' },
      { step: 5, instruction: 'Stringi tenendo fermo l\'anello grande e tirando la corda principale.' }
    ],
    warnings: ['Controllare sempre che il nodo sia ben stretto prima del carico', 'Lasciare almeno 10 cm di coda'],
    bestFor: ['Ancoraggio tende', 'Salvataggio', 'Nodo di sicurezza', 'Alberatura'],
    avoidWhen: [],
    difficulty: 'medio',
    worksWet: true,
    suitableFor: ['tent', 'rescue', 'general', 'bridge'],
    loadTypes: ['static', 'dynamic', 'heavy'],
    minExperience: 'beginner'
  },
  {
    id: 'nodo-barcaiolo',
    name: 'Nodo Barcaiolo',
    englishName: 'Clove Hitch',
    category: ['hitch', 'anchor'],
    description: 'Aggancio rapido a pali o alberi. Facile da sciogliere, si regola facilmente. Ideale per legare i picchetti della tenda.',
    steps: [
      { step: 1, instruction: 'Avvolgi la corda attorno al palo.' },
      { step: 2, instruction: 'Porta la corda sopra se stessa e avvolgi di nuovo.' },
      { step: 3, instruction: 'Passa l\'estremità sotto l\'ultima avvolgimento.' },
      { step: 4, instruction: 'Tira per stringere.' }
    ],
    warnings: ['Può scivolare se il carico è in direzione parallela al palo', 'Non usare da solo per carichi pesanti'],
    bestFor: ['Legare a pali', 'Picchetti tenda', 'Inizio di legature'],
    avoidWhen: ['Carichi molto pesanti senza altro nodo di rinforzo'],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['tent', 'flagpole', 'general'],
    loadTypes: ['static', 'dynamic'],
    minExperience: 'beginner'
  },
  {
    id: 'due-mezzi-colli',
    name: 'Due Mezzi Colli',
    englishName: 'Two Half Hitches',
    category: ['hitch', 'anchor'],
    description: 'Due mezzo-collo consecutivi formano un nodo affidabile per fissare una corda a un palo o anello.',
    steps: [
      { step: 1, instruction: 'Avvolgi la corda attorno al supporto.' },
      { step: 2, instruction: 'Passa l\'estremità sotto la corda principale e attraverso l\'anello formato (primo mezzo collo).' },
      { step: 3, instruction: 'Ripeti il passaggio nello stesso verso (secondo mezzo collo).' },
      { step: 4, instruction: 'Tira per stringere.' }
    ],
    warnings: ['Controllare periodicamente che non si allenti'],
    bestFor: ['Fissaggio a pali', 'Ormeggio', 'Cordino guida'],
    avoidWhen: ['Carichi dinamici improvvisi'],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['tent', 'general', 'bridge'],
    loadTypes: ['static', 'heavy'],
    minExperience: 'beginner'
  },
  {
    id: 'nodo-scotta',
    name: 'Nodo di Scotta',
    englishName: 'Sheet Bend',
    category: ['join'],
    description: 'Unisce due corde di diametro diverso in modo sicuro. Essenziale quando si hanno corde di spessori differenti.',
    steps: [
      { step: 1, instruction: 'Forma un\'ansa con la corda più spessa.' },
      { step: 2, instruction: 'Passa la corda più sottile attraverso l\'ansa dal basso.' },
      { step: 3, instruction: 'Porta la corda sottile intorno a entrambi i bracci dell\'ansa.' },
      { step: 4, instruction: 'Passa la corda sottile sotto se stessa.' },
      { step: 5, instruction: 'Tira entrambe le corde per stringere.' }
    ],
    warnings: ['La corda sottile deve passare sopra la corda spessa', 'Per carichi pesanti usa il Nodo di Scotta Doppio'],
    bestFor: ['Unire corde di diametri diversi', 'Riparazioni di emergenza'],
    avoidWhen: ['Corde dello stesso diametro (usa Nodo Piano)'],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['general', 'bridge', 'rescue'],
    loadTypes: ['static', 'dynamic'],
    minExperience: 'beginner'
  },
  {
    id: 'nodo-savoia',
    name: 'Nodo Savoia',
    englishName: 'Figure-Eight Knot',
    category: ['climbing', 'loop'],
    description: 'Nodo a forma di otto. Usato come stopper e come base per legature da arrampicata. Molto resistente.',
    steps: [
      { step: 1, instruction: 'Forma un anello con la corda.' },
      { step: 2, instruction: 'Porta l\'estremità intorno alla corda principale.' },
      { step: 3, instruction: 'Passa l\'estremità attraverso l\'anello iniziale.' },
      { step: 4, instruction: 'Stretta: deve avere la forma di un 8.' }
    ],
    warnings: ['Difficile da sciogliere dopo carichi pesanti'],
    bestFor: ['Stopper in fune', 'Base per nodi da arrampicata', 'Fine corda'],
    avoidWhen: [],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['climbing', 'rescue', 'general'],
    loadTypes: ['static', 'dynamic', 'heavy'],
    minExperience: 'beginner'
  },
  {
    id: 'nodo-vaccaio',
    name: 'Nodo Vaccaio',
    englishName: 'Timber Hitch',
    category: ['hitch', 'binding'],
    description: 'Perfetto per trascinare tronchi o pali. Si stringe con il carico e si scioglie facilmente quando non è in tensione.',
    steps: [
      { step: 1, instruction: 'Avvolgi la corda attorno al tronco.' },
      { step: 2, instruction: 'Passa l\'estremità intorno alla corda principale.' },
      { step: 3, instruction: 'Avvolgi l\'estremità su se stessa per 3-4 volte seguendo la direzione di torsione della corda.' },
      { step: 4, instruction: 'Tira nella direzione di traino per stringere.' }
    ],
    warnings: ['Funziona solo se il carico è nella direzione di tiro', 'Non usare per sollevamento verticale'],
    bestFor: ['Trascinare tronchi', 'Pali da costruzione', 'Carichi orizzontali'],
    avoidWhen: ['Sollevamento verticale', 'Direzioni di carico variabili'],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['bridge', 'tool'],
    loadTypes: ['static', 'heavy'],
    minExperience: 'beginner'
  },
  {
    id: 'prussik',
    name: 'Nodo Prussik',
    englishName: 'Prusik Knot',
    category: ['climbing'],
    description: 'Nodo autobloccante che scorre libero finché non è in carico. Fondamentale per auto-soccorso e progressione su corda.',
    steps: [
      { step: 1, instruction: 'Crea un anello con un cordino di 4-6mm (più sottile della corda principale).' },
      { step: 2, instruction: 'Passa l\'anello attorno alla corda principale.' },
      { step: 3, instruction: 'Passa l\'anello attraverso se stesso per 3 volte.' },
      { step: 4, instruction: 'Distribuisci le spire in modo uniforme.' },
      { step: 5, instruction: 'Il nodo si blocca sotto carico, scorre quando scarico.' }
    ],
    warnings: ['Usare cordino più sottile della corda principale (max 60% del diametro)', 'Non funziona con cordino sintetico su corda bagnata ghiacciata', 'Solo per tecnici esperti in contesti di arrampicata'],
    bestFor: ['Auto-soccorso', 'Progressione su corda', 'Bloccante di emergenza'],
    avoidWhen: ['Corde bagnate o ghiacciate senza test preliminare'],
    difficulty: 'avanzato',
    worksWet: false,
    suitableFor: ['climbing', 'rescue'],
    loadTypes: ['dynamic', 'static'],
    minExperience: 'expert'
  },
  {
    id: 'munter',
    name: 'Nodo Munter (Mezzo Barcaiolo)',
    englishName: 'Italian / Munter Hitch',
    category: ['climbing'],
    description: 'Nodo di assicurazione e calata. Si usa con il moschettone HMS. Permette di frenare la corda in modo efficace.',
    steps: [
      { step: 1, instruction: 'Forma due anelli con la corda.' },
      { step: 2, instruction: 'Sovrapponi i due anelli in modo che si specchino.' },
      { step: 3, instruction: 'Aggancia entrambi gli anelli al moschettone HMS.' },
      { step: 4, instruction: 'Chiudi il moschettone. La corda può scorrere in entrambe le direzioni.' }
    ],
    warnings: ['Richiede moschettone HMS a pera', 'La corda si attorciglia durante l\'uso prolungato', 'Solo per chi ha esperienza in alpinismo'],
    bestFor: ['Assicurazione in arrampicata', 'Calata di emergenza', 'Nodo di freno'],
    avoidWhen: ['Senza moschettone HMS', 'Chi non ha formazione alpinistica'],
    difficulty: 'avanzato',
    worksWet: true,
    suitableFor: ['climbing', 'rescue'],
    loadTypes: ['dynamic'],
    minExperience: 'expert'
  },
  {
    id: 'margherita',
    name: 'Nodo Margherita',
    englishName: 'Sheepshank',
    category: ['binding'],
    description: 'Accorcia una corda senza tagliarla. Utile quando la corda è troppo lunga o ha un tratto danneggiato.',
    steps: [
      { step: 1, instruction: 'Forma due anse nella corda.' },
      { step: 2, instruction: 'Passa ogni ansa attraverso un mezzo-collo fatto sulla corda a fianco.' },
      { step: 3, instruction: 'Tira le anse per stringere i mezzo-collo.' },
      { step: 4, instruction: 'Il nodo tiene solo se è in tensione.' }
    ],
    warnings: ['Si disfa se non è sotto tensione', 'Non usare per sicurezza vitale'],
    bestFor: ['Accorciare una corda temporaneamente', 'Escludere un tratto danneggiato'],
    avoidWhen: ['Carichi vitali', 'Quando la corda è scarica'],
    difficulty: 'medio',
    worksWet: true,
    suitableFor: ['general', 'tool'],
    loadTypes: ['static'],
    minExperience: 'intermediate'
  },
  {
    id: 'scotta-doppia',
    name: 'Nodo di Scotta Doppio',
    englishName: 'Double Sheet Bend',
    category: ['join'],
    description: 'Versione rinforzata del Nodo di Scotta. Per carichi pesanti con corde di diametro molto diverso.',
    steps: [
      { step: 1, instruction: 'Esegui il Nodo di Scotta semplice.' },
      { step: 2, instruction: 'Porta la corda sottile ancora una volta intorno all\'ansa della corda spessa.' },
      { step: 3, instruction: 'Poi passa di nuovo sotto se stessa come nel nodo semplice.' },
      { step: 4, instruction: 'Tira per stringere.' }
    ],
    warnings: ['La seconda avvolgimento deve essere vicino alla prima'],
    bestFor: ['Corde di diametro molto diverso', 'Carichi pesanti', 'Condizioni bagnate'],
    avoidWhen: [],
    difficulty: 'medio',
    worksWet: true,
    suitableFor: ['bridge', 'rescue', 'general'],
    loadTypes: ['heavy', 'dynamic'],
    minExperience: 'intermediate'
  },
  {
    id: 'bandiera',
    name: 'Nodo Bandiera',
    englishName: 'Flag Bend',
    category: ['hitch', 'binding'],
    description: 'Nodo specifico per legare una bandiera al cordone dell\'asta. Mantiene la bandiera tesa e non si allenta.',
    steps: [
      { step: 1, instruction: 'Passa il cordone dell\'asta attraverso la passante della bandiera.' },
      { step: 2, instruction: 'Porta il cordone attorno alla stecca della bandiera.' },
      { step: 3, instruction: 'Esegui due mezzi colli intorno al cordone principale.' },
      { step: 4, instruction: 'Ripeti per la passante inferiore.' }
    ],
    warnings: ['Controllare che la bandiera sia ben tesa prima di issarla'],
    bestFor: ['Issare bandiere', 'Attacco a drizze'],
    avoidWhen: ['Carichi strutturali'],
    difficulty: 'facile',
    worksWet: true,
    suitableFor: ['flagpole'],
    loadTypes: ['static'],
    minExperience: 'beginner'
  },
  {
    id: 'otto-riattaccato',
    name: 'Nodo a Otto Riattaccato',
    englishName: 'Figure-Eight Follow-Through',
    category: ['climbing', 'loop'],
    description: 'Crea un anello fisso a fine corda per imbrago. È il nodo standard per legarsi in arrampicata.',
    steps: [
      { step: 1, instruction: 'Fai un Nodo Savoia a 50cm dall\'estremità (non stringere).' },
      { step: 2, instruction: 'Passa l\'estremità attraverso il punto di attacco (imbrago).' },
      { step: 3, instruction: 'Ripassi l\'estremità nel nodo seguendo il percorso in senso inverso.' },
      { step: 4, instruction: 'Il nodo finale deve avere forma di 8 doppio.' },
      { step: 5, instruction: 'Lascia 15-20cm di coda e bloccala con un mezzo collo.' }
    ],
    warnings: ['Sempre un mezzo collo di sicurezza sulla coda', 'Far controllare il nodo da un compagno prima di caricare'],
    bestFor: ['Imbrago in arrampicata', 'Nodo di attacco sicuro'],
    avoidWhen: ['Chi non ha formazione specifica'],
    difficulty: 'avanzato',
    worksWet: true,
    suitableFor: ['climbing', 'rescue'],
    loadTypes: ['dynamic', 'heavy'],
    minExperience: 'intermediate'
  },
  {
    id: 'nodo-pesca',
    name: 'Nodo da Pesca (Palomar)',
    englishName: 'Palomar Knot',
    category: ['loop', 'anchor'],
    description: 'Nodo versatile per fissare la corda a un supporto fisso. Mantiene buona resistenza anche con corde sintetiche sottili.',
    steps: [
      { step: 1, instruction: 'Piega la corda a doppio per formare un\'ansa di circa 15cm.' },
      { step: 2, instruction: 'Passa l\'ansa attraverso l\'anello o il gancio.' },
      { step: 3, instruction: 'Fai un nodo semplice con le due corde doppie (non l\'ansa).' },
      { step: 4, instruction: 'Passa l\'ansa sopra il gancio.' },
      { step: 5, instruction: 'Tira le due estremità per stringere.' }
    ],
    warnings: ['Verifica che le spire siano ordinate e non incrociate'],
    bestFor: ['Corde sintetiche sottili', 'Ancoraggio a ganci/anelli'],
    avoidWhen: ['Corde molto spesse'],
    difficulty: 'medio',
    worksWet: true,
    suitableFor: ['tent', 'general', 'tool'],
    loadTypes: ['static', 'dynamic'],
    minExperience: 'beginner'
  },
  {
    id: 'nodo-rete',
    name: 'Nodo da Rete',
    englishName: 'Net Knot / Sheet Bend variation',
    category: ['binding', 'join'],
    description: 'Usato per costruire reti e legature di strutture (es. ponti di corda). Tiene anche con corde bagnate.',
    steps: [
      { step: 1, instruction: 'Forma un\'ansa con la corda orizzontale.' },
      { step: 2, instruction: 'Passa la corda verticale attraverso l\'ansa dal basso.' },
      { step: 3, instruction: 'Porta la corda verticale intorno ai due bracci dell\'ansa.' },
      { step: 4, instruction: 'Passa sotto se stessa e stringi.' }
    ],
    warnings: ['Le spire devono essere tutte nella stessa direzione'],
    bestFor: ['Costruzione reti', 'Ponti di corda', 'Strutture scout'],
    avoidWhen: ['Carichi pesanti senza test'],
    difficulty: 'medio',
    worksWet: true,
    suitableFor: ['bridge', 'tool'],
    loadTypes: ['static'],
    minExperience: 'intermediate'
  }
];

const experienceOrder: Record<string, number> = { beginner: 0, intermediate: 1, expert: 2 };

@Injectable({ providedIn: 'root' })
export class KnotRecommendationService {
  getRecommendations(query: KnotQuery): KnotResult[] {
    return KNOTS
      .map(knot => ({ knot, score: this.score(knot, query), reason: this.reason(knot, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  private score(knot: Knot, q: KnotQuery): number {
    let s = 0;
    if (knot.category.includes(q.useCase)) s += 30;
    if (knot.suitableFor.includes(q.purpose)) s += 20;
    if (knot.loadTypes.includes(q.loadType)) s += 15;
    if (q.ropeCondition === 'wet' && knot.worksWet) s += 15;
    if (q.ropeCondition === 'dry') s += 5;
    if (experienceOrder[q.experience] >= experienceOrder[knot.minExperience]) s += 10;
    else s -= 20;
    if (q.windIntensity === 'strong' && (knot.loadTypes.includes('dynamic') || knot.loadTypes.includes('heavy'))) s += 10;
    if (knot.difficulty === 'facile') s += 5;
    if (knot.difficulty === 'avanzato' && q.experience === 'beginner') s -= 15;
    return Math.max(0, s);
  }

  private reason(knot: Knot, q: KnotQuery): string {
    const parts: string[] = [];
    if (knot.category.includes(q.useCase)) parts.push(`adatto per ${q.useCase}`);
    if (knot.suitableFor.includes(q.purpose)) parts.push(`ideale per ${q.purpose}`);
    if (q.ropeCondition === 'wet' && knot.worksWet) parts.push('funziona bagnato');
    if (q.windIntensity === 'strong' && knot.loadTypes.includes('dynamic')) parts.push('regge al vento forte');
    return parts.join(' · ') || 'Scelta bilanciata per le condizioni indicate';
  }

  getAllKnots(): Knot[] { return KNOTS; }
}
