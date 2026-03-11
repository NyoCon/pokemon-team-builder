export type StatKey = 'atk' | 'def' | 'spatk' | 'spdef' | 'spe'

export interface Nature {
  id: string
  names: { en: string; de: string; fr: string; it: string; es: string }
  plus: StatKey | null  // boosted stat (×1.1), null = neutral
  minus: StatKey | null // reduced stat (×0.9), null = neutral
}

export const NATURES: Nature[] = [
  { id: 'hardy',   names: { en: 'Hardy',   de: 'Robust',   fr: 'Hardi',     it: 'Ardente',   es: 'Audaz'     }, plus: null,    minus: null    },
  { id: 'lonely',  names: { en: 'Lonely',  de: 'Solo',     fr: 'Solitaire', it: 'Solitario', es: 'Huraño'    }, plus: 'atk',   minus: 'def'   },
  { id: 'brave',   names: { en: 'Brave',   de: 'Kühn',     fr: 'Brave',     it: 'Ardito',    es: 'Audaz'     }, plus: 'atk',   minus: 'spe'   },
  { id: 'adamant', names: { en: 'Adamant', de: 'Hart',     fr: 'Rigide',    it: 'Adamante',  es: 'Firme'     }, plus: 'atk',   minus: 'spatk' },
  { id: 'naughty', names: { en: 'Naughty', de: 'Frech',    fr: 'Mauvais',   it: 'Dispettoso',es: 'Pícaro'    }, plus: 'atk',   minus: 'spdef' },
  { id: 'bold',    names: { en: 'Bold',    de: 'Keck',     fr: 'Assuré',    it: 'Ardito',    es: 'Osado'     }, plus: 'def',   minus: 'atk'   },
  { id: 'docile',  names: { en: 'Docile',  de: 'Sanft',    fr: 'Docile',    it: 'Docile',    es: 'Dócil'     }, plus: null,    minus: null    },
  { id: 'relaxed', names: { en: 'Relaxed', de: 'Locker',   fr: 'Relax',     it: 'Rilassato', es: 'Plácido'   }, plus: 'def',   minus: 'spe'   },
  { id: 'impish',  names: { en: 'Impish',  de: 'Pfiffig',  fr: 'Malin',     it: 'Furbetto',  es: 'Pícaro'    }, plus: 'def',   minus: 'spatk' },
  { id: 'lax',     names: { en: 'Lax',     de: 'Lasch',    fr: 'Lâche',     it: 'Indolente', es: 'Flojo'     }, plus: 'def',   minus: 'spdef' },
  { id: 'timid',   names: { en: 'Timid',   de: 'Scheu',    fr: 'Timide',    it: 'Timido',    es: 'Miedoso'   }, plus: 'spe',   minus: 'atk'   },
  { id: 'hasty',   names: { en: 'Hasty',   de: 'Hastig',   fr: 'Pressé',    it: 'Frettoloso',es: 'Activo'    }, plus: 'spe',   minus: 'def'   },
  { id: 'serious', names: { en: 'Serious', de: 'Ernst',    fr: 'Sérieux',   it: 'Serio',     es: 'Serio'     }, plus: null,    minus: null    },
  { id: 'jolly',   names: { en: 'Jolly',   de: 'Froh',     fr: 'Jovial',    it: 'Gaio',      es: 'Alegre'    }, plus: 'spe',   minus: 'spatk' },
  { id: 'naive',   names: { en: 'Naive',   de: 'Naiv',     fr: 'Naïf',      it: 'Ingenuo',   es: 'Ingenuo'   }, plus: 'spe',   minus: 'spdef' },
  { id: 'modest',  names: { en: 'Modest',  de: 'Mäßig',    fr: 'Modeste',   it: 'Modesto',   es: 'Modesto'   }, plus: 'spatk', minus: 'atk'   },
  { id: 'mild',    names: { en: 'Mild',    de: 'Mild',     fr: 'Doux',      it: 'Mite',      es: 'Afable'    }, plus: 'spatk', minus: 'def'   },
  { id: 'quiet',   names: { en: 'Quiet',   de: 'Ruhig',    fr: 'Discret',   it: 'Quieto',    es: 'Manso'     }, plus: 'spatk', minus: 'spe'   },
  { id: 'bashful', names: { en: 'Bashful', de: 'Zaghaft',  fr: 'Pudique',   it: 'Timido',    es: 'Tímido'    }, plus: null,    minus: null    },
  { id: 'rash',    names: { en: 'Rash',    de: 'Hitzig',   fr: 'Foufou',    it: 'Impulsivo', es: 'Activo'    }, plus: 'spatk', minus: 'spdef' },
  { id: 'calm',    names: { en: 'Calm',    de: 'Still',    fr: 'Calme',     it: 'Calmo',     es: 'Sereno'    }, plus: 'spdef', minus: 'atk'   },
  { id: 'gentle',  names: { en: 'Gentle',  de: 'Zart',     fr: 'Doux',      it: 'Gentile',   es: 'Amable'    }, plus: 'spdef', minus: 'def'   },
  { id: 'sassy',   names: { en: 'Sassy',   de: 'Kess',     fr: 'Effronté',  it: 'Impertinente', es: 'Grosero' }, plus: 'spdef', minus: 'spe'  },
  { id: 'careful', names: { en: 'Careful', de: 'Sorgfalt', fr: 'Prudent',   it: 'Cauto',     es: 'Cauto'     }, plus: 'spdef', minus: 'spatk' },
  { id: 'quirky',  names: { en: 'Quirky',  de: 'Seltsam',  fr: 'Bizarre',   it: 'Strano',    es: 'Raro'      }, plus: null,    minus: null    },
]

export const NATURE_BY_ID: Record<string, Nature> = Object.fromEntries(NATURES.map(n => [n.id, n]))

export const STAT_LABELS: Record<StatKey, { en: string; de: string; fr: string; it: string; es: string }> = {
  atk:   { en: 'Atk',   de: 'ANG', fr: 'Atq', it: 'Att', es: 'Ata' },
  def:   { en: 'Def',   de: 'VER', fr: 'Déf', it: 'Dif', es: 'Def' },
  spatk: { en: 'SpAtk', de: 'SPA', fr: 'SpAtq',it: 'SpAtt', es: 'SpAta' },
  spdef: { en: 'SpDef', de: 'SPV', fr: 'SpDéf',it: 'SpDif', es: 'SpDef' },
  spe:   { en: 'Spe',   de: 'INI', fr: 'Vit', it: 'Vel', es: 'Vel' },
}
