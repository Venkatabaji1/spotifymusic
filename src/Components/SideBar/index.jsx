import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiOutlineLogout} from 'react-icons/ai'

import './index.css'

const SideBar = () => {
  const navigate = useNavigate()

  const onLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <aside className="sidebar">
      <div>
        <div className="logo-container">
          <img
            src="https://res.cloudinary.com/ylazckby/image/upload/f_auto,q_auto/Frame_52_1_huynyt"
            alt="spotify logo"
            className="logo-image"
          />

          <h1 className="logo-heading">
            Spotify
            <span className="logo-span"> Remix</span>
          </h1>
        </div>
      </div>

      <button type="button" className="logout-button" onClick={onLogout}>
        <AiOutlineLogout className="menu-icon" />
        Logout
      </button>
    </aside>
  )
}

export default SideBar