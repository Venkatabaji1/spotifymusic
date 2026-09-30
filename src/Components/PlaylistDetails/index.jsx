import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import SideBar from '../SideBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const PlaylistDetails = () => {
  const {playlistId} = useParams()
  const navigate = useNavigate()

  const [playlistDetails, setPlaylistDetails] = useState({})
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [message, setMessage] = useState('')
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const formatDuration = milliseconds => {
    if (!milliseconds) {
      return '0:00'
    }

    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getPlaylistDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    try {
      const jwtToken = Cookies.get('jwt_token')

      const response = await fetch(
        `https://apis2.ccbp.in/spotify-clone/playlists-details/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch playlist')
      }

      const data = await response.json()

      setPlaylistDetails({
        id: data.id,
        name: data.name,
        description: data.description,
        imageUrl: data.images?.[0]?.url,
        owner: data.owner.display_name,
      })

      const updatedSongs = data.tracks.items
        .filter(each => each.track)
        .map(each => ({
          id: each.track.id,
          songName: each.track.name,
          albumName: each.track.album.name,
          artistName: each.track.artists.map(artist => artist.name).join(', '),
          duration: formatDuration(each.track.duration_ms),
          audioUrl: each.track.preview_url,
          addedAt: new Date(each.added_at).toLocaleDateString(),
          imageUrl: each.track.album.images[0].url,
        }))

      setSongs(updatedSongs)

      setApiStatus(apiStatusConstants.success)
    } catch (error) {
      console.error(error)

      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getPlaylistDetails()
  }, [playlistId])

  const onClickSong = song => {
    if (song.audioUrl) {
      setCurrentSong(song)
      setMessage('')
    } else {
      setCurrentSong(null)
      setMessage('Preview not available for this song.')
    }
  }

  const renderLoadingView = () => (
    <div className="playlist-loading-container">
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
    <div className="playlist-page">
      <SideBar />

      <div className="playlist-content">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="playlist-header">
          <img
            src={playlistDetails.imageUrl}
            alt={playlistDetails.name}
            className="playlist-cover"
          />

          <div className="playlist-info">
            <p className="playlist-category">Editor's Picks</p>

            <h1 className="playlist-title">{playlistDetails.name}</h1>

            <p className="playlist-owner">{playlistDetails.owner}</p>

            <p className="playlist-description">
              {playlistDetails.description}
            </p>
          </div>
        </div>

        {message && <p className="playlist-error">{message}</p>}

        {songs.length > 0 ? (
          <div className="table-container">
            <table className="songs-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Track</th>
                  <th>Album</th>
                  <th>Duration</th>
                  <th>Artist</th>
                  <th>Added</th>
                </tr>
              </thead>

              <tbody>
                {songs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="song-row"
                    onClick={() => onClickSong(song)}
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

                    <td>{song.albumName}</td>

                    <td>{song.duration}</td>

                    <td>{song.artistName}</td>

                    <td>{song.addedAt}</td>
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

            <div>
              <p className="player-title">{currentSong.songName}</p>

              <p className="player-artist">{currentSong.artistName}</p>
            </div>
          </div>

          <audio
            controls
            autoPlay
            className="audio-player"
            key={currentSong.id}
          >
            <source src={currentSong.audioUrl} type="audio/mpeg" />

            <track kind="captions" />
          </audio>
        </div>
      )}
    </div>
  )

  const renderPlaylistDetails = () => {
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

  return renderPlaylistDetails()
}

export default PlaylistDetails