import React from 'react';
import Button from '@mui/material/Button';

const CandidateCard = ({ name, description, votes, onVote, hasVoted }) => {
  return (
    <div className="candidate-card">
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Votos: {votes}</p>
      <Button variant="contained" disabled={hasVoted} onClick={onVote}>Votar {hasVoted}</Button>
    </div>
  );
};

export default CandidateCard;
