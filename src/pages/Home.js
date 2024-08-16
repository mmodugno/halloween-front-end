import React, { useState } from 'react';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';

const Home = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidato 1', description: 'Descripción 1', votes: 0 },
    { id: 2, name: 'Candidato 2', description: 'Descripción 2', votes: 0 },
    { id: 3, name: 'Candidato 3', description: 'Descripción 3', votes: 0 }
  ]);

  const handleVote = (id) => {
    setCandidates(
      candidates.map(candidate =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
  };

  return (
    <div>
      <Header />
      <div className="candidates-list">
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            name={candidate.name}
            description={candidate.description}
            votes={candidate.votes}
            onVote={() => handleVote(candidate.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
