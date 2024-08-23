import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import CandidateCard from '../components/CandidateCard';
import VotedCandidateCard from '../components/VotedCandidateCard';
import { detectIncognito } from "detectincognitojs";

const Home = () => {
  const [vote, setVote] = useState(0);
  const [isIncognito, setIncognito] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Initialize as null
  const [candidates, setCandidates] = useState([]);
  /*
  const [user, setUser] = useState(null);

  useEffect(() => {
    const requestLogInOptions = {
      method: 'GET',
      headers: {
        'password': 'maga9756',
      },
    };

    fetch('http://localhost:8080/api/users/login', requestLogInOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error getting user');
        }
        return response.json();
      })
      .then(data => {
        setUser(JSON.stringify(data))
        console.log("user:", data); // Log the actual data
      })
      .catch(error => {
        console.error('error', error);
      });
  }, []);
  */

  const hardcodedUser = {
    id: 1,
    is_admin: true,
    has_voted: false,
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set the hardcoded user in the state
    setUser(hardcodedUser);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error getting candidates');
        }
        return response.json();
      })
      .then(data => {
        setCandidates(data);
        console.log("candidates:", data); // Log the actual data
      })
      .catch(error => {
        console.error('error', error);
      });
  }, []);

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem('halloween-vote'));
    if (vote) {
      const selected = candidates.find(candidate => candidate.id === Number(vote));
      setSelectedCandidate(selected || null); // Ensure a valid candidate or null
      setVote(vote);
    }
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('halloween-vote', JSON.stringify(vote));
  }, [vote]);


  useEffect(() => {
    async function checkIncognito() {
      const isIncognito = await detectIncognito();
      setIncognito(isIncognito.isPrivate);
    }
    checkIncognito();
  }, []);

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
    setVote(id);
  }

  if (isIncognito) {
    document.body.style = 'background-color:#2f2c36;';
    return (
      <div className="shall-not-pass">
        <img src={require('../assets/not-pass.gif')} alt="you can't pass" />
      </div>
    );
  }

  return (
    <Container>
      <Header />
      <Container>
        {selectedCandidate ? (
          <VotedCandidateCard costume={selectedCandidate.costume} />
        ) : (
          <p>No candidate selected</p>
        )}
      </Container>
      <Grid container spacing={4}>
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate.id}
            name={candidate.name}
            costume={candidate.costume}
            hasVoted={candidate.has_voted}
            onVote={() => {
              if (candidate.id === user.id) {
                alert("No podes autovotarte, tené dignidad");
              } else {
                handleUserVote(candidate.id);
                handleVote(candidate.id);
              }
            }}
            disableVoteButton={candidate.id === user.id} // Disable the button if userId matches candidate.id
          />
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
