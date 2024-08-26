import React, { useState } from "react";
// import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CandidateCardModal from "./CandidateCardModal"
import HalloweenButton from "./base/HalloweenButton";

const CandidateCard = ({
  candidateId,
  name,
  costume,
  hasVoted,
  onVote,
  disableVoteButton,
}) => {
  const [openModal, setOpenModal] = useState(false)

  async function submitVote(comment) {
    onVote(candidateId, comment)
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ff9033',
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
    }}>
      <Stack 
        spacing={2}
        justifyContent="center"
        alignItems="center"      
      >
        <Typography variant="h6" component="div" gutterBottom style={{ fontWeight: 'bold' }}>
          {costume}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {name}
        </Typography>
        <HalloweenButton
          variant="contained"
          disabled={hasVoted || disableVoteButton}
          onClick={() => setOpenModal(true)}
          style={{
            marginTop: '10px',
            color: "white",
            cursor: disableVoteButton ? "not-allowed" : "pointer",
          }}
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
