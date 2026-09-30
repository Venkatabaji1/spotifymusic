import {BrowserRouter, Route, Routes} from 'react-router-dom'

import Login from './Components/Login'
import Home from './Components/Home'
import PlaylistDetails from './Components/PlaylistDetails'
import CategoryPlaylistDetails from './Components/CategoryPlaylistDetails'
import AlbumDetails from './Components/AlbumDetails'
import ProtectedRoute from './Components/ProtectedRoute'
import NotFound from './Components/NotFound'
import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:playlistId"
        element={
          <ProtectedRoute>
            <PlaylistDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category-playlists/:categoryId"
        element={
          <ProtectedRoute>
            <CategoryPlaylistDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/album-details/:albumId"
        element={
          <ProtectedRoute>
            <AlbumDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
