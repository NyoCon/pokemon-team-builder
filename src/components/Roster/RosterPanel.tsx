import React, { useState } from 'react'
import { useTeamStore } from '../../store/teamStore'
import { useCacheStore } from '../../store/cacheStore'
import { TypeBadge } from '../TeamBuilder/TypeBadge'
import { MovePicker } from '../TeamBuilder/MovePicker'
import { PokemonPicker } from '../TeamBuilder/PokemonPicker'
import { t } from '../../utils/i18n'
import type { RosterEntry } from '../../types'

export const RosterPanel: React.FC = () => {
  const { roster, addToRoster, updateRosterEntry, removeFromRoster, assignFromRoster, language } = useTeamStore()
  const pokemonList = useCacheStore(s => s.pokemonList)
  const moveCache = useCacheStore(s => s.moveCache)

  // editing state: null = not editing, string id = editing existing, 'new' = creating new
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Omit<RosterEntry, 'id'>>({
    label: '',
    pokemonId: 0,
    moveIds: [null, null, null, null],
  })

  function openNew() {
    setDraft({ label: '', pokemonId: 0, moveIds: [null, null, null, null] })
    setEditingId('new')
    setAssigningId(null)
  }

  function openEdit(entry: RosterEntry) {
    setDraft({ label: entry.label, pokemonId: entry.pokemonId, moveIds: [...entry.moveIds] })
    setEditingId(entry.id)
    setAssigningId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveDraft() {
    if (!draft.pokemonId) return
    if (editingId === 'new') {
      const pokemon = pokemonList.find(p => p.id === draft.pokemonId)
      const defaultLabel = pokemon ? (pokemon.names[language] || pokemon.names.en) : ''
      addToRoster({ ...draft, label: draft.label || defaultLabel })
    } else if (editingId) {
      updateRosterEntry(editingId, draft)
    }
    setEditingId(null)
  }

  function setDraftMove(mi: number, id: number | null) {
    const moveIds = [...draft.moveIds] as RosterEntry['moveIds']
    moveIds[mi] = id
    setDraft(d => ({ ...d, moveIds }))
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 3, height: 20,
          background: '#a78bfa',
          borderRadius: 2,
          boxShadow: '0 0 8px rgba(167,139,250,0.5)',
        }} />
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14, fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          flex: 1,
        }}>
          {t('roster', language)}
        </span>
        <button
          onClick={openNew}
          style={{
            padding: '3px 10px',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: 3,
            color: '#a78bfa',
            fontSize: 11, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      {/* New/Edit form */}
      {editingId !== null && (
        <div style={{
          background: 'var(--bg-card2)',
          border: '1px solid rgba(167,139,250,0.3)',
          borderRadius: 3,
          padding: 10,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <PokemonPicker
            value={draft.pokemonId || null}
            onChange={id => setDraft(d => ({ ...d, pokemonId: id ?? 0, moveIds: [null, null, null, null] }))}
          />
          <input
            value={draft.label}
            onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
            placeholder={t('rosterLabelPlaceholder', language)}
            style={{ padding: '5px 8px', borderRadius: 3, fontSize: 12 }}
          />
          {draft.pokemonId > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {([0, 1, 2, 3] as const).map(mi => (
                <MovePicker
                  key={mi}
                  value={draft.moveIds[mi]}
                  onChange={id => setDraftMove(mi, id)}
                />
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            <button
              onClick={saveDraft}
              disabled={!draft.pokemonId}
              style={{
                flex: 1,
                padding: '5px 0',
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.4)',
                borderRadius: 3,
                color: '#a78bfa',
                fontSize: 11, fontWeight: 700,
                cursor: draft.pokemonId ? 'pointer' : 'not-allowed',
                opacity: draft.pokemonId ? 1 : 0.4,
              }}
            >
              {t('save', language)}
            </button>
            <button
              onClick={cancelEdit}
              style={{
                padding: '5px 12px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 3,
                color: 'var(--text-muted)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {t('cancelEdit', language)}
            </button>
          </div>
        </div>
      )}

      {/* Roster list */}
      {roster.length === 0 && editingId === null ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'center', padding: '8px 0' }}>
          {t('noRosterEntries', language)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {roster.map(entry => {
            const pokemon = pokemonList.find(p => p.id === entry.pokemonId)
            if (!pokemon) return null
            const name = entry.label || pokemon.names[language] || pokemon.names.en
            const isAssigning = assigningId === entry.id

            return (
              <div
                key={entry.id}
                style={{
                  background: 'var(--bg-card2)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                  padding: '7px 8px',
                }}
              >
                {/* Pokemon header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <img src={pokemon.spriteUrl} alt="" style={{ width: 24, height: 24, imageRendering: 'pixelated' }} />
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {pokemon.types.map(tp => <TypeBadge key={tp} typeName={tp} small />)}
                  </div>
                </div>

                {/* Moves */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                  {entry.moveIds.map((mid, i) => {
                    const move = mid ? moveCache[mid] : null
                    if (!move) return (
                      <span key={i} style={{ color: 'var(--text-muted)', fontSize: 9 }}>—</span>
                    )
                    const moveName = move.names[language] || move.names.en
                    return (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TypeBadge typeName={move.type} small />
                        <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{moveName}</span>
                      </span>
                    )
                  })}
                </div>

                {/* Actions */}
                {isAssigning ? (
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {t('confirmAssign', language)}
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {([0, 1, 2, 3, 4, 5] as const).map(si => (
                        <button
                          key={si}
                          onClick={() => { assignFromRoster(entry.id, si); setAssigningId(null) }}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(167,139,250,0.1)',
                            border: '1px solid rgba(167,139,250,0.3)',
                            borderRadius: 2,
                            color: '#a78bfa',
                            fontSize: 10, fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {si + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setAssigningId(null)}
                        style={{
                          padding: '3px 8px',
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: 2,
                          color: 'var(--text-muted)',
                          fontSize: 10,
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setAssigningId(entry.id)}
                      style={{
                        flex: 1,
                        padding: '3px 6px',
                        background: 'rgba(167,139,250,0.08)',
                        border: '1px solid rgba(167,139,250,0.25)',
                        borderRadius: 2,
                        color: '#a78bfa',
                        fontSize: 10, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t('assignToSlot', language)}
                    </button>
                    <button
                      onClick={() => openEdit(entry)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(0,191,255,0.06)',
                        border: '1px solid rgba(0,191,255,0.2)',
                        borderRadius: 2,
                        color: 'var(--accent)',
                        fontSize: 10, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t('editEntry', language)}
                    </button>
                    <button
                      onClick={() => removeFromRoster(entry.id)}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(255,77,109,0.06)',
                        border: '1px solid rgba(255,77,109,0.15)',
                        borderRadius: 2,
                        color: 'var(--danger)',
                        fontSize: 10, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
