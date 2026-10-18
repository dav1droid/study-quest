import React, { useEffect, useRef, useState } from 'react'
import { calculateSessionXp } from '../utils/xp'

export default function Timer({ onFinish }) {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [mode, setMode] = useState('continuous')
  const timerRef = useRef(null)

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [running])

  const start = () => setRunning(true)
  const pause = () => setRunning(false)

  const stop = () => {
    setRunning(false)
    const result = calculateSessionXp(elapsed)
    onFinish({ durationSeconds: elapsed, ...result })
    setElapsed(0)
  }

  const toggleMode = () => setMode((m) => (m === 'continuous' ? 'pomodoro' : 'continuous'))

  const format = (seconds) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0')
    const ss = (seconds % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="stat">Mode: {mode}</div>
      <div style={{ fontSize: 18, margin: '10px 0' }}>{format(elapsed)}</div>

      {!running ? (
        <button className="big-btn" onClick={start}>{mode === 'pomodoro' ? 'Start Pomodoro' : 'Start Studying'}</button>
      ) : (
        <button className="big-btn" onClick={pause}>Pause</button>
      )}

      <button className="small-btn" onClick={stop}>Stop Session</button>
      <button className="small-btn" onClick={toggleMode}>Toggle continuous / Pomodoro</button>
    </div>
  )
}
