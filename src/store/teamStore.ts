import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Team, TeamSlot, Lang, RosterEntry } from '../types'

function makeEmptyTeam(): Team {
  return {
    slots: [
      { pokemonId: null, moveIds: [null, null, null, null] },
      { pokemonId: null, moveIds: [null, null, null, null] },
      { pokemonId: null, moveIds: [null, null, null, null] },
      { pokemonId: null, moveIds: [null, null, null, null] },
      { pokemonId: null, moveIds: [null, null, null, null] },
      { pokemonId: null, moveIds: [null, null, null, null] },
    ],
  }
}

interface TeamStore {
  activeTeam: Team
  teams: Record<string, Team>
  language: Lang
  theme: 'dark' | 'light'
  defenders: (number | null)[]
  roster: RosterEntry[]

  setSlot: (index: number, pokemonId: number | null) => void
  setMove: (slotIndex: number, moveIndex: number, moveId: number | null) => void
  saveTeam: (name: string) => void
  loadTeam: (name: string) => void
  deleteTeam: (name: string) => void
  setLanguage: (lang: Lang) => void
  setTheme: (theme: 'dark' | 'light') => void
  setDefenderAt: (index: number, pokemonId: number | null) => void
  addDefender: () => void
  removeDefender: (index: number) => void
  setActiveTeam: (team: Team) => void
  resetActiveTeam: () => void
  addToRoster: (entry: Omit<RosterEntry, 'id'>) => void
  updateRosterEntry: (id: string, patch: Partial<Omit<RosterEntry, 'id'>>) => void
  removeFromRoster: (id: string) => void
  assignFromRoster: (entryId: string, slotIndex: number) => void
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set) => ({
      activeTeam: makeEmptyTeam(),
      teams: {},
      language: 'en',
      theme: 'dark',
      defenders: [null],
      roster: [],

      setSlot: (index, pokemonId) =>
        set(s => {
          const slots = [...s.activeTeam.slots] as Team['slots']
          slots[index] = { pokemonId, moveIds: [null, null, null, null] }
          return { activeTeam: { slots } }
        }),

      setMove: (slotIndex, moveIndex, moveId) =>
        set(s => {
          const slots = s.activeTeam.slots.map((slot, i) => {
            if (i !== slotIndex) return slot
            const moveIds = [...slot.moveIds] as TeamSlot['moveIds']
            moveIds[moveIndex] = moveId
            return { ...slot, moveIds }
          }) as Team['slots']
          return { activeTeam: { slots } }
        }),

      saveTeam: (name) =>
        set(s => ({
          teams: { ...s.teams, [name]: s.activeTeam },
        })),

      loadTeam: (name) =>
        set(s => {
          const team = s.teams[name]
          if (!team) return {}
          return { activeTeam: team }
        }),

      deleteTeam: (name) =>
        set(s => {
          const teams = { ...s.teams }
          delete teams[name]
          return { teams }
        }),

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setDefenderAt: (index, pokemonId) =>
        set(s => {
          const defenders = [...s.defenders]
          defenders[index] = pokemonId
          return { defenders }
        }),
      addDefender: () =>
        set(s => ({ defenders: [...s.defenders, null] })),
      removeDefender: (index) =>
        set(s => {
          if (s.defenders.length <= 1) return {}
          return { defenders: s.defenders.filter((_, i) => i !== index) }
        }),
      setActiveTeam: (activeTeam) => set({ activeTeam }),
      resetActiveTeam: () => set({ activeTeam: makeEmptyTeam() }),

      addToRoster: (entry) =>
        set(s => ({
          roster: [...s.roster, { ...entry, id: crypto.randomUUID() }],
        })),

      updateRosterEntry: (id, patch) =>
        set(s => ({
          roster: s.roster.map(e => e.id === id ? { ...e, ...patch } : e),
        })),

      removeFromRoster: (id) =>
        set(s => ({ roster: s.roster.filter(e => e.id !== id) })),

      assignFromRoster: (entryId, slotIndex) =>
        set(s => {
          const entry = s.roster.find(e => e.id === entryId)
          if (!entry) return {}
          const slots = [...s.activeTeam.slots] as Team['slots']
          slots[slotIndex] = { pokemonId: entry.pokemonId, moveIds: [...entry.moveIds] as TeamSlot['moveIds'] }
          return { activeTeam: { slots } }
        }),
    }),
    {
      name: 'pokemon-team-builder',
      partialize: (state) => ({
        activeTeam: state.activeTeam,
        teams: state.teams,
        language: state.language,
        theme: state.theme,
        roster: state.roster,
      }),
    }
  )
)
