import React from 'react';

const VotedCandidateCard = ({ costume }) => {
  if (costume) return (
    <div>
      <h2 style={{ fontFamily: "Nightmare", fontSize: "2.5rem", color: "white", lineHeight: "1.7rem", marginBottom: "1rem" }}>Votaste a: {costume}</h2>
    </div>
  );
};

export default VotedCandidateCard;
