import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';
import Admin from '../components/Admin';

const Home = ({passphrase, userID, isAdmin}) => {

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
  const [selectedCandidate, setSelectedCandidate] = useState(0)
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
      });
  }, []);

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
      setVote(vote)
      const votedCandidate = candidates.find(candidate => candidate.id === vote);
      if (votedCandidate) {
        // Set the selected candidate state
        setSelectedCandidate(votedCandidate);
        console.log("candidate voted: ", votedCandidate);
      }
    }
  }, [candidates]);

  async function persistVote(id, message) {
    const req = {}
    req.message = message
    req.user_costume_id = id

    const requestOptions = {
      method: 'POST',
      headers: {
        'User': passphrase,
      },
      body: JSON.stringify(req)
    };
    try {
      await (await fetch(apiURL + "votes", requestOptions)).json()
      return
    }
    catch (e) {
      console.log(e);
    }
  }

  const handleVote = (id, comment) => {
    if (id === userID) {
      alert("No podes autovotarte, tené dignidad");
      return;
    }
    localStorage.setItem('halloween-vote', JSON.stringify(id));
    setVote(id)

    // Find the candidate that was voted for
    const votedCandidate = candidates.find(candidate => candidate.id === id);
    if (votedCandidate) {
      // Set the selected candidate state
      setSelectedCandidate(votedCandidate);
      persistVote(id, comment)
      alert(`votaste a ${id} ${comment}`)
    }
  };

  return (
    <Container>
      <Header />
      <Container>
        <VotedCandidateCard costume={selectedCandidate.costume} />
      </Container>
      <Grid container spacing={4} sx={{marginBottom: "1rem"}}>
        {candidates.map(candidate => (
          <Grid item xs={12} md={6} lg={4}>
            <CandidateCard
              key={candidate.id}
              candidateId={candidate.id}
              name={candidate.name}
              costume={candidate.costume}
              votes={candidate.votes}
              hasVoted={vote !== 0}
              onVote={handleVote}
              disableVoteButton={candidate.id === userID} // Disable the button if userId matches candidate.id
            />
          </Grid>
        ))}
      </Grid>
      {isAdmin ? <Admin /> : ""} 
    </Container>
  );
};

export default Home;
