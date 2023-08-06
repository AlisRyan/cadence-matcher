import React from 'react';
import './LoginScreen.css';

const LoginScreen = ({ handleLogin }) => {
  return (
    <div class="full">
      <div class = "text-gradient">
      <div class="info">
      <h1 class="head"> Welcome to the Cadence Matcher! </h1>
      <p>This website is here so that you can cater 
        your playlists to your running cadence. 
        It's been shown that running with music at a faster
        tempo not only encourages you to run faster, but also
        prevent injury. You'll also be able to customize the level of
        danceability and energy that you want all the songs to be at 
        to form your custom running playlist. You can find
        more benefits of running with music at the right tempo HERE.</p>
        <p>First, log into spotify below, and then select the playlists from 
          your library that you'd like to include songs from. This makes it so that
          your playlist will only have songs that you love and fit the vibe
          of your runs. Then, you can customize the stats of your playlist from
          the sliders on the right. When you are done, hit continue and we'll
          boot up your playlist for you.
        </p>

      </div>
    <div>
      <h1 class="head">Please log in with your Spotify account to continue</h1>
      <button class="log" onClick={handleLogin}>Log in with Spotify</button>
    </div>
    </div>
    </div>
  );
};

export default LoginScreen;
