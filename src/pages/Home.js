import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';
import { detectIncognito } from "detectincognitojs";

const Home = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Candidato 1', description: 'Descripción 1', votes: 0 },
    { id: 2, name: 'Candidato 2', description: 'Descripción 2', votes: 0 },
    { id: 3, name: 'Candidato 3', description: 'Descripción 3', votes: 0 },
    { id: 4, name: 'Candidato 4', description: 'Descripción 4', votes: 0 },
    { id: 5, name: 'Candidato 5', description: 'Descripción 5', votes: 0 },
    { id: 6, name: 'Candidato 6', description: 'Descripción 6', votes: 0 },
    { id: 7, name: 'Candidato 7', description: 'Descripción 7', votes: 0 },
    { id: 8, name: 'Candidato 8', description: 'Descripción 8', votes: 0 },
    { id: 9, name: 'Candidato 9', description: 'Descripción 9', votes: 0 }
  ]);

  const [vote, setVote] = useState(0)

  const [isIncognito, setIncognito] = useState(false);

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
      setVote(vote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('halloween-vote', JSON.stringify(vote));
  }, [vote]);

  useEffect(() => {
    async function checkIncognito() {
      const isIncognito = await detectIncognito()
      setIncognito(isIncognito.isPrivate)
    }
    checkIncognito()
  }, [])


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

  if (isIncognito) {
    document.body.style = 'background-color:#2f2c36;';
    return (
      <div class="shall-not-pass">
        <img src={require('../assets/not-pass.gif')} alt="you can't pass" />
      </div>
    )
  }
  return (
    <Container style="background-color:#2f2c36;">
      <Header />
      <Container>
        <VotedCandidateCard id={vote} />
      </Container>
      <Grid container spacing={4}>
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
      </Grid>
    </Container>
  );
};

export default Home;
