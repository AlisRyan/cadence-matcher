import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import LoginCallback from "./components/LoginCallback";
import Search from "./components/Search";
import FilteredTracks from "./components/FilteredTracks";
import { Box } from "@chakra-ui/react";
import CustomButton from "./components/CustomButton";

const SpotifyApp = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const spotifyClientId = "82bc8c4840c346be96af9656e29dbc59"; // Replace with your Spotify Client ID
  const [filteredTracks, setFilteredTracks] = useState([]); 
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);

      getUserId(accessToken);

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
                selectedTrack.id === track.id &&
                selectedTrack.playlistId === playlistId
            )
        );
        setSelectedPlaylistTracks((prevSelectedTracks) => [
          ...prevSelectedTracks,
          ...newTracks.map((track) => ({ ...track, playlistId })),
        ]);
      });
    }
  };

  const getPlaylists = (
    token,
    url = "https://api.spotify.com/v1/me/playlists"
  ) => {
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

        if (url === "https://api.spotify.com/v1/me/playlists") {
          axios
            .get("https://api.spotify.com/v1/me/tracks", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              const likedSongsPlaylist = {
                id: "liked_songs", 
                name: "Liked Songs", 
                coverUrl: null, 
              };
              playlists.unshift(likedSongsPlaylist); 
            })
            .catch((error) => {
              console.error("Error fetching liked songs:", error);
            });
        }

        setUserPlaylists((prevPlaylists) => {
          const newPlaylists = playlists.filter(
            (playlist) =>
              !prevPlaylists.some(
                (prevPlaylist) => prevPlaylist.id === playlist.id
              )
          );
          return [...prevPlaylists, ...newPlaylists];
        });

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
      axios
        .get("https://api.spotify.com/v1/me/tracks", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const tracks = response.data.items.map((item) => item.track);
          const tracksComp = tracks.map((track) => ({
            id: track.id,
            name: track.name,
            coverUrl:
              track.album.images.length > 0 ? track.album.images[0].url : null,
            uri: track.uri,
            link: track.external_urls.spotify,
          }));
          callback(tracksComp);
        })
        .catch((error) => {
          console.error("Error fetching liked songs:", error);
          callback([]); 
        });
    } else {
      axios
        .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          const tracks = response.data.items.map((item) => item.track);
          const tracksComp = tracks.map((track) => ({
            id: track.id,
            name: track.name,
            coverUrl:
              track.album.images.length > 0 ? track.album.images[0].url : null,
            uri: track.uri,
            link: track.external_urls.spotify,
          }));
          callback(tracksComp);
        })
        .catch((error) => {
          console.error("Error fetching playlist tracks:", error);
          callback([]); 
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
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private%20playlist-read-collaborative%20user-library-read%20playlist-modify-public%20playlist-modify-private`;
  };

  const handleLogout = () => {
    setAccessToken(null); 
  };

  return (
    <Router>
      {accessToken && (
        <Box
          height="60px"
          top="0"
          left="0"
          right="0"
          zIndex="999"
          bg="rgb(255, 255, 255, .4)"
          boxShadow="0 0 1em rgba(0,0,0,.25)"
          alignItems="center"
          justifyContent="flex-end"
          display="flex"
          position="fixed"
        >
          <CustomButton click={handleLogout} label={"Logout"} />
        </Box>
      )}{" "}
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
              setFilteredTracks={setFilteredTracks}
              userId={userId}
            />
          }
        />
        <Route path="/callback" element={<LoginCallback />} />
        <Route
          path="/filtered"
          element={
            <FilteredTracks
              filteredTracks={filteredTracks}
              accessToken={accessToken}
              userId={userId}
              handleLogin={handleLogin}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default SpotifyApp;
