import { useState, type FC, type FormEvent } from 'react'
import vcap2Logo from '../../assets/vcap2-logo.png'
import type { UserProfile } from '../types/user'
import { createUser, findUserByName } from '../services/userStore'

const STAFF_PASSWORD = 'VC@P 2026'
const AUTHORIZED_NAME = 'Micky WELIN'

interface StaffLoginProps {
  onSuccess: (user: UserProfile) => void
  onCancel: () => void
}

const StaffLogin: FC<StaffLoginProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (name.trim().toLowerCase() !== AUTHORIZED_NAME.toLowerCase()) {
      setError('Account not found')
      setName('')
      return
    }
    if (password !== STAFF_PASSWORD) {
      setError('Incorrect password')
      setPassword('')
      return
    }

    setLoading(true)
    try {
      let user = await findUserByName(AUTHORIZED_NAME)
      if (!user) {
        user = await createUser(AUTHORIZED_NAME, null)
      }
      sessionStorage.setItem('vcap2_staff_auth', '1')
      sessionStorage.setItem('vcap2_user_id', user.id)
      onSuccess(user)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-logo">
          <img src={vcap2Logo} alt="VCAP2 - Adaptation to Climate Change in the Coastal Zone of Vanuatu Phase II" />
        </div>
        <h2>Staff Login</h2>
        <p className="login-description">
          Enter your name and the staff password to access the portal.
        </p>
        {error && <div className="login-error" role="alert">{error}</div>}

        <label className="login-label" htmlFor="staff-name">Name</label>
        <input
          id="staff-name"
          className="login-input"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="Enter your name"
          autoFocus
        />

        <label className="login-label" htmlFor="staff-password">Password</label>
        <input
          id="staff-password"
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
          placeholder="Enter staff password"
        />

        <div className="login-actions">
          <button type="button" className="login-btn login-btn-secondary" onClick={onCancel}>
            Back to Public
          </button>
          <button type="submit" className="login-btn login-btn-primary" disabled={loading}>
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}

export default StaffLogin
