import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Cookies from 'js-cookie'

import SideBar from '../SideBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const CategoryPlaylists = () => {
  const navigate = useNavigate()
  const {categoryId} = useParams()

  const [playlists, setPlaylists] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getCategoryPlaylists = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    try {
      const jwtToken = Cookies.get('jwt_token')

      const response = await fetch(
        `https://apis2.ccbp.in/spotify-clone/category-playlists/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch category playlists')
      }

      const data = await response.json()

      const updatedData = data.playlists.items.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.images[0].url,
        description: each.description,
        owner: each.owner.display_name,
        totalTracks: each.tracks.total,
      }))

      setPlaylists(updatedData)
      setApiStatus(apiStatusConstants.success)
    } catch (error) {
      console.error(error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getCategoryPlaylists()
  }, [categoryId])

  const onClickBack = () => {
    navigate(-1)
  }

  const renderLoadingView = () => (
    <div className="loading-container">
      <img
        src="https://res.cloudinary.com/ylazckby/image/upload/f_auto,q_auto/Frame_52_1_huynyt"
        alt="loading"
        className="loading-logo"
      />
      <h1 className="loading-text">Loading...</h1>
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/ylazckby/image/upload/v1753788108/alert-triangle_mqyl4f.png"
        alt="failure view"
        className="failure-image"
      />

      <p className="failure-text">Something went wrong. Please try again</p>

      <button
        type="button"
        className="retry-button"
        onClick={getCategoryPlaylists}
      >
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <div className="category-page">
      <SideBar />

      <div className="category-content">
        <button type="button" className="back-button" onClick={onClickBack}>
          ← Back
        </button>

        <h1 className="category-heading">Category Playlists</h1>

        <div className="playlists-grid">
          {playlists.map(each => (
            <Link
              key={each.id}
              to={`/playlist/${each.id}`}
              className="playlist-link"
            >
              <div className="playlist-card">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="playlist-image"
                />

                <h3 className="playlist-name">{each.name}</h3>

                <p className="playlist-description">
                  {each.description || 'No description available'}
                </p>

                <p className="playlist-owner">By {each.owner}</p>

                <p className="playlist-tracks">{each.totalTracks} Songs</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCategoryPlaylists = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()

      case apiStatusConstants.success:
        return renderSuccessView()

      case apiStatusConstants.failure:
        return renderFailureView()

      default:
        return null
    }
  }

  return renderCategoryPlaylists()
}

export default CategoryPlaylists