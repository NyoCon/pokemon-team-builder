import type { Lang } from '../types'

const translations = {
  // Header
  loadingData:        { en: 'Loading data...', de: 'Daten werden geladen...', fr: 'Chargement...', it: 'Caricamento...', es: 'Cargando...' },
  pokemonLoaded:      { en: '{n} Pokémon loaded', de: '{n} Pokémon geladen', fr: '{n} Pokémon chargés', it: '{n} Pokémon caricati', es: '{n} Pokémon cargados' },
  loadError:          { en: 'Error loading data. Please reload.', de: 'Fehler beim Laden. Bitte neu laden.', fr: 'Erreur de chargement. Rechargez.', it: 'Errore di caricamento. Ricaricare.', es: 'Error al cargar. Recargue.' },

  // Pokemon picker
  choosePokemon:      { en: 'Choose Pokémon...', de: 'Pokémon wählen...', fr: 'Choisir Pokémon...', it: 'Scegli Pokémon...', es: 'Elegir Pokémon...' },
  chooseOpponent:     { en: 'Choose opponent...', de: 'Gegner wählen...', fr: 'Choisir adversaire...', it: 'Scegli avversario...', es: 'Elegir rival...' },
  search:             { en: 'Search...', de: 'Suchen...', fr: 'Rechercher...', it: 'Cerca...', es: 'Buscar...' },
  noPokemonFound:     { en: 'No Pokémon found', de: 'Kein Pokémon gefunden', fr: 'Aucun Pokémon trouvé', it: 'Nessun Pokémon trovato', es: 'No se encontró Pokémon' },

  // Move picker
  chooseMove:         { en: 'Choose move...', de: 'Attacke wählen...', fr: 'Choisir capacité...', it: 'Scegli mossa...', es: 'Elegir movimiento...' },
  searchMove:         { en: 'Search move...', de: 'Attacke suchen...', fr: 'Rechercher capacité...', it: 'Cerca mossa...', es: 'Buscar movimiento...' },
  noMovesFound:       { en: 'No moves found', de: 'Keine Attacken gefunden', fr: 'Aucune capacité trouvée', it: 'Nessuna mossa trovata', es: 'No se encontraron movimientos' },

  // Slot
  empty:              { en: '— empty —', de: '— leer —', fr: '— vide —', it: '— vuoto —', es: '— vacío —' },

  // Defender panel
  opponentAnalysis:   { en: 'Opponent Analysis', de: 'Gegner-Analyse', fr: 'Analyse adversaire', it: 'Analisi avversario', es: 'Análisis rival' },
  noSuperEffective:   { en: 'No team move is super effective', de: 'Keine super-effektive Attacke im Team', fr: 'Aucune capacité super efficace', it: 'Nessuna mossa super efficace', es: 'Ningún movimiento es súper efectivo' },

  // Team manager
  teams:              { en: 'Teams', de: 'Teams', fr: 'Équipes', it: 'Squadre', es: 'Equipos' },
  shareTeam:          { en: '⬡ Share team', de: '⬡ Team teilen', fr: '⬡ Partager', it: '⬡ Condividi', es: '⬡ Compartir' },
  linkCopied:         { en: '✓ Link copied!', de: '✓ Link kopiert!', fr: '✓ Lien copié!', it: '✓ Link copiato!', es: '✓ ¡Enlace copiado!' },
  clearTeam:          { en: 'Clear', de: 'Leeren', fr: 'Vider', it: 'Svuota', es: 'Vaciar' },
  teamNamePlaceholder:{ en: 'Team name...', de: 'Team-Name...', fr: 'Nom d\'équipe...', it: 'Nome squadra...', es: 'Nombre del equipo...' },
  save:               { en: 'Save', de: 'Speichern', fr: 'Sauvegarder', it: 'Salva', es: 'Guardar' },
  saved:              { en: '✓', de: '✓', fr: '✓', it: '✓', es: '✓' },
  noSavedTeams:       { en: 'No saved teams', de: 'Keine gespeicherten Teams', fr: 'Aucune équipe sauvegardée', it: 'Nessuna squadra salvata', es: 'No hay equipos guardados' },
  load:               { en: 'Load', de: 'Laden', fr: 'Charger', it: 'Carica', es: 'Cargar' },

  // Footer
  dataSource:         { en: 'Data: PokéAPI · FireRed / LeafGreen', de: 'Daten: PokéAPI · Feuerrot / Blattgrün', fr: 'Données: PokéAPI · Rouge Feu / Vert Feuille', it: 'Dati: PokéAPI · Rosso Fuoco / Verde Foglia', es: 'Datos: PokéAPI · Rojo Fuego / Verde Hoja' },
} satisfies Record<string, Record<Lang, string>>

export type TKey = keyof typeof translations

export function t(key: TKey, lang: Lang, vars?: Record<string, string | number>): string {
  let str = translations[key][lang] || translations[key]['en']
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v))
    }
  }
  return str
}
