import {useState} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  const onSubmitSuccess = jwt => {
    Cookies.set('jwt_token', jwt, {
      expires: 30,
    })

    navigate('/', {replace: true})
  }

  const onSubmitFailure = errorMessage => {
    setShowSubmitError(true)
    setErrorMsg(errorMessage)
  }

  const submitForm = async event => {
    event.preventDefault()

    const userDetails = {
      username,
      password,
    }

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify(userDetails),
    })

    const data = await response.json()

    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="login-bg-container">
      <div className="login-overlay">
        <form className="login-card" onSubmit={submitForm}>
          <div className="logo-container">
            <img
              src="https://res.cloudinary.com/ylazckby/image/upload/f_auto,q_auto/Frame_52_1_huynyt"
              alt="spotify logo"
              className="spotify-logo"
            />
          </div>

          <div className="input-container">
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>

            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Enter Username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Enter Password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>

          {showSubmitError && <p className="error-message">* {errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginForm