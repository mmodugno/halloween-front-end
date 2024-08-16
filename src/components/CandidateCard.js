import React from 'react';

const CandidateCard = ({ name, description, votes, onVote }) => {
  return (
    <div className="candidate-card">
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Votos: {votes}</p>
      <button onClick={onVote}>Votar</button>
    </div>
  );
};

export default CandidateCard;
