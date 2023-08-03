import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SpotifyApp.css';
import { LoginCallback, Search } from './components';

const SpotifyApp = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const spotifyClientId = 'CLIENT_ID'; // Replace with your Spotify Client ID

  useEffect(() => {
    // Check if there's a Spotify access token in the URL
    const params = new URLSearchParams(window.location.hash.replace('#', ''));
    const accessToken = params.get('access_token');

    if (accessToken) {
      setAccessToken(accessToken);

      // Fetch user's playlists
      getPlaylists(accessToken);
    }
  }, []);

  const handlePlaylistSelect = (playlistId) => {
    // Check if the playlistId is already selected
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists((prevSelectedPlaylists) =>
        prevSelectedPlaylists.filter((id) => id !== playlistId)
      );
      setSelectedPlaylistTracks((prevSelectedTracks) =>
        prevSelectedTracks.filter((track) => track.playlistId !== playlistId)
      );
    } else {
      setSelectedPlaylists((prevSelectedPlaylists) => [...prevSelectedPlaylists, playlistId]);
      getPlaylistTracks(playlistId, (tracks) => {
        setSelectedPlaylistTracks((prevSelectedTracks) => [
          ...prevSelectedTracks,
          ...tracks.map((track) => ({ ...track, playlistId })),
        ]);
      });
    }
  };

  const getPlaylists = (token) => {
    axios
      .get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const playlists = response.data.items.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          coverUrl: playlist.images.length > 0 ? playlist.images[0].url : null,
        }));
        setUserPlaylists(playlists);
      })
      .catch((error) => {
        console.error('Error fetching user playlists:', error);
      });
  };

  const getPlaylistTracks = (playlistId, callback) => {
    axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const tracks = response.data.items.map((item) => item.track);
        callback(tracks);
      })
      .catch((error) => {
        console.error('Error fetching playlist tracks:', error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlaylists = userPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = () => {
    const redirectUri = 'http://localhost:3000';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private`;
  };

  const handleLogout = () => {
    setAccessToken(null); // Clear the access token
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {accessToken && <button onClick={handleLogout}>Logout</button>} {/* Show Logout button if accessToken is present */}
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <Search
              accessToken={accessToken}
              userPlaylists={userPlaylists}
              filteredPlaylists={filteredPlaylists}
              handleSearchChange={handleSearchChange}
              handlePlaylistSelect={handlePlaylistSelect}
              selectedPlaylistTracks={selectedPlaylistTracks}
              setSelectedPlaylistTracks={setSelectedPlaylistTracks} // Pass the setter function down
              handleLogin={handleLogin}
            />
          }
        />
        <Route path="/callback" element={<LoginCallback />} />
      </Routes>
    </Router>
  );
};

export default SpotifyApp;
