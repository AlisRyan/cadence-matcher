import React from 'react';
import './PlaylistDetailsOverlay.css';

const PlaylistDetailsOverlay = ({ playlist, onClose }) => {
  return (
    <div className="overlay-container" onClick={onClose}>
      <div className="playlist-details-overlay">
        {playlist.coverUrl && <img src={playlist.coverUrl} alt="Playlist Cover" />}
        <h3>{playlist.name}</h3>
        <p>Creator: {playlist.creator}</p>
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div>
            <h4>Tracks</h4>
            <ul>
              {playlist.tracks.map((track) => (
                <li key={track.id}>{track.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No tracks found in this playlist.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailsOverlay;
