import { useState, type FC, type FormEvent } from 'react'
import vcap2Logo from '../../assets/vcap2-logo.png'

const STAFF_PASSWORD = 'VC@P 2026'

interface StaffLoginProps {
  onSuccess: () => void
  onCancel: () => void
}

const StaffLogin: FC<StaffLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password === STAFF_PASSWORD) {
      sessionStorage.setItem('vcap2_staff_auth', '1')
      onSuccess()
    } else {
      setError('Incorrect password')
      setPassword('')
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
          Enter the staff password to access the VCAP2 management portal.
        </p>
        {error && <div className="login-error" role="alert">{error}</div>}
        <label className="login-label" htmlFor="staff-password">Password</label>
        <input
          id="staff-password"
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
          placeholder="Enter staff password"
          autoFocus
        />
        <div className="login-actions">
          <button type="button" className="login-btn login-btn-secondary" onClick={onCancel}>
            Back to Public
          </button>
          <button type="submit" className="login-btn login-btn-primary">
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}

export default StaffLogin
