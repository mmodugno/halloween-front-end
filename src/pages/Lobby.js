// src/Lobby.js
import React from 'react';
import { Container, Typography, Box, useTheme} from '@mui/material';
import { styled } from '@mui/system';

const Lobby = () => {
  const theme = useTheme();
  const pulseAnimation = `
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
const AnimatedTypography = styled(Typography)`
  ${pulseAnimation}
  animation: pulse 10s infinite;
`;

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >

      <AnimatedTypography 
      variant="h4" 
      component="h1" 
      sx={{ 
        marginBottom: theme.spacing(4), 
        fontFamily: 'Halloween', 
        color: '#D3D3D3'
        }}>
      LA VOTACION <span style={{ color: '#880808' }}>NO </span> ESTA ABIERTA TODAVIA
      </AnimatedTypography>
      <Box mb={4}>
        <img
          src="https://media.giphy.com/media/fvwgJhsUcvVrIFLsuk/giphy.gif"
          alt="Waiting"
          style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
        />
      </Box>
    </Container>
  );
};

export default Lobby;