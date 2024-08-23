import React from 'react';

const VotedCandidateCard = ({ name: costume }) => {
  if (costume) return (
    <div className="candidate-card">
      <h2>Votaste a: {costume}</h2>
    </div>
  );
};

export default VotedCandidateCard;
