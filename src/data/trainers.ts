import type { Lang } from '../types'

export interface Trainer {
  id: string
  names: Record<Lang, string>
  group: 'gym' | 'elite4' | 'elite4-rematch' | 'champion' | 'champion-rematch' | 'rival' | 'giovanni'
  pokemonIds: number[]
}

// FireRed / LeafGreen — Gym Leaders & Elite Four
// Pokemon IDs: National Dex numbers (all within 1–151)
export const TRAINERS: Trainer[] = [
  // ── Gym Leaders ────────────────────────────────────────────────
  {
    id: 'brock',
    names: { en: 'Brock', de: 'Rocko', fr: 'Pierre', it: 'Brock', es: 'Brock' },
    group: 'gym',
    pokemonIds: [74, 95], // Geodude, Onix
  },
  {
    id: 'misty',
    names: { en: 'Misty', de: 'Misty', fr: 'Ondine', it: 'Misty', es: 'Misty' },
    group: 'gym',
    pokemonIds: [120, 121], // Staryu, Starmie
  },
  {
    id: 'surge',
    names: { en: 'Lt. Surge', de: 'Major Bob', fr: 'Major Bob', it: 'Gt. Surge', es: 'Cte. Surge' },
    group: 'gym',
    pokemonIds: [100, 25, 26], // Voltorb, Pikachu, Raichu
  },
  {
    id: 'erika',
    names: { en: 'Erika', de: 'Erika', fr: 'Erika', it: 'Erika', es: 'Erika' },
    group: 'gym',
    pokemonIds: [71, 114, 45], // Victreebel, Tangela, Vileplume
  },
  {
    id: 'koga',
    names: { en: 'Koga', de: 'Koga', fr: 'Koga', it: 'Koga', es: 'Koga' },
    group: 'gym',
    pokemonIds: [109, 89, 109, 110], // Koffing, Muk, Koffing, Weezing
  },
  {
    id: 'sabrina',
    names: { en: 'Sabrina', de: 'Sabrina', fr: 'Sabrina', it: 'Sabrina', es: 'Sabrina' },
    group: 'gym',
    pokemonIds: [64, 122, 49, 65], // Kadabra, Mr. Mime, Venomoth, Alakazam
  },
  {
    id: 'blaine',
    names: { en: 'Blaine', de: 'Pyrus', fr: 'Stanislas', it: 'Blaine', es: 'Blaine' },
    group: 'gym',
    pokemonIds: [58, 77, 78, 59], // Growlithe, Ponyta, Rapidash, Arcanine
  },
  {
    id: 'giovanni',
    names: { en: 'Giovanni', de: 'Giovanni', fr: 'Giovanni', it: 'Giovanni', es: 'Giovanni' },
    group: 'gym',
    pokemonIds: [111, 51, 31, 34, 112], // Rhyhorn, Dugtrio, Nidoqueen, Nidoking, Rhydon
  },

  // ── Elite Four ──────────────────────────────────────────────────
  {
    id: 'lorelei',
    names: { en: 'Lorelei', de: 'Lorelei', fr: 'Lorelei', it: 'Lorelei', es: 'Lorelei' },
    group: 'elite4',
    pokemonIds: [87, 91, 80, 124, 131], // Dewgong, Cloyster, Slowbro, Jynx, Lapras
  },
  {
    id: 'bruno',
    names: { en: 'Bruno', de: 'Bruno', fr: 'Bruno', it: 'Bruno', es: 'Bruno' },
    group: 'elite4',
    pokemonIds: [95, 107, 106, 95, 68], // Onix, Hitmonchan, Hitmonlee, Onix, Machamp
  },
  {
    id: 'agatha',
    names: { en: 'Agatha', de: 'Agathe', fr: 'Agatha', it: 'Agatha', es: 'Agatha' },
    group: 'elite4',
    pokemonIds: [94, 93, 94, 24, 94], // Gengar, Haunter, Gengar, Arbok, Gengar
  },
  {
    id: 'lance',
    names: { en: 'Lance', de: 'Siegfried', fr: 'Peter', it: 'Luca', es: 'Bruno' },
    group: 'elite4',
    pokemonIds: [130, 148, 148, 142, 149], // Gyarados, Dragonair, Dragonair, Aerodactyl, Dragonite
  },

  // ── Elite Four Rematch (post-National Dex) ──────────────────────
  {
    id: 'lorelei-rematch',
    names: { en: 'Lorelei', de: 'Lorelei', fr: 'Lorelei', it: 'Lorelei', es: 'Lorelei' },
    group: 'elite4-rematch',
    pokemonIds: [87, 91, 221, 124, 131], // Dewgong, Cloyster, Piloswine, Jynx, Lapras
  },
  {
    id: 'bruno-rematch',
    names: { en: 'Bruno', de: 'Bruno', fr: 'Bruno', it: 'Bruno', es: 'Bruno' },
    group: 'elite4-rematch',
    pokemonIds: [208, 107, 106, 208, 68], // Steelix, Hitmonchan, Hitmonlee, Steelix, Machamp
  },
  {
    id: 'agatha-rematch',
    names: { en: 'Agatha', de: 'Agathe', fr: 'Agatha', it: 'Agatha', es: 'Agatha' },
    group: 'elite4-rematch',
    pokemonIds: [94, 169, 200, 24, 94], // Gengar, Crobat, Misdreavus, Arbok, Gengar
  },
  {
    id: 'lance-rematch',
    names: { en: 'Lance', de: 'Siegfried', fr: 'Peter', it: 'Luca', es: 'Bruno' },
    group: 'elite4-rematch',
    pokemonIds: [130, 149, 230, 142, 149], // Gyarados, Dragonite, Kingdra, Aerodactyl, Dragonite
  },

  // ── Giovanni (non-Gym encounters) ────────────────────────────────
  {
    id: 'giovanni-hideout',
    names: { en: 'Giovanni – Rocket Hideout', de: 'Giovanni – Rocket-Versteck', fr: 'Giovanni – QG Rocket', it: 'Giovanni – Covo Rocket', es: 'Giovanni – Guarida Rocket' },
    group: 'giovanni',
    pokemonIds: [95, 111, 115], // Onix, Rhyhorn, Kangaskhan
  },
  {
    id: 'giovanni-silph',
    names: { en: 'Giovanni – Silph Co.', de: 'Giovanni – Silph AG', fr: 'Giovanni – Silph Co.', it: 'Giovanni – Silph S.p.A.', es: 'Giovanni – Silph S.A.' },
    group: 'giovanni',
    pokemonIds: [33, 111, 115, 31], // Nidorino, Rhyhorn, Kangaskhan, Nidoqueen
  },

  // ── Rival battles (3 variants per key encounter) ─────────────────
  // Labels show rival's final starter (= counter to player's choice)
  // "vs Charizard" = player chose Bulbasaur
  // "vs Blastoise" = player chose Charmander
  // "vs Venusaur"  = player chose Squirtle

  // Azuria City / Cerulean
  {
    id: 'rival-cerulean-char',
    names: { en: 'Rival – Cerulean (vs Charizard)', de: 'Rivale – Azuria (vs Glurak)', fr: 'Rival – Azuria (vs Dracaufeu)', it: 'Rivale – Celestopoli (vs Charizard)', es: 'Rival – Celeste (vs Charizard)' },
    group: 'rival',
    pokemonIds: [17, 63, 19, 4], // Pidgeotto, Abra, Rattata, Charmander
  },
  {
    id: 'rival-cerulean-blast',
    names: { en: 'Rival – Cerulean (vs Blastoise)', de: 'Rivale – Azuria (vs Turtok)', fr: 'Rival – Azuria (vs Tortank)', it: 'Rivale – Celestopoli (vs Blastoise)', es: 'Rival – Celeste (vs Blastoise)' },
    group: 'rival',
    pokemonIds: [17, 63, 19, 7], // Pidgeotto, Abra, Rattata, Squirtle
  },
  {
    id: 'rival-cerulean-venu',
    names: { en: 'Rival – Cerulean (vs Venusaur)', de: 'Rivale – Azuria (vs Bisaflor)', fr: 'Rival – Azuria (vs Florizarre)', it: 'Rivale – Celestopoli (vs Venusaur)', es: 'Rival – Celeste (vs Venusaur)' },
    group: 'rival',
    pokemonIds: [17, 63, 19, 1], // Pidgeotto, Abra, Rattata, Bulbasaur
  },

  // S.S. Anne
  {
    id: 'rival-anne-char',
    names: { en: 'Rival – S.S. Anne (vs Charizard)', de: 'Rivale – S.S. Anne (vs Glurak)', fr: 'Rival – S.S. Anne (vs Dracaufeu)', it: 'Rivale – N. S. Anna (vs Charizard)', es: 'Rival – S.S. Anne (vs Charizard)' },
    group: 'rival',
    pokemonIds: [17, 20, 64, 5], // Pidgeotto, Raticate, Kadabra, Charmeleon
  },
  {
    id: 'rival-anne-blast',
    names: { en: 'Rival – S.S. Anne (vs Blastoise)', de: 'Rivale – S.S. Anne (vs Turtok)', fr: 'Rival – S.S. Anne (vs Tortank)', it: 'Rivale – N. S. Anna (vs Blastoise)', es: 'Rival – S.S. Anne (vs Blastoise)' },
    group: 'rival',
    pokemonIds: [17, 20, 64, 8], // Pidgeotto, Raticate, Kadabra, Wartortle
  },
  {
    id: 'rival-anne-venu',
    names: { en: 'Rival – S.S. Anne (vs Venusaur)', de: 'Rivale – S.S. Anne (vs Bisaflor)', fr: 'Rival – S.S. Anne (vs Florizarre)', it: 'Rivale – N. S. Anna (vs Venusaur)', es: 'Rival – S.S. Anne (vs Venusaur)' },
    group: 'rival',
    pokemonIds: [17, 20, 64, 2], // Pidgeotto, Raticate, Kadabra, Ivysaur
  },

  // Pokémon Tower (Lavender)
  {
    id: 'rival-lavender-char',
    names: { en: 'Rival – Lavender Tower (vs Charizard)', de: 'Rivale – Lavandia-Turm (vs Glurak)', fr: 'Rival – Tour Lavanville (vs Dracaufeu)', it: 'Rivale – Torre Lavanda (vs Charizard)', es: 'Rival – Torre Lavanda (vs Charizard)' },
    group: 'rival',
    pokemonIds: [17, 102, 130, 64, 5], // Pidgeotto, Exeggcute, Gyarados, Kadabra, Charmeleon
  },
  {
    id: 'rival-lavender-blast',
    names: { en: 'Rival – Lavender Tower (vs Blastoise)', de: 'Rivale – Lavandia-Turm (vs Turtok)', fr: 'Rival – Tour Lavanville (vs Tortank)', it: 'Rivale – Torre Lavanda (vs Blastoise)', es: 'Rival – Torre Lavanda (vs Blastoise)' },
    group: 'rival',
    pokemonIds: [17, 58, 102, 64, 8], // Pidgeotto, Growlithe, Exeggcute, Kadabra, Wartortle
  },
  {
    id: 'rival-lavender-venu',
    names: { en: 'Rival – Lavender Tower (vs Venusaur)', de: 'Rivale – Lavandia-Turm (vs Bisaflor)', fr: 'Rival – Tour Lavanville (vs Florizarre)', it: 'Rivale – Torre Lavanda (vs Venusaur)', es: 'Rival – Torre Lavanda (vs Venusaur)' },
    group: 'rival',
    pokemonIds: [17, 130, 58, 64, 2], // Pidgeotto, Gyarados, Growlithe, Kadabra, Ivysaur
  },

  // Silph Co.
  {
    id: 'rival-silph-char',
    names: { en: 'Rival – Silph Co. (vs Charizard)', de: 'Rivale – Silph AG (vs Glurak)', fr: 'Rival – Silph Co. (vs Dracaufeu)', it: 'Rivale – Silph S.p.A. (vs Charizard)', es: 'Rival – Silph S.A. (vs Charizard)' },
    group: 'rival',
    pokemonIds: [18, 102, 130, 65, 6], // Pidgeot, Exeggcute, Gyarados, Alakazam, Charizard
  },
  {
    id: 'rival-silph-blast',
    names: { en: 'Rival – Silph Co. (vs Blastoise)', de: 'Rivale – Silph AG (vs Turtok)', fr: 'Rival – Silph Co. (vs Tortank)', it: 'Rivale – Silph S.p.A. (vs Blastoise)', es: 'Rival – Silph S.A. (vs Blastoise)' },
    group: 'rival',
    pokemonIds: [18, 102, 130, 65, 9], // Pidgeot, Exeggcute, Gyarados, Alakazam, Blastoise
  },
  {
    id: 'rival-silph-venu',
    names: { en: 'Rival – Silph Co. (vs Venusaur)', de: 'Rivale – Silph AG (vs Bisaflor)', fr: 'Rival – Silph Co. (vs Florizarre)', it: 'Rivale – Silph S.p.A. (vs Venusaur)', es: 'Rival – Silph S.A. (vs Venusaur)' },
    group: 'rival',
    pokemonIds: [18, 102, 59, 65, 3], // Pidgeot, Exeggcute, Arcanine, Alakazam, Venusaur
  },

  // Route 22 (pre-Elite Four)
  {
    id: 'rival-route22-char',
    names: { en: 'Rival – Route 22 (vs Charizard)', de: 'Rivale – Route 22 (vs Glurak)', fr: 'Rival – Route 22 (vs Dracaufeu)', it: 'Rivale – Percorso 22 (vs Charizard)', es: 'Rival – Ruta 22 (vs Charizard)' },
    group: 'rival',
    pokemonIds: [18, 111, 102, 130, 65, 6], // Pidgeot, Rhyhorn, Exeggcute, Gyarados, Alakazam, Charizard
  },
  {
    id: 'rival-route22-blast',
    names: { en: 'Rival – Route 22 (vs Blastoise)', de: 'Rivale – Route 22 (vs Turtok)', fr: 'Rival – Route 22 (vs Tortank)', it: 'Rivale – Percorso 22 (vs Blastoise)', es: 'Rival – Ruta 22 (vs Blastoise)' },
    group: 'rival',
    pokemonIds: [18, 111, 58, 102, 65, 9], // Pidgeot, Rhyhorn, Growlithe, Exeggcute, Alakazam, Blastoise
  },
  {
    id: 'rival-route22-venu',
    names: { en: 'Rival – Route 22 (vs Venusaur)', de: 'Rivale – Route 22 (vs Bisaflor)', fr: 'Rival – Route 22 (vs Florizarre)', it: 'Rivale – Percorso 22 (vs Venusaur)', es: 'Rival – Ruta 22 (vs Venusaur)' },
    group: 'rival',
    pokemonIds: [18, 111, 130, 59, 65, 3], // Pidgeot, Rhyhorn, Gyarados, Arcanine, Alakazam, Venusaur
  },

  // ── Champion Blue ─────────────────────────────────────────────────
  {
    id: 'champion-char',
    names: { en: 'Champion Blue (vs Charizard)', de: 'Champion Blau (vs Glurak)', fr: 'Champion Blue (vs Dracaufeu)', it: 'Campione Blu (vs Charizard)', es: 'Campeón Azul (vs Charizard)' },
    group: 'champion',
    pokemonIds: [18, 65, 112, 103, 130, 6], // Pidgeot, Alakazam, Rhydon, Exeggutor, Gyarados, Charizard
  },
  {
    id: 'champion-blast',
    names: { en: 'Champion Blue (vs Blastoise)', de: 'Champion Blau (vs Turtok)', fr: 'Champion Blue (vs Tortank)', it: 'Campione Blu (vs Blastoise)', es: 'Campeón Azul (vs Blastoise)' },
    group: 'champion',
    pokemonIds: [18, 65, 112, 59, 103, 9], // Pidgeot, Alakazam, Rhydon, Arcanine, Exeggutor, Blastoise
  },
  {
    id: 'champion-venu',
    names: { en: 'Champion Blue (vs Venusaur)', de: 'Champion Blau (vs Bisaflor)', fr: 'Champion Blue (vs Florizarre)', it: 'Campione Blu (vs Venusaur)', es: 'Campeón Azul (vs Venusaur)' },
    group: 'champion',
    pokemonIds: [18, 65, 112, 130, 59, 3], // Pidgeot, Alakazam, Rhydon, Gyarados, Arcanine, Venusaur
  },
  // ── Champion Blue (Rematch, post-National Dex) ───────────────────
  {
    id: 'champion-rematch-char',
    names: { en: 'Champion Blue – Rematch (vs Charizard)', de: 'Champion Blau – Rückkampf (vs Glurak)', fr: 'Champion Blue – Revanche (vs Dracaufeu)', it: 'Campione Blu – Rivincita (vs Charizard)', es: 'Campeón Azul – Revancha (vs Charizard)' },
    group: 'champion-rematch',
    pokemonIds: [214, 65, 248, 103, 130, 6], // Heracross, Alakazam, Tyranitar, Exeggutor, Gyarados, Charizard
  },
  {
    id: 'champion-rematch-blast',
    names: { en: 'Champion Blue – Rematch (vs Blastoise)', de: 'Champion Blau – Rückkampf (vs Turtok)', fr: 'Champion Blue – Revanche (vs Tortank)', it: 'Campione Blu – Rivincita (vs Blastoise)', es: 'Campeón Azul – Revancha (vs Blastoise)' },
    group: 'champion-rematch',
    pokemonIds: [214, 65, 248, 59, 103, 9], // Heracross, Alakazam, Tyranitar, Arcanine, Exeggutor, Blastoise
  },
  {
    id: 'champion-rematch-venu',
    names: { en: 'Champion Blue – Rematch (vs Venusaur)', de: 'Champion Blau – Rückkampf (vs Bisaflor)', fr: 'Champion Blue – Revanche (vs Florizarre)', it: 'Campione Blu – Rivincita (vs Venusaur)', es: 'Campeón Azul – Revancha (vs Venusaur)' },
    group: 'champion-rematch',
    pokemonIds: [214, 65, 248, 130, 59, 3], // Heracross, Alakazam, Tyranitar, Gyarados, Arcanine, Venusaur
  },
]

export const GYM_LEADERS        = TRAINERS.filter(t => t.group === 'gym')
export const ELITE_FOUR         = TRAINERS.filter(t => t.group === 'elite4')
export const ELITE_FOUR_REMATCH = TRAINERS.filter(t => t.group === 'elite4-rematch')
export const GIOVANNI_ENCOUNTERS = TRAINERS.filter(t => t.group === 'giovanni')
export const RIVAL_BATTLES      = TRAINERS.filter(t => t.group === 'rival')
export const CHAMPION           = TRAINERS.filter(t => t.group === 'champion')
export const CHAMPION_REMATCH   = TRAINERS.filter(t => t.group === 'champion-rematch')
