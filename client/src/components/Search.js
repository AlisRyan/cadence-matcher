import React, { useState } from 'react';
import './Search.css';
import PlaylistGrid from './PlaylistGrid';

const Search = ({
  accessToken,
  userPlaylists,
  filteredPlaylists,
  handleSearchChange,
  handlePlaylistSelect,
  selectedPlaylistTracks,
  setSelectedPlaylistTracks,
  handleLogin,
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const togglePlaylistSelection = (playlistId) => {
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists((prevSelectedPlaylists) =>
        prevSelectedPlaylists.filter((id) => id !== playlistId)
      );
      setSelectedPlaylistTracks((prevSelectedTracks) =>
        prevSelectedTracks.filter((track) => track.playlistId !== playlistId)
      );
    } else {
      setSelectedPlaylists((prevSelectedPlaylists) => [...prevSelectedPlaylists, playlistId]);
      handlePlaylistSelect(playlistId);
    }
  };

  const handleContinue = () => {
    console.log('Selected playlists:', selectedPlaylists);
  };

  return (
    <div>
      {accessToken ? (
        <div>
          <h1>Spotify Playlist Search</h1>
          <div className="search">
            <input
              className="searchInputs"
              type="text"
              placeholder="Search playlists..."
              onChange={handleSearchChange}
            />
            <PlaylistGrid playlists={filteredPlaylists} handlePlaylistSelect={togglePlaylistSelection} />
          </div>
          {selectedPlaylists.length > 0 && (
            <div>
              <h2>Selected Playlists</h2>
              <div className="selected-playlists">
                {selectedPlaylists.map((playlistId) => {
                  const playlist = userPlaylists.find((playlist) => playlist.id === playlistId);
                  return (
                    <div
                      key={playlist.id}
                      className="selected-playlist-item"
                      onClick={() => togglePlaylistSelection(playlist.id)}
                    >
                      {playlist.coverUrl && <img src={playlist.coverUrl} alt="Playlist Cover" />}
                      <span>{playlist.name}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={handleContinue}>Continue</button>
            </div>
          )}
          {selectedPlaylistTracks.length > 0 && (
            <div>
              <h2>Selected Tracks</h2>
              <ul>
                {selectedPlaylistTracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1>Please log in with your Spotify account to continue</h1>
          <button onClick={handleLogin}>Log in with Spotify</button>
        </div>
      )}
    </div>
  );
};

export default Search;
