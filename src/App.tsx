import { useEffect } from 'react'
import { t } from './utils/i18n'
import { Header } from './components/Layout/Header'
import { TeamBuilder } from './components/TeamBuilder/TeamBuilder'
import { DefenderPanel } from './components/Defender/DefenderPanel'
import { TeamList } from './components/TeamManager/TeamList'
import { RosterPanel } from './components/Roster/RosterPanel'
import { useCacheStore } from './store/cacheStore'
import { useTeamStore } from './store/teamStore'
import { fetchAllPokemon, fetchAllTypes, fetchAllMoveIds, fetchMoveDetail } from './api/queries'
import { readTeamFromUrl } from './utils/urlEncoding'

function App() {
  const { setPokemonList, setTypeChart, setTypeNames, setAllMoveIds, addMovesToCache, setLoading, setError } = useCacheStore()
  const setActiveTeam = useTeamStore(s => s.setActiveTeam)
  const activeTeam = useTeamStore(s => s.activeTeam)
  const teams = useTeamStore(s => s.teams)
  const roster = useTeamStore(s => s.roster)
  const theme = useTeamStore(s => s.theme)
  const language = useTeamStore(s => s.language)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    // ?clear — wipe all localStorage cache, then strip param from URL (no reload)
    const params = new URLSearchParams(window.location.search)
    if (params.has('clear')) {
      localStorage.clear()
      params.delete('clear')
      const clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '')
      history.replaceState(null, '', clean)
    }

    const teamFromUrl = readTeamFromUrl()
    if (teamFromUrl) setActiveTeam(teamFromUrl)

    // Collect all move IDs referenced in persisted teams + activeTeam + roster
    const allTeams = [activeTeam, ...Object.values(teams)]
    const persistedMoveIds = [...new Set([
      ...allTeams.flatMap(team => team.slots.flatMap(slot => slot.moveIds.filter(Boolean) as number[])),
      ...roster.flatMap(entry => entry.moveIds.filter(Boolean) as number[]),
    ])]

    setLoading(true)
    Promise.all([fetchAllPokemon(), fetchAllTypes(), fetchAllMoveIds()])
      .then(([pokemon, { chart, typeNames }, moveIds]) => {
        setPokemonList(pokemon)
        setTypeChart(chart)
        setTypeNames(typeNames)
        setAllMoveIds(moveIds)
        setLoading(false)
        // Pre-fetch move details for all moves already in saved teams
        if (persistedMoveIds.length) {
          Promise.all(persistedMoveIds.map(id => fetchMoveDetail(id)))
            .then(moves => addMovesToCache(moves))
        }
      })
      .catch(err => {
        setError(t('loadError', language))
        setLoading(false)
        console.error(err)
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{
        flex: 1,
        padding: '20px 24px',
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: 20,
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TeamBuilder />
          <DefenderPanel />
        </div>
        <div style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TeamList />
          <RosterPanel />
        </div>
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 24px',
        textAlign: 'center',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }}>
          {t('dataSource', language)}
        </span>
      </footer>
    </div>
  )
}

export default App
