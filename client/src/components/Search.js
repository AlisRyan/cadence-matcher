import React, { useState } from 'react';
import './Search.css';
import PlaylistGrid from './PlaylistGrid';
import Slider from './Slider';
import axios from 'axios';

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
  const [energyRange, setEnergyRange] = useState({ min: 0, max: 10 });
  const [danceabilityRange, setDanceabilityRange] = useState({ min: 0, max: 10 });
  const [tempoRange, setTempoRange] = useState({ min: 0, max: 200 });

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
    console.log('Energy range:', energyRange);
    console.log('Danceability range:', danceabilityRange);
    console.log('Tempo range:', tempoRange);
  
    // Fetch audio features for all selected tracks
    const fetchAudioFeaturesPromises = selectedPlaylistTracks.map((track) =>
      axios.get(`https://api.spotify.com/v1/audio-features/${track.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    );
  
    Promise.all(fetchAudioFeaturesPromises)
      .then((responses) => {
        // Extract the audio features data from the responses
        const audioFeatures = responses.map((response) => response.data);
  
        // Filter selected tracks based on energy, danceability, and tempo ranges here
        const filteredTracks = selectedPlaylistTracks.filter((track, index) => {
          const { energy, danceability, tempo } = audioFeatures[index];
          console.log(audioFeatures[index])
          return (
            energy >= energyRange.min * .1 &&
            energy <= energyRange.max * .1 &&
            danceability >= danceabilityRange.min * .1 &&
            danceability <= danceabilityRange.max * .1 &&
            tempo >= tempoRange.min &&
            tempo <= tempoRange.max
          );
        });
  
        console.log('Filtered tracks:', filteredTracks);
        // Optionally, you can set the filtered tracks to the state or do other operations with them.
      })
      .catch((error) => {
        console.error('Error fetching audio features:', error);
      });
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
            <div className="side-by-side-container">
              <div className="playlist-search-container">
                <PlaylistGrid playlists={filteredPlaylists} handlePlaylistSelect={togglePlaylistSelection} />
              </div>
              {selectedPlaylists.length > 0 && (
                <div className="selected-playlists-container">
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
                </div>
              )}
              {selectedPlaylists.length > 0 && (
                <div className="selected-tracks-container">
                  <h2>Selected Tracks</h2>
                  <ul>
                    {selectedPlaylistTracks.map((track) => (
                      <li key={track.id}>{track.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedPlaylists.length > 0 && (
                <div className="filter-container">
                  <h2>Filter Tracks</h2>
                  <Slider
  label="Energy"
  min={0}
  max={10}
  step={1}
  onChange={(value) => setEnergyRange({ min: value.minValue, max: value.maxValue })}
/>
<Slider
  label="Danceability"
  min={0}
  max={10}
  step={1}
  onChange={(value) => setDanceabilityRange({ min: value.minValue, max: value.maxValue })}
/>
<Slider
  label="Tempo"
  min={0}
  max={200}
  step={5}
  onChange={(value) => setTempoRange({ min: value.minValue, max: value.maxValue })}
/>

                </div>
              )}
            </div>
          </div>
          {selectedPlaylists.length > 0 && <button onClick={handleContinue}>Continue</button>}
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
