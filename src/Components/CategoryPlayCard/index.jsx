import {Link} from 'react-router-dom'

import './index.css'

const CategoryPlayCard = ({details}) => {
  const {id, name, imageUrl} = details

  return (
    <li className="category-card">
      <Link to={`/category-playlists/${id}`} className="category-link">
        <div className="category-image-container">
          <img src={imageUrl} alt={name} className="category-image" />

          <div className="category-overlay">
            <h2 className="category-title">{name}</h2>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default CategoryPlayCard