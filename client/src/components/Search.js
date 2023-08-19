import React, { useState, useEffect } from "react";
import PlaylistGrid from "./PlaylistGrid";
import Slider from "./Slider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginScreen from "./LoginScreen";
import { HStack, Heading, Input, VStack, Checkbox } from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Box,
} from "@chakra-ui/react";
import CustomButton from "./CustomButton";

const Search = ({
  accessToken,
  userPlaylists,
  handlePlaylistSelect,
  selectedPlaylistTracks,
  setSelectedPlaylistTracks,
  handleLogin,
  setFilteredTracks, // Receive the setter function as a prop
  userId,
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [energyRange, setEnergyRange] = useState({ min: 0, max: 10 });
  const [danceabilityRange, setDanceabilityRange] = useState({ min: 0, max: 10 });

  const [tempoRange, setTempoRange] = useState({ min: 0, max: 200 });
  const [valenceRange, setValenceRange] = useState({ min: 0, max: 10 });

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
      setSelectedPlaylists((prevSelectedPlaylists) => [
        ...prevSelectedPlaylists,
        playlistId,
      ]);
      handlePlaylistSelect(playlistId);
    }

    // Remove or add the selected playlist from the filteredPlaylists
    setFilteredPlaylists((prevFilteredPlaylists) =>
      prevFilteredPlaylists.filter((playlist) => playlist.id !== playlistId)
    );
  };
  const nothing = () => {};

  const [filteredPlaylists, setFilteredPlaylists] = useState(userPlaylists);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = userPlaylists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPlaylists(filtered);
  };

  const handleContinue = () => {
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
          const { energy, danceability, tempo, loudness, valence } =
            audioFeatures[index];
          return (
            energy >= energyRange.min * 0.1 &&
            energy <= energyRange.max * 0.1 &&
            danceability >= danceabilityRange.min * 0.1 &&
            danceability <= danceabilityRange.max * 0.1 &&
            (tempo >= tempoRange.min ||
              Math.abs(tempoRange.min / 2 - tempo) < 10) &&
            (tempo <= tempoRange.max ||
              Math.abs(tempoRange.max / 2 - tempo) < 10) &&
            valence >= valenceRange.min * 0.1 &&
            valence <= valenceRange.max * 0.1
          );
        });

        console.log("Filtered tracks:", filteredTracks);

        // Set the filtered tracks to the state in the parent component (SpotifyApp.js)
        setFilteredTracks(filteredTracks);

        // Navigate to the FilteredTracks page
        navigate("/filtered", {
          state: {
            filteredTracks: filteredTracks, // Pass the filteredTracks array
            accessToken: accessToken, // Pass the accessToken
            userId: userId, // Pass the userId
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching audio features:", error);
      });
  };

  useEffect(() => {
    setFilteredPlaylists(userPlaylists);
  }, [userPlaylists]);

  return (
    <Box>
      {accessToken ? (
        <Center>
          <VStack
            marginTop="60px"
            height="90vh"
            width="80vw"
            backgroundColor="rgb(255, 255, 255, .8)"
            borderRadius="3em"
            boxShadow="-1em 1em 1em rgba(0,0,0,.25)"
          >
            <Heading paddingY="20px">Cadence Matcher</Heading>
            <div className="search">
              <Tabs
                width="80vw"
                variant="soft-rounded"
                colorScheme="gray"
                isFitted
              >
                <TabList>
                  <Tab>Select Playlists</Tab>
                  <Tab>Selected Playlists</Tab>
                  <Tab>Selected Tracks</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Input
                      focusBorderColor="black"
                      type="text"
                      variant="flushed"
                      placeholder="Search playlists..."
                      marginX="5%"
                      marginY="2%"
                      width="90%"
                      onChange={handleSearchChange}
                    />
                    <VStack maxHeight="40vh" overflowY="scroll">
                      {filteredPlaylists.map((playlist) => {
                        return (
                          <PlaylistGrid
                            playlist={playlist}
                            handlePlaylistSelect={togglePlaylistSelection}
                          />
                        );
                      })}
                    </VStack>
                  </TabPanel>
                  <TabPanel width="100%">
                    {selectedPlaylists.length > 0 && (
                      <VStack maxHeight="50vh" overflowY="scroll">
                        <div>
                          {selectedPlaylists.map((playlistId, index) => {
                            const playlist = userPlaylists.find(
                              (playlist) => playlist.id === playlistId
                            );
                            return (
                              <PlaylistGrid
                                playlist={playlist}
                                handlePlaylistSelect={togglePlaylistSelection}
                              />
                            );
                          })}
                        </div>
                      </VStack>
                    )}
                  </TabPanel>
                  <TabPanel>
                    <Center>
                      <HStack>
                        {selectedPlaylists.length > 0 && (
                          <VStack maxHeight="50vh" overflowY="scroll">
                            {" "}
                            {selectedPlaylistTracks.map((track, index) => {
                              // const playlist = userPlaylists.find((playlist) => playlist.id === playlistId);
                              return (
                                <PlaylistGrid
                                  playlist={track}
                                  handlePlaylistSelect={nothing}
                                />
                              );
                            })}
                            {/* </ul> */}
                          </VStack>
                        )}
                        {selectedPlaylists.length > 0 && (
                          <VStack className="filter-container">
                            <Slider
                              label="Energy"
                              min={0}
                              max={10}
                              step={1}
                              onChange={(value) =>
                                setEnergyRange({
                                  min: value.minValue,
                                  max: value.maxValue,
                                })
                              }
                            />
                            <Slider
                              label="Danceability"
                              min={0}
                              max={10}
                              step={1}
                              onChange={(value) =>
                                setDanceabilityRange({
                                  min: value.minValue,
                                  max: value.maxValue,
                                })
                              }
                            />
                            <Slider
                              label="Tempo"
                              min={50}
                              max={220}
                              step={5}
                              onChange={(value) =>
                                setTempoRange({
                                  min: value.minValue,
                                  max: value.maxValue,
                                })
                              }
                            />
                            <Slider
                              label="Happiness"
                              min={0}
                              max={10}
                              step={1}
                              onChange={(value) =>
                                setValenceRange({
                                  min: value.minValue,
                                  max: value.maxValue,
                                })
                              }
                            />
                          </VStack>
                        )}
                      </HStack>
                    </Center>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
            {selectedPlaylists.length > 0 && (
              <CustomButton click={handleContinue} label={"Continue"} />
            )}
          </VStack>
        </Center>
      ) : (
        <LoginScreen handleLogin={handleLogin} />
      )}
    </Box>
  );
};

export default Search;
