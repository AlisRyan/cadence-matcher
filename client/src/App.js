import React from 'react';
import SpotifyApp from './SpotifyApp.js';
import { ChakraProvider, Box } from '@chakra-ui/react'

function App() {
  return (
    
    <ChakraProvider>
          <Box
      bg="linear-gradient(132deg, #FC415A, #591BC5)"
      minWidth="100vw"
      minHeight="100vh"
      height="100%"
      width="100%"
    >
      <SpotifyApp />
    </Box>
    </ChakraProvider>
  );
}

export default App;