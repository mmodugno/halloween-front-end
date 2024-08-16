import React from 'react';

const VoteButton = ({ onVote }) => {
  return <button onClick={onVote}>Votar</button>;
};

export default VoteButton;
