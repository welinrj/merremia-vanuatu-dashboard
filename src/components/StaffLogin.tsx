import { useState, useRef, type FC, type FormEvent } from 'react'
import vcap2Logo from '../../assets/vcap2-logo.png'
import type { UserProfile } from '../types/user'
import { createUser, findUserByName } from '../services/userStore'

const STAFF_PASSWORD = 'VC@P 2026'

interface StaffLoginProps {
  onSuccess: (user: UserProfile) => void
  onCancel: () => void
}

const StaffLogin: FC<StaffLoginProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== STAFF_PASSWORD) {
      setError('Incorrect password')
      setPassword('')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const existing = await findUserByName(name.trim())
        if (!existing) {
          setError('No account found with that name. Create one instead.')
          setLoading(false)
          return
        }
        sessionStorage.setItem('vcap2_staff_auth', '1')
        sessionStorage.setItem('vcap2_user_id', existing.id)
        onSuccess(existing)
      } else {
        const existing = await findUserByName(name.trim())
        if (existing) {
          setError('An account with that name already exists. Log in instead.')
          setLoading(false)
          return
        }
        const user = await createUser(name.trim(), avatarPreview)
        sessionStorage.setItem('vcap2_staff_auth', '1')
        sessionStorage.setItem('vcap2_user_id', user.id)
        onSuccess(user)
      }
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
        <h2>{mode === 'login' ? 'Staff Login' : 'Create Account'}</h2>
        <p className="login-description">
          {mode === 'login'
            ? 'Enter your name and the staff password to access the portal.'
            : 'Set up your staff account with a name and optional profile picture.'}
        </p>
        {error && <div className="login-error" role="alert">{error}</div>}

        {mode === 'register' && (
          <div className="avatar-upload">
            <button
              type="button"
              className="avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile picture"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile preview" className="avatar-preview-img" />
              ) : (
                <span className="avatar-placeholder">+</span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleAvatarChange(e.target.files?.[0])}
              data-testid="avatar-input"
            />
            <span className="avatar-upload-hint">Profile picture (optional)</span>
          </div>
        )}

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
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </div>

        <p className="login-toggle">
          {mode === 'login' ? (
            <>
              No account yet?{' '}
              <button type="button" className="login-toggle-btn" onClick={() => { setMode('register'); setError('') }}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="login-toggle-btn" onClick={() => { setMode('login'); setError('') }}>
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}

export default StaffLogin
