import React, { useState, useEffect } from 'react'
import Auth from './components/Auth'
import PixelCharacter from './components/PixelCharacter'
import Timer from './components/Timer'
import Shop from './components/Shop'
import { getLevelFromXp } from './utils/xp'

const STORAGE_KEY = 'study_quest_state_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { users: {}, sessions: [] }
  } catch {
    return { users: {}, sessions: [] }
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export default function App() {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('home')
  const [state, setState] = useState(loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const onLogin = (incomingUser) => {
    const users = { ...state.users }
    if (!users[incomingUser.id]) {
      users[incomingUser.id] = {
        id: incomingUser.id,
        name: incomingUser.name || incomingUser.email || 'Study Hero',
        totalXp: incomingUser.totalXp || 0,
        coins: incomingUser.coins || 0,
        unlocked: incomingUser.unlocked || ['default']
      }
    }

    setState((s) => ({ ...s, users }))
    setUser(users[incomingUser.id])
  }

  const startStudy = () => setMode('timer')
  const openShop = () => setMode('shop')

  const onFinishSession = ({ durationSeconds, xp, bonus, type, totalXp }) => {
    if (!user) return

    const uid = user.id
    const users = { ...state.users }
    const current = { ...users[uid] }

    const oldLevel = getLevelFromXp(current.totalXp || 0)
    const newTotal = (current.totalXp || 0) + totalXp
    const newLevel = getLevelFromXp(newTotal)

    let coinsGain = 0
    if (newLevel > oldLevel) {
      coinsGain = 10 * newLevel
      current.coins = (current.coins || 0) + coinsGain
    }

    current.totalXp = newTotal
    users[uid] = current

    const sessions = [
      ...state.sessions,
      {
        id: Date.now(),
        userId: uid,
        durationSeconds,
        xp,
        bonus,
        type,
        totalXp
      }
    ]

    setState({ ...state, users, sessions })
    setUser(current)
    setMode('home')

    let message = `Session ended: +${totalXp} XP`
    if (type === 'lucky') message += ' (lucky x2!)'
    if (type === 'jackpot') message += ` (jackpot +${bonus})`
    if (newLevel > oldLevel) message += ` — Level up! +${coinsGain} coins`

    alert(message)
  }

  const onBuy = (loc) => {
    if (!user) return

    const uid = user.id
    const users = { ...state.users }
    const current = { ...users[uid] }

    if ((current.coins || 0) < loc.price) {
      alert('Not enough coins.')
      return
    }

    current.coins -= loc.price
    current.unlocked = Array.from(new Set([...(current.unlocked || []), loc.id]))
    users[uid] = current

    setState({ ...state, users })
    setUser(current)
    alert(`Unlocked: ${loc.name}`)
  }

  if (!user) {
    return (
      <div className="app">
        <Auth onLogin={onLogin} />
      </div>
    )
  }

  const currentUser = state.users[user.id] || user

  return (
    <div className={`app ${currentUser.background || ''}`}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="stat">Player: {currentUser.name}</div>
          <div className="stat">Level: {getLevelFromXp(currentUser.totalXp || 0)} | XP: {currentUser.totalXp || 0}</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <PixelCharacter />
        </div>

        <button className="big-btn" onClick={startStudy}>Study</button>
        <button className="small-btn" onClick={openShop}>Shop</button>

        <div style={{ marginTop: 8, textAlign: 'left', fontSize: 12 }} className="stat">
          Coins: {currentUser.coins || 0}
        </div>
      </div>

      {mode === 'timer' && (
        <div style={{ position: 'fixed', right: 20, top: 20 }}>
          <Timer onFinish={onFinishSession} />
        </div>
      )}

      {mode === 'shop' && (
        <div style={{ position: 'fixed', right: 20, top: 20 }}>
          <Shop user={currentUser} onBuy={onBuy} />
        </div>
      )}
    </div>
  )
}
