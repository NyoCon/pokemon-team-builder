export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  normal:   { bg: '#6b6b4f', text: '#fff', border: '#a8a878', glow: 'rgba(168,168,120,0.3)' },
  fire:     { bg: '#b05820', text: '#fff', border: '#f08030', glow: 'rgba(240,128,48,0.4)' },
  water:    { bg: '#3858b0', text: '#fff', border: '#6890f0', glow: 'rgba(104,144,240,0.4)' },
  electric: { bg: '#a89020', text: '#111', border: '#f8d030', glow: 'rgba(248,208,48,0.4)' },
  grass:    { bg: '#4a7830', text: '#fff', border: '#78c850', glow: 'rgba(120,200,80,0.3)' },
  ice:      { bg: '#5898a0', text: '#fff', border: '#98d8d8', glow: 'rgba(152,216,216,0.3)' },
  fighting: { bg: '#801818', text: '#fff', border: '#c03028', glow: 'rgba(192,48,40,0.3)' },
  poison:   { bg: '#702870', text: '#fff', border: '#a040a0', glow: 'rgba(160,64,160,0.3)' },
  ground:   { bg: '#906820', text: '#fff', border: '#e0c068', glow: 'rgba(224,192,104,0.3)' },
  flying:   { bg: '#6058b0', text: '#fff', border: '#a890f0', glow: 'rgba(168,144,240,0.3)' },
  psychic:  { bg: '#b03860', text: '#fff', border: '#f85888', glow: 'rgba(248,88,136,0.4)' },
  bug:      { bg: '#607020', text: '#fff', border: '#a8b820', glow: 'rgba(168,184,32,0.3)' },
  rock:     { bg: '#706820', text: '#fff', border: '#b8a038', glow: 'rgba(184,160,56,0.3)' },
  ghost:    { bg: '#483070', text: '#fff', border: '#705898', glow: 'rgba(112,88,152,0.4)' },
  dragon:   { bg: '#4010c0', text: '#fff', border: '#7038f8', glow: 'rgba(112,56,248,0.4)' },
  dark:     { bg: '#403028', text: '#fff', border: '#705848', glow: 'rgba(112,88,72,0.3)' },
  steel:    { bg: '#787890', text: '#fff', border: '#b8b8d0', glow: 'rgba(184,184,208,0.3)' },
  fairy:    { bg: '#904868', text: '#fff', border: '#ee99ac', glow: 'rgba(238,153,172,0.3)' },
}

export function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? { bg: '#333', text: '#fff', border: '#555', glow: 'rgba(0,0,0,0.3)' }
}
