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

  // Defender panel / Analysis page
  opponentAnalysis:   { en: 'Opponent Analysis', de: 'Gegner-Analyse', fr: 'Analyse adversaire', it: 'Analisi avversario', es: 'Análisis rival' },
  noSuperEffective:   { en: 'No team move is super effective', de: 'Keine super-effektive Attacke im Team', fr: 'Aucune capacité super efficace', it: 'Nessuna mossa super efficace', es: 'Ningún movimiento es súper efectivo' },
  addOpponent:        { en: '+ Add opponent', de: '+ Gegner hinzufügen', fr: '+ Ajouter adversaire', it: '+ Aggiungi avversario', es: '+ Añadir rival' },
  clearAll:           { en: 'Clear all', de: 'Alle leeren', fr: 'Tout vider', it: 'Svuota tutto', es: 'Vaciar todo' },
  opponent:           { en: 'Opponent', de: 'Gegner', fr: 'Adversaire', it: 'Avversario', es: 'Rival' },
  remove:             { en: 'Remove', de: 'Entfernen', fr: 'Supprimer', it: 'Rimuovi', es: 'Eliminar' },
  loadTrainer:        { en: 'Load trainer...', de: 'Trainer laden...', fr: 'Charger dresseur...', it: 'Carica allenatore...', es: 'Cargar entrenador...' },
  gymLeaders:         { en: 'Gym Leaders', de: 'Arenaleiter', fr: 'Champions d\'Arène', it: 'Capopalestra', es: 'Líderes de Gimnasio' },
  eliteFour:          { en: 'Elite Four', de: 'Top Vier', fr: 'Conseil des Quatre', it: 'Elite Quattro', es: 'Alto Mando' },
  eliteFourRematch:   { en: 'Elite Four (Rematch)', de: 'Top Vier (Rückkampf)', fr: 'Conseil des Quatre (Revanche)', it: 'Elite Quattro (Rivincita)', es: 'Alto Mando (Revancha)' },
  rivalBattles:       { en: 'Rival', de: 'Rivale', fr: 'Rival', it: 'Rivale', es: 'Rival' },
  champion:           { en: 'Champion', de: 'Champion', fr: 'Champion', it: 'Campione', es: 'Campeón' },
  championRematch:    { en: 'Champion (Rematch)', de: 'Champion (Rückkampf)', fr: 'Champion (Revanche)', it: 'Campione (Rivincita)', es: 'Campeón (Revancha)' },
  giovanniGroup:      { en: 'Giovanni', de: 'Giovanni', fr: 'Giovanni', it: 'Giovanni', es: 'Giovanni' },

  // Page nav
  pageTeam:           { en: 'Team', de: 'Team', fr: 'Équipe', it: 'Squadra', es: 'Equipo' },
  pageAnalyse:        { en: 'Analysis', de: 'Analyse', fr: 'Analyse', it: 'Analisi', es: 'Análisis' },

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

  // Roster
  roster:             { en: 'Pokémon Box', de: 'Pokémon-Box', fr: 'Boîte Pokémon', it: 'Box Pokémon', es: 'Caja Pokémon' },
  addToRoster:        { en: 'Save to Box', de: 'In Box speichern', fr: 'Sauver dans la boîte', it: 'Salva nel box', es: 'Guardar en caja' },
  saveToRoster:       { en: '+ Box', de: '+ Box', fr: '+ Boîte', it: '+ Box', es: '+ Caja' },
  rosterLabelPlaceholder: { en: 'Label (optional)...', de: 'Bezeichnung (optional)...', fr: 'Étiquette (optionnelle)...', it: 'Etichetta (opzionale)...', es: 'Etiqueta (opcional)...' },
  assignToSlot:       { en: 'Assign to slot', de: 'Slot zuweisen', fr: 'Assigner au slot', it: 'Assegna allo slot', es: 'Asignar al slot' },
  noRosterEntries:    { en: 'Box is empty', de: 'Box ist leer', fr: 'Boîte vide', it: 'Box vuoto', es: 'Caja vacía' },
  editEntry:          { en: 'Edit', de: 'Bearb.', fr: 'Modifier', it: 'Modifica', es: 'Editar' },
  cancelEdit:         { en: 'Cancel', de: 'Abbrechen', fr: 'Annuler', it: 'Annulla', es: 'Cancelar' },
  confirmAssign:      { en: 'Assign to which slot?', de: 'In welchen Slot?', fr: 'Quel slot?', it: 'Quale slot?', es: '¿Qué slot?' },

  // Items
  chooseItem:         { en: 'Choose item...', de: 'Item wählen...', fr: 'Choisir objet...', it: 'Scegli oggetto...', es: 'Elegir objeto...' },
  searchItem:         { en: 'Search item...', de: 'Item suchen...', fr: 'Rechercher objet...', it: 'Cerca oggetto...', es: 'Buscar objeto...' },
  noItemsFound:       { en: 'No items found', de: 'Kein Item gefunden', fr: 'Aucun objet trouvé', it: 'Nessun oggetto trovato', es: 'No se encontró objeto' },
  heldItem:           { en: 'Item', de: 'Item', fr: 'Objet', it: 'Oggetto', es: 'Objeto' },

  // Advanced mode
  advancedMode:       { en: 'Advanced', de: 'Erweitert', fr: 'Avancé', it: 'Avanzato', es: 'Avanzado' },
  nature:             { en: 'Nature', de: 'Wesen', fr: 'Nature', it: 'Natura', es: 'Naturaleza' },
  noNature:           { en: '— Nature —', de: '— Wesen —', fr: '— Nature —', it: '— Natura —', es: '— Naturaleza —' },
  evTotal:            { en: 'EVs', de: 'EW', fr: 'VA', it: 'PE', es: 'PE' },
  statHp:             { en: 'HP', de: 'KP', fr: 'PV', it: 'PS', es: 'PS' },
  statAtk:            { en: 'Atk', de: 'ANG', fr: 'Atq', it: 'Att', es: 'Ata' },
  statDef:            { en: 'Def', de: 'VER', fr: 'Déf', it: 'Dif', es: 'Def' },
  statSpAtk:          { en: 'SpAtk', de: 'SPA', fr: 'SpAtq', it: 'SpAtt', es: 'SpAta' },
  statSpDef:          { en: 'SpDef', de: 'SPV', fr: 'SpDéf', it: 'SpDif', es: 'SpDef' },
  statSpe:            { en: 'Spe', de: 'INI', fr: 'Vit', it: 'Vel', es: 'Vel' },

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
