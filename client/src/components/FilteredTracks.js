import React, { useState } from "react";
import PlaylistGrid from "./PlaylistGrid";
import {
  Box,
  Center,
  Heading,
  VStack,
  HStack,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import CustomButton from "./CustomButton";
import axios from "axios";
import LoginScreen from "./LoginScreen";

const FilteredTracks = ({
  filteredTracks,
  accessToken,
  userId,
  handleLogin,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const nothing = () => {};

  const handleCreatePlaylist = () => {
    if (playlistName.trim() === "") {
      return;
    }

    const uniqueTrackUris = [
      ...new Set(filteredTracks.map((track) => track.uri)),
    ]; 
    axios
      .post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          public: isPublic,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        const playlistId = response.data.id;

        axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: uniqueTrackUris,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setPlaylistName("");
        setIsPublic(true); 
      })
      .catch((error) => {
        console.error("Error creating playlist:", error);
      });
  };

  return (
    <Box>
      {accessToken ? (
        <Center>
          <Box
            marginTop="60px"
            minHeight="90vh"
            minWidth="480px"
            width="80vw"
            backgroundColor="rgb(255, 255, 255, .8)"
            borderRadius="3em"
            boxShadow="-1em 1em 1em rgba(0,0,0,.25)"
          >
            <VStack>
              <Heading paddingY="50px">Create Your Playlist!</Heading>
              <HStack
                flexDirection={{
                  base: "column-reverse", 
                  md: "row",
                }}
              >
                <VStack>
                  <VStack maxHeight="60vh" overflowY="scroll" marginLeft="30px">
                    {filteredTracks.map((track) => {
                      return (
                        <PlaylistGrid
                          playlist={track}
                          handlePlaylistSelect={nothing}
                        />
                      );
                    })}
                  </VStack>
                </VStack>
                <VStack width="50vw" justifyContent="space-evenly">
                  <Input
                    focusBorderColor="black"
                    type="text"
                    variant="flushed"
                    placeholder="Playlist Name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    marginX="5%"
                    marginBottom="5vh"
                    width="90%"
                  />
                  <Checkbox
                    defaultChecked
                    colorScheme="blackAlpha"
                    size="lg"
                    outlineColor="black"
                    marginBottom="5vh"
                    isChecked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  >
                    Public
                  </Checkbox>
                  <CustomButton
                    click={handleCreatePlaylist}
                    label={"Create playlist"}
                  />
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </Center>
      ) : (
        <LoginScreen handleLogin={handleLogin} />
      )}
    </Box>
  );
};

export default FilteredTracks;
