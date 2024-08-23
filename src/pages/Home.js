import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';
import { detectIncognito } from "detectincognitojs";

const Home = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, costume: 'Vampiro', name: 'Juan Pérez', votes: 0 },
    { id: 2, costume: 'Bruja del Bosque', name: 'Ana Gómez', votes: 0 },
    { id: 3, costume: 'Pirata Zombi', name: 'Miguel Hernández', votes: 0 },
    { id: 4, costume: 'Novia Fantasma', name: 'María López', votes: 0 },
    { id: 5, costume: 'Científico Loco', name: 'Roberto Fernández', votes: 0 },
    { id: 6, costume: 'Monstruo de Frankenstein', name: 'Laura Martínez', votes: 0 },
    { id: 7, costume: 'Cazador de Hombres Lobo', name: 'David Ramírez', votes: 0 },
    { id: 8, costume: 'Fantasma de la Ópera', name: 'Sofía González', votes: 0 },
    { id: 9, costume: 'Faraón Momia', name: 'Daniel Rodríguez', votes: 0 }
  ]);
  //const [candidates, setCandidates] = useState([]);
  const [isIncognito, setIncognito] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(0)
  const [userID, setUserID] = useState(null);
  const [vote, setVote] = useState(0)

  const apiURL = "http://localhost:8080/api/"

  useEffect(() => {
    fetch(apiURL + "users")
      .then(response => {
        if (!response.ok) {
          //throw new Error('Error getting candidates');
        }
        return response.json();
      })
      .then(data => {
        setCandidates(data);
      })
      .catch(error => {
        console.error('error', error);
      });
  }, []);

  useEffect(() => {
    // Extract the userID from the URL path
    const pathParts = window.location.pathname.split('/');
    setUserID(Number(pathParts[pathParts.length - 1]));
  }, []);

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
      setVote(vote)
      const votedCandidate = candidates.find(candidate => candidate.id === vote);
      console.log("candidate voted 2: ", votedCandidate);
    if (votedCandidate) {
      // Set the selected candidate state
      setSelectedCandidate(votedCandidate);
      console.log("candidate voted: ", votedCandidate);
    }
    }
  },  [candidates]);

  useEffect(() => {
    async function checkIncognito() {
      const isIncognito = await detectIncognito()
      setIncognito(isIncognito.isPrivate)
    }
    checkIncognito()
  }, [])


  const handleVote = (id) => {
    localStorage.setItem('halloween-vote', JSON.stringify(id));
    setVote(id)
    // Update the candidates with the new vote count
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === id
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );
  
    // Set the updated candidates state
    setCandidates(updatedCandidates);
  
    // Find the candidate that was voted for
    const votedCandidate = updatedCandidates.find(candidate => candidate.id === id);
    if (votedCandidate) {
      // Set the selected candidate state
      setSelectedCandidate(votedCandidate);
      console.log("candidate voted: ", votedCandidate);
    }
  };


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
        <VotedCandidateCard costume={selectedCandidate.costume} />
      </Container>
      <Grid container spacing={4}>
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            name={candidate.name}
            costume={candidate.costume}
            votes={candidate.votes}
            hasVoted={vote !== 0}
            onVote={() => {
              if (candidate.id === userID) {
                alert("No podes autovotarte, tené dignidad");
              } else {
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
