import React from 'react';

const VotedCandidateCard = ({ name }) => {
  if (name) return (
    <div className="candidate-card">
      <h2>Votaste a: {name}</h2>
    </div>
  );
};

export default VotedCandidateCard;
