import { create } from 'zustand'
import type { PokemonSummary, MoveDetail, TypeChart } from '../types'

interface CacheStore {
  pokemonList: PokemonSummary[]
  typeChart: TypeChart
  typeNames: Record<string, Record<string, string>>
  moveCache: Record<number, MoveDetail>
  allMoveIds: number[]
  loading: boolean
  error: string | null

  setPokemonList: (list: PokemonSummary[]) => void
  setTypeChart: (chart: TypeChart) => void
  setTypeNames: (names: Record<string, Record<string, string>>) => void
  addMoveToCache: (move: MoveDetail) => void
  addMovesToCache: (moves: MoveDetail[]) => void
  setAllMoveIds: (ids: number[]) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useCacheStore = create<CacheStore>((set) => ({
  pokemonList: [],
  typeChart: {},
  typeNames: {},
  moveCache: {},
  allMoveIds: [],
  loading: false,
  error: null,

  setPokemonList: (list) => set({ pokemonList: list }),
  setTypeChart: (chart) => set({ typeChart: chart }),
  setTypeNames: (names) => set({ typeNames: names }),
  addMoveToCache: (move) => set(s => ({ moveCache: { ...s.moveCache, [move.id]: move } })),
  addMovesToCache: (moves) => set(s => {
    const next = { ...s.moveCache }
    moves.forEach(m => { next[m.id] = m })
    return { moveCache: next }
  }),
  setAllMoveIds: (allMoveIds) => set({ allMoveIds }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
