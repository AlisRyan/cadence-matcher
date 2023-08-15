import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import "./SpotifyApp.css";
import { LoginCallback, Search } from "./components";
import FilteredTracks from "./components/FilteredTracks";

const SpotifyApp = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const spotifyClientId = "CLIENT_ID"; // Replace with your Spotify Client ID
  const [filteredTracks, setFilteredTracks] = useState([]); // Create a state to store the filtered tracks
  const [userId, setUserId] = useState(null); // State to store user ID


  useEffect(() => {
    // Check if there's a Spotify access token in the URL
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);

      // Fetch user's ID
      getUserId(accessToken);

      // Fetch user's playlists
      getPlaylists(accessToken);
    }
  }, []);

  const getUserId = (token) => {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  };

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
      setSelectedPlaylists((prevSelectedPlaylists) => [
        ...prevSelectedPlaylists,
        playlistId,
      ]);
      getPlaylistTracks(playlistId, (tracks) => {
        const newTracks = tracks.filter(
          (track) =>
            !selectedPlaylistTracks.some(
              (selectedTrack) =>
                selectedTrack.id === track.id && selectedTrack.playlistId === playlistId
            )
        );
        setSelectedPlaylistTracks((prevSelectedTracks) => [
          ...prevSelectedTracks,
          ...newTracks.map((track) => ({ ...track, playlistId })),
        ]);
      });
    }
  };
  

  const createPlaylistWithTracks = (token, userId, playlistName, trackUris) => {
    axios
      .post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          public: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        const playlistId = response.data.id;
        addTracksToPlaylist(token, playlistId, trackUris);
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
      });
  };

  const addTracksToPlaylist = (token, playlistId, trackUris) => {
    axios
      .post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        // Playlist created and tracks added successfully
      })
      .catch((error) => {
        console.error("Error adding tracks to playlist:", error);
      });
  };

  const getPlaylists = (token, url = "https://api.spotify.com/v1/me/playlists") => {
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const playlists = response.data.items.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          coverUrl: playlist.images.length > 0 ? playlist.images[0].url : null,
          link: playlist.external_urls.spotify,
        }));
  
        // Fetch the user's liked songs playlist separately
        if (url === "https://api.spotify.com/v1/me/playlists") {
          axios
            .get("https://api.spotify.com/v1/me/tracks", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              const likedSongsPlaylist = {
                id: "liked_songs", // A unique ID to represent the liked songs playlist
                name: "Liked Songs", // Name for display
                coverUrl: null, // You can add a cover image URL if you have one
              };
              playlists.unshift(likedSongsPlaylist); // Add the liked songs playlist at the beginning
            })
            .catch((error) => {
              console.error("Error fetching liked songs:", error);
            });
        }
  
        setUserPlaylists((prevPlaylists) => {
          // Filter out playlists that are already in the state
          const newPlaylists = playlists.filter(
            (playlist) => !prevPlaylists.some((prevPlaylist) => prevPlaylist.id === playlist.id)
          );
          return [...prevPlaylists, ...newPlaylists];
        });
  
        // Check for pagination
        if (response.data.next) {
          getPlaylists(token, response.data.next);
        }
      })
      .catch((error) => {
        console.error("Error fetching user playlists:", error);
      });
  };
  
  

  const getPlaylistTracks = (playlistId, callback) => {
    if (playlistId === "liked_songs") {
      // Special case for the user's liked songs playlist
      axios
        .get("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const tracks = response.data.items.map((item) => item.track);
          callback(tracks);
        })
        .catch((error) => {
          console.error("Error fetching liked songs:", error);
          callback([]); // Return an empty array in case of an error
        });
    } else {
      // Fetch tracks for regular playlists
      axios
        .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const tracks = response.data.items.map((item) => item.track);
          callback(tracks);
        })
        .catch((error) => {
          console.error("Error fetching playlist tracks:", error);
          callback([]); // Return an empty array in case of an error
        });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlaylists = userPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = () => {
    const redirectUri = "http://localhost:3000";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20playlist-modify-public`;
  };

  const handleLogout = () => {
    setAccessToken(null); // Clear the access token
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {accessToken && <button onClick={handleLogout}>Logout</button>}{" "}
        {/* Show Logout button if accessToken is present */}
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
              setSelectedPlaylistTracks={setSelectedPlaylistTracks}
              handleLogin={handleLogin}
              setFilteredTracks={setFilteredTracks} // Pass the setFilteredTracks function here
              userId={userId}
              createPlaylistWithTracks={createPlaylistWithTracks}
            />
          }
        />
        <Route path="/callback" element={<LoginCallback />} />
        <Route
          path="/filtered"
          element={<FilteredTracks filteredTracks={filteredTracks} />}
        />
      </Routes>
    </Router>
  );
};

export default SpotifyApp;
