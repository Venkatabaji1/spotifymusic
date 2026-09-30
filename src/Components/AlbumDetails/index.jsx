import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import Cookies from 'js-cookie'

import SideBar from '../SideBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const AlbumDetails = () => {
  const navigate = useNavigate()
  const {albumId} = useParams()

  const [album, setAlbum] = useState(null)
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [message, setMessage] = useState('')

  const formatDuration = milliseconds => {
    if (!milliseconds) {
      return '0:00'
    }

    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAlbumDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    try {
      const jwtToken = Cookies.get('jwt_token')

      const response = await fetch(
        `https://apis2.ccbp.in/spotify-clone/album-details/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch album details')
      }

      const data = await response.json()

      setAlbum({
        id: data.id,
        name: data.name,
        imageUrl: data.images?.[0]?.url,
        artist:
          data.artists?.map(artist => artist.name).join(', ') ||
          'Unknown Artist',
        totalSongs: data.tracks?.items?.length || 0,
      })

      const updatedSongs = (data.tracks?.items || []).map(track => ({
        id: track.id,
        songName: track.name,
        artistName:
          track.artists?.map(artist => artist.name).join(', ') ||
          'Unknown Artist',
        duration: formatDuration(track.duration_ms),
        audioUrl: track.preview_url,
        imageUrl: data.images?.[0]?.url,
      }))

      setSongs(updatedSongs)

      setApiStatus(apiStatusConstants.success)
    } catch (error) {
      console.error(error)
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getAlbumDetails()
  }, [albumId])

  const playSong = song => {
    if (song.audioUrl) {
      setCurrentSong(song)
      setMessage('')
    } else {
      setCurrentSong(null)
      setMessage('Preview not available for this song.')
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  const renderLoadingView = () => (
    <div className="loading-container">
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

      <h1 className="failure-title">Something went wrong</h1>

      <p className="failure-text">
        Unable to load album details. Please try again.
      </p>

      <button type="button" className="retry-button" onClick={getAlbumDetails}>
        Try Again
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <div className="album-page">
      <SideBar />

      <div className="album-content">
        <button type="button" className="back-button" onClick={goBack}>
          ← Back
        </button>

        {album && (
          <div className="album-header">
            <img
              src={album.imageUrl}
              alt={album.name}
              className="album-image"
            />

            <div className="album-info">
              <p className="album-type">Album</p>

              <h1 className="album-title">{album.name}</h1>

              <p className="album-artist">{album.artist}</p>

              <p className="album-count">{album.totalSongs} Songs</p>
            </div>
          </div>
        )}

        {message && <p className="message-text">{message}</p>}

        {songs.length > 0 ? (
          <div className="table-container">
            <table className="songs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Duration</th>
                </tr>
              </thead>

              <tbody>
                {songs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="song-row"
                    onClick={() => playSong(song)}
                  >
                    <td>{index + 1}</td>

                    <td className="track-cell">
                      <div className="track-identity">
                        <img
                          src={song.imageUrl}
                          alt=""
                          className="track-art"
                        />
                        <span className="track-name">{song.songName}</span>
                      </div>
                    </td>

                    <td>{song.artistName}</td>

                    <td>{song.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 className="empty-text">No Songs Found</h2>
        )}
      </div>

      {currentSong && (
        <div className="music-player">
          <div className="player-left">
            <img
              src={currentSong.imageUrl}
              alt={currentSong.songName}
              className="player-image"
            />

            <div className="player-details">
              <h3 className="player-title">{currentSong.songName}</h3>

              <p className="player-artist">{currentSong.artistName}</p>
            </div>
          </div>

          <div className="player-center">
            <audio
              controls
              autoPlay
              className="audio-player"
              key={currentSong.id}
            >
              <source src={currentSong.audioUrl} type="audio/mpeg" />
              <track kind="captions" />
              Your browser does not support audio.
            </audio>
          </div>

          <div className="player-right" />
        </div>
      )}
    </div>
  )

  const renderAlbumDetails = () => {
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

  return renderAlbumDetails()
}

export default AlbumDetails
