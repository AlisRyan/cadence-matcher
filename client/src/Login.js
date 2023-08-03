import React from 'react';

const CLIENT_ID = "5c010250cf29431c9f1512dd06dce82a";
const CLIENT_SECRET = "c8d36bc8313d4d4c884cba88f06d5d4e"
const REDIRECT_URI = "http://localhost:3000"

const AUTH_URL = "https://accounts.spotify.com/authorize"
const SPACER = "%20"
const SCOPES = ["playlist-read-private", "playlist-read-collaborative", "playlist-modify-private", "playlist-modify-public", "user-library-read"];

const SCOPES_URL_PARAM = SCOPES.join(SPACER);

export default function Login() {
    const handleLogin = () => {
        window.location = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}`
    }
    return (
        <div>
            <button onClick={handleLogin}>Login to Spotify</button>
        </div>
    )
}