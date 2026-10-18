import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth({ onLogin }) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (!supabase) {
      const saved = localStorage.getItem('study_quest_user')
      if (saved) onLogin(JSON.parse(saved))
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        onLogin({
          id: data.session.user.id,
          email: data.session.user.email,
          name: data.session.user.user_metadata?.full_name || data.session.user.email || 'Study Hero',
          totalXp: 0,
          coins: 0,
          unlocked: ['default']
        })
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        onLogin({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email || 'Study Hero',
          totalXp: 0,
          coins: 0,
          unlocked: ['default']
        })
      }
    })
  }, [onLogin])

  const signInLocal = () => {
    if (!name.trim()) return alert('Pick a name')

    const user = {
      id: `local_${Date.now()}`,
      name: name.trim(),
      totalXp: 0,
      coins: 0,
      unlocked: ['default']
    }

    localStorage.setItem('study_quest_user', JSON.stringify(user))
    onLogin(user)
  }

  const signInProvider = async (provider) => {
    if (!supabase) return alert('Supabase not configured. Use local account.')
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) alert(error.message)
  }

  const signInPhone = async () => {
    if (!supabase) return alert('Supabase not configured.')
    const phone = prompt('Enter phone number with country code (example: +1234567890)')
    if (!phone) return
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) alert(error.message)
    else alert('Check your phone for the login code.')
  }

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: 12 }}>Sign in</div>

      <input
        placeholder="Pick a local name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-2 p-2 w-full"
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      <button className="small-btn" onClick={signInLocal}>Use local account</button>
      <hr style={{ margin: '12px 0' }} />
      <button className="small-btn" onClick={() => signInProvider('google')}>Sign in with Google</button>
      <button className="small-btn" onClick={() => signInProvider('apple')}>Sign in with Apple</button>
      <button className="small-btn" onClick={signInPhone}>Sign in with Phone</button>

      {!supabase && <div className="stat" style={{ marginTop: 10 }}>Supabase not configured: using local mode.</div>}
    </div>
  )
}
