import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';

const Home = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidato 1', description: 'Descripción 1', votes: 0 },
    { id: 2, name: 'Candidato 2', description: 'Descripción 2', votes: 0 },
    { id: 3, name: 'Candidato 3', description: 'Descripción 3', votes: 0 }
  ]);

  const [vote, setVote] = useState(0)

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
     setVote(vote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('halloween-vote', JSON.stringify(vote));
  }, [vote]);
  
  const handleVote = (id) => {
    setCandidates(
      candidates.map(candidate =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
  };

  const handleUserVote = id => {
    setVote(id)
  }

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
            hasVoted={vote !== 0}
            onVote={() => {
              handleUserVote(candidate.id)
              handleVote(candidate.id)
            }}
          />
        ))}
      </div>
      <div className="candidate-vote">
          <VotedCandidateCard id={vote} />
      </div>
    </div>
  );
};

export default Home;
