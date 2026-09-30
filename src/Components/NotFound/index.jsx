import {Link} from 'react-router-dom'

import SideBar from '../SideBar'

import './index.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <SideBar />

      <div className="not-found-container">
        <h1 className="error-code">404</h1>

        <p className="error-message">Page Not Found</p>

        <p className="error-description">
          Sorry, the page you are looking for doesn't exist.
        </p>

        <Link to="/" className="home-link">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound