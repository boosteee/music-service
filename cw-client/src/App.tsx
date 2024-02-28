import { ThemeProvider } from '@/components/ThemeProvider';
import MainLayout from '@/pages/MainLayout';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ArtistPage from './pages/ArtistPage';
import AuthProvider from './components/AuthProvider';
import AuthenticateProvider from './components/AuthenticateProvider';
import LibraryPage from './pages/LibraryPage';
import ArtistDemoPage from './pages/ArtistDemoPage';
import AlbumDemoPage from './pages/AlbumDemoPage';
import AlbumPage from './pages/AlbumPage';
import PlaylistPage from './pages/PlaylistPage';
import SearchPage from './pages/SearchPage';
import AdminAlbumPage from './pages/AdminAlbumPage';
import AdminArtistPage from './pages/AdminArtistPage';
import AdminTrackPage from './pages/AdminTrackPage';
import AdminUserPage from './pages/AdminUserPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <Routes>
            <Route element={<LoginPage />} path='/login' />
            <Route element={<AuthenticateProvider />}>
              <Route element={<MainLayout />} path='/'>
                <Route
                  index
                  element={<LibraryPage />}
                  path='/playlists'
                ></Route>
                <Route
                  element={<PlaylistPage />}
                  path='/playlists/:playlistId'
                ></Route>
                <Route element={<ArtistDemoPage />} path='/artists'></Route>
                <Route
                  element={<ArtistPage />}
                  path='/artists/:artistId'
                ></Route>
                <Route element={<AlbumDemoPage />} path='/albums'></Route>
                <Route element={<AlbumPage />} path='/albums/:albumId' />
                <Route element={<SearchPage />} path='/search' />
                <Route element={<AdminArtistPage />} path='/admin/artists' />
                <Route element={<AdminAlbumPage />} path='/admin/albums' />
                <Route element={<AdminTrackPage />} path='/admin/tracks' />
                <Route element={<AdminUserPage />} path='/admin/users' />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
