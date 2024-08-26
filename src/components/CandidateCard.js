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
    }}>
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
