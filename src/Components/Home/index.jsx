import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import FeaturedPlayCard from '../FeaturedPlayCard'
import CategoryPlayCard from '../CategoryPlayCard'
import AlbumCard from '../AlbumCard'
import SideBar from '../SideBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Home = () => {
  const [playlists, setPlaylists] = useState([])
  const [categoryLists, setCategoryLists] = useState([])
  const [albumLists, setAlbumLists] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const navigate = useNavigate()

  const onLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  const getHomeData = async () => {
    setApiStatus(apiStatusConstants.loading)

    try {
      const jwtToken = Cookies.get('jwt_token')

      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      const responses = await Promise.all([
        fetch(
          'https://apis2.ccbp.in/spotify-clone/featured-playlists',
          options,
        ),
        fetch('https://apis2.ccbp.in/spotify-clone/categories', options),
        fetch('https://apis2.ccbp.in/spotify-clone/new-releases', options),
      ])

      const featuredResponse = responses[0]
      const categoriesResponse = responses[1]
      const albumsResponse = responses[2]

      if (
        !featuredResponse.ok ||
        !categoriesResponse.ok ||
        !albumsResponse.ok
      ) {
        setApiStatus(apiStatusConstants.failure)
        return
      }

      const featuredData = await featuredResponse.json()
      const categoriesData = await categoriesResponse.json()
      const albumsData = await albumsResponse.json()

      const updatedFeatured = featuredData.playlists.items.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.images[0].url,
      }))

      const updatedCategories = categoriesData.categories.items.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.icons[0].url,
      }))

      const updatedAlbums = albumsData.albums.items.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.images[0].url,
      }))

      setPlaylists(updatedFeatured)
      setCategoryLists(updatedCategories)
      setAlbumLists(updatedAlbums)

      setApiStatus(apiStatusConstants.success)
    } catch (error) {
      console.error(error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getHomeData()
  }, [])

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
        src="https://assets.ccbp.in/frontend/react-js/alert-triangle.png"
        alt="failure view"
        className="failure-image"
      />

      <p className="failure-text">Something went wrong. Please try again</p>

      <button type="button" className="retry-button" onClick={getHomeData}>
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <>
      <section className="section-container">
        <h1 className="section-heading">Editor&apos;s Picks</h1>

        <ul className="cards-grid">
          {playlists.map(each => (
            <FeaturedPlayCard key={each.id} details={each} />
          ))}
        </ul>
      </section>

      <section className="section-container">
        <h1 className="section-heading">Genres &amp; Moods</h1>

        <ul className="cards-grid">
          {categoryLists.map(each => (
            <CategoryPlayCard key={each.id} details={each} />
          ))}
        </ul>
      </section>

      <section className="section-container">
        <h1 className="section-heading">New Releases</h1>

        <ul className="cards-grid">
          {albumLists.map(each => (
            <AlbumCard key={each.id} details={each} />
          ))}
        </ul>
      </section>
    </>
  )

  const renderHome = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView()

      case apiStatusConstants.success:
        return renderSuccessView()

      case apiStatusConstants.failure:
        return renderFailureView()

      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <SideBar onLogout={onLogout} />

      <div className="content-container">{renderHome()}</div>
    </div>
  )
}

export default Home