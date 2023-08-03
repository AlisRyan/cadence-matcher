import React, { useEffect } from 'react';

const SpotifyAuth = ({ spotifyClientId, onAccessToken }) => {
  useEffect(() => {
    // Check if there's a Spotify access token in the URL
    const params = new URLSearchParams(window.location.hash.replace('#', ''));
    const accessToken = params.get('access_token');

    if (accessToken) {
      onAccessToken(accessToken);

      // Redirect to the home page after successful login
      window.location.href = '/';
    }
  }, [onAccessToken]);

  const handleLogin = () => {
    const redirectUri = `${window.location.origin}/callback`;
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-read-private%20playlist-read-private`;
  };

  return (
    <div>
      <h1>Please log in with your Spotify account to continue</h1>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
};

export default SpotifyAuth;
