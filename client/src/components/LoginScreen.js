import React from "react";
import { Heading, VStack, Text, Box, Center } from "@chakra-ui/react";
import CustomButton from "./CustomButton";

const LoginScreen = ({ handleLogin }) => {
  return (
      <Center>
        <VStack
          bgColor="rgb(255, 255, 255, .8)"
          borderRadius="3em"
          boxShadow="-1em 1em 1em rgba(0,0,0,.25)"
          minWidth="480px"
          width="90vh"
          minHeight="90vh"
          marginTop="5vh"
          opacity=".8"
          paddingBottom="5%"
          marginBottom="5%"
        >
          <Heading paddingTop="10%" textAlign="center">Welcome to the Cadence Matcher!</Heading>
          <Text textAlign="center" opacity="." padding="5%">
            This website is here so that you can cater your playlists to your
            running cadence. It's been shown that running with music at a faster
            tempo not only encourages you to run faster, but also prevent
            injury. You'll also be able to customize the level of danceability
            and energy that you want all the songs to be at to form your custom
            running playlist. You can find more benefits of running with music
            at the right tempo HERE.
          </Text>
          <Text textAlign="center" opacity="." padding="5%">
            First, log into spotify below, and then select the playlists from
            your library that you'd like to include songs from. This makes it so
            that your playlist will only have songs that you love and fit the
            vibe of your runs. Then, you can customize the stats of your
            playlist from the sliders on the right. When you are done, hit
            continue and we'll boot up your playlist for you.
          </Text>
          <CustomButton click={handleLogin} label={"Log in with Spotify"} />
        </VStack>
      </Center>
  );
};

export default LoginScreen;
