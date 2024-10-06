import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "../components/Header";
import CandidateCard from "../components/CandidateCard";
import VotedCandidateCard from "../components/VotedCandidateCard";
import Admin from "../components/Admin";

const Home = ({ passphrase, userID, isAdmin }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [vote, setVote] = useState(0);

  useEffect(() => {
    fetch(backendUrl + "/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting candidates");
        }
        return response.json();
      })
      .then((data) => {
        setCandidates(data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const vote = JSON.parse(localStorage.getItem("halloween-vote"));
    if (vote) {
      setVote(vote);
      const votedCandidate = candidates.find(
        (candidate) => candidate.id === vote
      );
      if (votedCandidate) {
        // Set the selected candidate state
        setSelectedCandidate(votedCandidate);
      }
    }
  }, [candidates]);

  async function persistVote(id, message) {
    const req = {};
    req.message = message;
    req.user_costume_id = id;

    const requestOptions = {
      method: "POST",
      headers: {
        User: passphrase,
      },
      body: JSON.stringify(req),
    };
    try {
      const response = await fetch(backendUrl + "/votes", requestOptions);
      if (!response.ok) {
        // If response status is not OK, throw an error
        const errorMessage = await response.text(); // Get error message from response
        throw new Error(errorMessage);
      }
      JSON.parse(localStorage.setItem("halloween-vote", id));
    } catch (e) {
      // Check if the error message contains "has already voted"
      if (e.message.includes("has already voted")) {
        console.log("The user has already voted.");
        // Optionally, you can show a user-friendly message in the UI
        alert("You have already voted.");
      } else {
        console.error("Error:", e.message);
      }
    }
  }

  const handleVote = (id, comment) => {
    if (id === userID) {
      alert("No podes autovotarte, tené dignidad");
      return;
    }
    localStorage.setItem("halloween-vote", JSON.stringify(id));
    setVote(id);

    // Find the candidate that was voted for
    const votedCandidate = candidates.find((candidate) => candidate.id === id);
    if (votedCandidate) {
      // Set the selected candidate state
      setSelectedCandidate(votedCandidate);
      persistVote(id, comment);
    }
  };

  return (
    <Container>
      <Header />
      <Container>
        <VotedCandidateCard costume={selectedCandidate.costume} />
      </Container>
      <Grid container spacing={4} sx={{ marginBottom: "1rem" }}>
        {candidates.map((candidate, index) => (
          <Grid item xs={12} md={6} lg={4}>
            <CandidateCard
              key={candidate.id}
              index={index % 4}
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
      {isAdmin ? <Admin totalCandidates={candidates.length}/> : ""}
    </Container>
  );
};

export default Home;
