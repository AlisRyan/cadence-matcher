import React, { useState, useEffect } from 'react';
import './Search.css';
import PlaylistGrid from './PlaylistGrid/PlaylistGrid';
import Slider from './Slider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilteredTracks from './FilteredTracks';
import LoginScreen from './LoginScreen/LoginScreen';
import spotifyLogo from './PlaylistGrid/spotify-logo.png'


const Search = ({
  accessToken,
  userPlaylists,
  handlePlaylistSelect,
  selectedPlaylistTracks,
  setSelectedPlaylistTracks,
  handleLogin,
  setFilteredTracks, // Receive the setter function as a prop
  userId,
  createPlaylistWithTracks,
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [energyRange, setEnergyRange] = useState({ min: 0, max: 10 });
  const [danceabilityRange, setDanceabilityRange] = useState({ min: 0, max: 10 });
  const [tempoRange, setTempoRange] = useState({ min: 0, max: 200 });

  const navigate = useNavigate();

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

    // Remove or add the selected playlist from the filteredPlaylists
    setFilteredPlaylists((prevFilteredPlaylists) =>
      prevFilteredPlaylists.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const [filteredPlaylists, setFilteredPlaylists] = useState(userPlaylists);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = userPlaylists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPlaylists(filtered);
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
          return (
            energy >= energyRange.min * 0.1 &&
            energy <= energyRange.max * 0.1 &&
            danceability >= danceabilityRange.min * 0.1 &&
            danceability <= danceabilityRange.max * 0.1 &&
            tempo >= tempoRange.min &&
            tempo <= tempoRange.max
          );
        });

        console.log('Filtered tracks:', filteredTracks);

        // Set the filtered tracks to the state in the parent component (SpotifyApp.js)
        setFilteredTracks(filteredTracks);

        // Create a playlist with the filtered tracks
        createPlaylistWithTracks(
          accessToken,
          userId, // Replace with your user ID logic
          "Filtered Playlist", // Replace with your playlist name
          filteredTracks.map((track) => track.uri)
        );
      })
      .catch((error) => {
        console.error('Error fetching audio features:', error);
      });
  };

  useEffect(() => {
    setFilteredPlaylists(userPlaylists);
  }, [userPlaylists]);

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
                {/* <PlaylistGrid playlists={filteredPlaylists} handlePlaylistSelect={togglePlaylistSelection} /> */}
                <div className="playlist-grid">
                  {filteredPlaylists.map((playlist) => {
                    return (
                    <PlaylistGrid playlist={playlist} handlePlaylistSelect={togglePlaylistSelection}/>
                    )
                  })}
                  </div>
              </div>
              {selectedPlaylists.length > 0 && (
                <div className="selected-playlists-container">
                  <h2>Selected Playlists</h2>
                  <div className="selected-playlists">
                    {selectedPlaylists.map((playlistId, index) => {
                      const playlist = userPlaylists.find((playlist) => playlist.id === playlistId);
                      return (
                        <PlaylistGrid playlist={playlist} handlePlaylistSelect={togglePlaylistSelection}/>
                        );
                    })}
                  </div>
                </div>
              )}
              {selectedPlaylists.length > 0 && (
                <div className="selected-tracks-container">
                  <h2>Selected Tracks</h2>
                  <ul>
                    {selectedPlaylistTracks.map((track, index) => (
                      <li key={`${track.id}-${index}`}>{track.name}</li>
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
        <LoginScreen handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default Search;
