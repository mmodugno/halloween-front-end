import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import Spiderweb from '../assets/spiderweb.png'; 
import Spiderwalk from '../assets/spider-walk.gif'; 
import Bat from '../assets/bats.gif'; 
import Boogeyman from '../assets/boogeyman.gif'; 
import Ghost from '../assets/ghost-purple.gif';

import CandidateCardModal from "./CandidateCardModal"
import HalloweenButton from "./base/HalloweenButton";

const backgroundImages = [Spiderwalk, Bat, Boogeyman, Ghost]

const CandidateCard = ({
  candidateId,
  name,
  costume,
  hasVoted,
  onVote,
  disableVoteButton,
  index,
}) => {
  const [openModal, setOpenModal] = useState(false)

  async function submitVote(comment) {
    onVote(candidateId, comment)
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ec661e',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Item style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '155px', // Adjust the height as needed
      position: 'relative',
      
    }}>
      <Box
        alt={'telaraña'}
        loading="lazy"
        sx={{
          position: 'absolute',
          backgroundImage: `url(${Spiderweb})`,
          height: '100%',
          width: '100%',
          backgroundPositionX: 'right',
          backgroundPositionY: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          opacity: '20%',
        }} />
      <Box
        alt={'moving gif'}
        loading="lazy"
        sx={{
          position: 'absolute',
          backgroundImage: `url(${backgroundImages[index]})`,
          height: '100%',
          width: '30%',
          left: '0',
          bottom: '0',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPositionY: 'bottom'
        }} />
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >

        <Typography component="div" gutterBottom
          sx={{ fontSize: "1.7rem", fontWeight: "bold", color: "black", lineHeight: "1.7rem" }}
        >
          {costume}
        </Typography>
        <Typography
          sx={{ fontSize: "1.2rem", color: "black", lineHeight: "1.7rem" }}
        >
          {name}
        </Typography>
        <HalloweenButton
          variant="contained"
          disabled={hasVoted || disableVoteButton}
          onClick={() => setOpenModal(true)}
          style={{ cursor: disableVoteButton ? "not-allowed" : "pointer", }}
        >
          {disableVoteButton ? "No seas tramposo" : "Votar"}
        </HalloweenButton>
      </Stack>
      <CandidateCardModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        costume={costume}
        submitVote={submitVote}
      ></CandidateCardModal>
    </Item>
  );
};

export default CandidateCard;
