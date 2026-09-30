import {Link} from 'react-router-dom'

import './index.css'

const AlbumCard = ({details}) => {
  const {id, name, imageUrl} = details

  return (
    <li className="album-card">
      <Link to={`/album-details/${id}`} className="album-link">
        <div className="album-image-container">
          <img src={imageUrl} alt={name} className="album-image" />
        </div>

        <div className="album-details">
          <h3 className="album-name">{name}</h3>
          <p className="album-subtitle">New Release</p>
        </div>
      </Link>
    </li>
  )
}

export default AlbumCard