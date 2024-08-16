import React from 'react';

const VotedCandidateCard = ({ id }) => {
  if (id) return (
    <div className="candidate-card">
      <h2>Votaste al: #{id}</h2>
    </div>
  );
};

export default VotedCandidateCard;
