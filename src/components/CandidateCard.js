import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CandidateCardModal from "./CandidateCardModal"

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

  return (
    <Container>
    <Card
      variant="outlined"
      style={{
        backgroundColor: "#f5f5f5",
        color: "#000",
        borderRadius: "18px",
        border: "1px solid #ddd",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom style={{ fontWeight: 'bold' }}>
          {costume}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {name}
        </Typography>
        <Button
          variant="contained"
          disabled={hasVoted || disableVoteButton}
          // onClick={onVote}
          onClick={() => setOpenModal(true)}
          style={{
            marginTop: '10px',
            color: "white",
            cursor: disableVoteButton ? "not-allowed" : "pointer",
          }}
        >
          {disableVoteButton ? "No seas tramposo" : "Votar"}
        </Button>
      </CardContent>
    </Card>
    <CandidateCardModal 
      openModal={openModal}
      setOpenModal={setOpenModal}
      costume={costume}
      submitVote={submitVote}
    ></CandidateCardModal>
    </Container>
  );
};

export default CandidateCard;
