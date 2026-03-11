import React from 'react'
import { PokemonSlot } from './PokemonSlot'

export const TeamBuilder: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {([0, 1, 2, 3, 4, 5] as const).map(i => (
          <PokemonSlot key={i} slotIndex={i} />
        ))}
      </div>
    </div>
  )
}
