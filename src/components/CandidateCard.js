import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const CandidateCard = ({
  name,
  costume,
  votes,
  onVote,
  hasVoted,
  disableVoteButton,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={2}>
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
            onClick={onVote}
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
    </Grid>
  );
};

export default CandidateCard;
