import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const CandidateCard = ({ name, description, votes, onVote, hasVoted }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={2} >
      <h2>{name}</h2>
      <p>{description}</p>
      <Button variant="contained" disabled={hasVoted} onClick={onVote}>Votar</Button>
    </Grid>
  );
};

export default CandidateCard;
