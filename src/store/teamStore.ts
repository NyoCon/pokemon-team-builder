import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Team, TeamSlot, Lang, RosterEntry, EVs } from '../types'

export type MoveFilter = {
  superEffective: boolean
  neutral: boolean
  resisted: boolean
  immune: boolean
  nonDamaging: boolean
}

const DEFAULT_MOVE_FILTER: MoveFilter = {
  superEffective: true,
  neutral: false,
  resisted: true,
  immune: false,
  nonDamaging: false,
}

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
  advancedMode: boolean
  defenders: (number | null)[]
  analysisFilter: MoveFilter
  roster: RosterEntry[]

  setSlot: (index: number, pokemonId: number | null) => void
  setMove: (slotIndex: number, moveIndex: number, moveId: number | null) => void
  setNature: (slotIndex: number, nature: string | undefined) => void
  setEVs: (slotIndex: number, evs: EVs) => void
  setItem: (slotIndex: number, item: string | undefined) => void
  setAdvancedMode: (on: boolean) => void
  saveTeam: (name: string) => void
  loadTeam: (name: string) => void
  deleteTeam: (name: string) => void
  setLanguage: (lang: Lang) => void
  setTheme: (theme: 'dark' | 'light') => void
  setDefenderAt: (index: number, pokemonId: number | null) => void
  addDefender: () => void
  removeDefender: (index: number) => void
  setDefenders: (ids: (number | null)[]) => void
  setAnalysisFilter: (filter: MoveFilter) => void
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
      advancedMode: false,
      defenders: [],
      analysisFilter: DEFAULT_MOVE_FILTER,
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

      setNature: (slotIndex, nature) =>
        set(s => {
          const slots = s.activeTeam.slots.map((slot, i) =>
            i === slotIndex ? { ...slot, nature } : slot
          ) as Team['slots']
          return { activeTeam: { slots } }
        }),

      setEVs: (slotIndex, evs) =>
        set(s => {
          const slots = s.activeTeam.slots.map((slot, i) =>
            i === slotIndex ? { ...slot, evs } : slot
          ) as Team['slots']
          return { activeTeam: { slots } }
        }),

      setItem: (slotIndex, item) =>
        set(s => {
          const slots = s.activeTeam.slots.map((slot, i) =>
            i === slotIndex ? { ...slot, item } : slot
          ) as Team['slots']
          return { activeTeam: { slots } }
        }),

      setAdvancedMode: (advancedMode) => set({ advancedMode }),

      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setDefenderAt: (index, pokemonId) =>
        set(s => {
          const defenders = [...s.defenders]
          while (defenders.length <= index) defenders.push(null)
          defenders[index] = pokemonId
          return { defenders }
        }),
      addDefender: () =>
        set(s => ({ defenders: [...s.defenders, null] })),
      removeDefender: (index) =>
        set(s => ({ defenders: s.defenders.filter((_, i) => i !== index) })),
      setDefenders: (ids) => set({ defenders: ids }),
      setAnalysisFilter: (filter) => set({ analysisFilter: filter }),
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
          slots[slotIndex] = { pokemonId: entry.pokemonId, moveIds: [...entry.moveIds] as TeamSlot['moveIds'], nature: entry.nature, evs: entry.evs, item: entry.item }
          return { activeTeam: { slots } }
        }),
    }),
    {
      name: 'pokemon-team-builder',
      storage: createJSONStorage(() => ({
        getItem: (name) => { try { return localStorage.getItem(name) } catch { return null } },
        setItem: (name, value) => { try { localStorage.setItem(name, value) } catch { /* quota exceeded */ } },
        removeItem: (name) => { try { localStorage.removeItem(name) } catch { /* ignore */ } },
      })),
      partialize: (state) => ({
        activeTeam: state.activeTeam,
        teams: state.teams,
        language: state.language,
        theme: state.theme,
        advancedMode: state.advancedMode,
        roster: state.roster,
      }),
    }
  )
)
