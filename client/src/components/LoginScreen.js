import React from "react";
import { Heading, VStack, Text, Center } from "@chakra-ui/react";
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
            This website was created so that you can cater your playlists to your running cadence and preferences!
            It's been shown that running with music at a faster tempo encourages you to keep that cadence, which
            can not only make you run faster but prevent injury. You'll also be able to customize other stats to
            your liking, like energy, danceability, and happiness. 
          </Text>
          <Text textAlign="center" opacity="." padding="5%">
            First, log into spotify below, and then select the playlists from
            your library that you'd like to include songs from. This makes it so
            that your playlist will only have songs that you love and fit the
            vibe of your runs. Then, you can customize the stats of your
            playlist under the selected tracks tab. When you are done, hit
            continue and set up the playlist name and privacy, and you'll be set with your new custom playlist!
          </Text>
          <CustomButton click={handleLogin} label={"Log in with Spotify"} />
        </VStack>
      </Center>
  );
};

export default LoginScreen;
