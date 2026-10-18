import React from 'react'

const palette = {
  '.': 'transparent',
  b: '#222222',
  r: '#8b0000',
  x: '#f5d69a',
  y: '#ffd24d',
  g: '#1fa65a',
  w: '#ffffff'
}

const sprite = [
  '..xx..xx',
  '.xxxxxxx',
  'xxxyyxxx',
  'xxxyyxxx',
  '.xbxxxb.',
  '.bxxxbb.',
  '.bxxxbb.',
  '..b..b..'
]

export default function PixelCharacter({ size = 12 }) {
  return (
    <div className="character-grid" style={{ gridTemplateColumns: `repeat(${sprite[0].length}, ${size}px)` }}>
      {sprite.flatMap((row, rIdx) =>
        [...row].map((ch, cIdx) => {
          const color = palette[ch] || 'transparent'
          return <div key={`${rIdx}-${cIdx}`} className="pixel" style={{ background: color }} />
        })
      )}
    </div>
  )
}
