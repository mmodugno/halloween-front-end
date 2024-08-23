import React from 'react';

const VotedCandidateCard = ({ costume }) => {

  //console.log(costume)
  if (costume) return (
    <div className="candidate-card">
      <h2>Votaste a: {costume}</h2>
    </div>
  );
};

export default VotedCandidateCard;
