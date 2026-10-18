import React from 'react'

const locations = [
  { id: 'forest', name: 'Verdant Forest', price: 50, cls: 'bg-forest' },
  { id: 'neotown', name: 'Neo Town', price: 120, cls: 'bg-neotown' },
  { id: 'castle', name: 'Castle Keep', price: 200, cls: 'bg-castle' }
]

export default function Shop({ user, onBuy }) {
  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: 10 }}>Shop - Backgrounds</div>

      {locations.map((loc) => (
        <div key={loc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
          <div>
            <div style={{ fontSize: 12 }}>{loc.name}</div>
            <div className="stat">Price: {loc.price} coins</div>
          </div>

          <button className="small-btn" onClick={() => onBuy(loc)} disabled={user.coins < loc.price}>
            {user.coins >= loc.price ? 'Buy' : 'Too expensive'}
          </button>
        </div>
      ))}
    </div>
  )
}
