import React from 'react';
import spotifyLogo from './spotify-logo.png';
import { HStack, Link, Text, Box, Image } from '@chakra-ui/react';

const PlaylistGrid = ({ playlist, handlePlaylistSelect }) => {
    const handleSelect = () => {
        handlePlaylistSelect(playlist.id);
    };

    return (
        <HStack
        backgroundColor="gray.100" fontSize="15px" padding="10px"
            key={playlist.id}
            onClick={handleSelect}
            cursor="pointer"
            width='100%'
            borderRadius="100px"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            {playlist.coverUrl && <Image   
            width="50px"
            height="50px"
            objectFit="cover"
            marginLeft="20px"
            src={playlist.coverUrl} alt="Playlist Cover" />}
            <Text>{playlist.name}</Text>
            <Box marginLeft="auto" paddingRight="20px">
            <Link href={playlist.link} target="_blank" rel="noopener noreferrer">
                <Image
                height="50px"
                width="50px" className="spotify-logo" src={spotifyLogo} alt="Spotify Logo" />
            </Link>
            </Box>
        </HStack>
    );
};

export default PlaylistGrid;