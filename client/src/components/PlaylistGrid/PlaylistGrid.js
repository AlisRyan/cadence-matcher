import React from 'react';
import './PlaylistGrid.css';
import spotifyLogo from './spotify-logo.png'; // Make sure to import the Spotify logo image

const PlaylistGrid = ({ playlist, handlePlaylistSelect }) => {
  // return (
  //   <div className="playlist-grid">
  //     {playlists.map((playlist) => (
    return (
        <div
          className="playlist-item"
          key={playlist.id} // Use playlist ID as the first part of the key
          onClick={() => handlePlaylistSelect(playlist.id)}
        >
          {playlist.coverUrl && <img className="playlist-cover" src={playlist.coverUrl} alt="Playlist Cover" />}
          <span className="playlist-name">{playlist.name}</span>
          <a href={playlist.link} target="_blank" rel="noopener noreferrer">
            <img className="spotify-logo" src={spotifyLogo} alt="Spotify Logo" />
          </a>
        </div>
    //   ))}
    // </div>
  );
};

export default PlaylistGrid;