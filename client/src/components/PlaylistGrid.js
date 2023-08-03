import React from 'react';
import './PlaylistGrid.css';

const PlaylistGrid = ({ playlists, handlePlaylistSelect }) => {
  return (
    <div className="playlist-grid">
      {playlists.map((playlist) => (
        <div className="playlist-item" key={playlist.id} onClick={() => handlePlaylistSelect(playlist.id)}>
          {playlist.coverUrl && <img src={playlist.coverUrl} alt="Playlist Cover" />}
          <span>{playlist.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PlaylistGrid;
