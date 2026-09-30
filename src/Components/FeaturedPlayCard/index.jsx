import {Link} from 'react-router-dom'

import './index.css'

const FeaturedPlayCard = ({details}) => {
  const {id, name, imageUrl} = details

  return (
    <li className="featured-card">
      <Link to={`/playlist/${id}`} className="featured-link">
        <div className="featured-image-container">
          <img src={imageUrl} alt={name} className="featured-image" />
        </div>

        <h1 className="featured-title">{name}</h1>
      </Link>
    </li>
  )
}

export default FeaturedPlayCard