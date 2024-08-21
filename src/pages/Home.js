import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';
import { detectIncognito } from "detectincognitojs";

const Home = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Vampiro', description: 'Juan Pérez', votes: 0 },
    { id: 2, name: 'Bruja del Bosque', description: 'Ana Gómez', votes: 0 },
    { id: 3, name: 'Pirata Zombi', description: 'Miguel Hernández', votes: 0 },
    { id: 4, name: 'Novia Fantasma', description: 'María López', votes: 0 },
    { id: 5, name: 'Científico Loco', description: 'Roberto Fernández', votes: 0 },
    { id: 6, name: 'Monstruo de Frankenstein', description: 'Laura Martínez', votes: 0 },
    { id: 7, name: 'Cazador de Hombres Lobo', description: 'David Ramírez', votes: 0 },
    { id: 8, name: 'Fantasma de la Ópera', description: 'Sofía González', votes: 0 },
    { id: 9, name: 'Faraón Momia', description: 'Daniel Rodríguez', votes: 0 }
  ]);

  const [vote, setVote] = useState(0)

  const [isIncognito, setIncognito] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(0)

  const [userID, setUserID] = useState(null);

  useEffect(() => {
    // Extract the userID from the URL path
    const pathParts = window.location.pathname.split('/');
    setUserID(Number(pathParts[pathParts.length - 1]));
  }, []);

  useEffect(() => {
        const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
      setSelectedCandidate(candidates.find(candidate => candidate.id === vote));
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
    window.location.reload();
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
    <Container>
      <Header />
      <Container>
        <VotedCandidateCard name={selectedCandidate.name} />
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
              if (candidate.id === userID) {
                alert("No podes autovotarte, tené dignidad");
              } else {
                handleUserVote(candidate.id);
                handleVote(candidate.id);
              }
            }}
            disableVoteButton={candidate.id === userID} // Disable the button if userId matches candidate.id
          />
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
