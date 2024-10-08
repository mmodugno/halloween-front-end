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
  const [selectedCandidates, setSelectedCandidates] = useState([]);

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
      .catch((error) => { });
  }, []);

  useEffect(() => {
    const votes = JSON.parse(localStorage.getItem("halloween-votes")) || [];
    if (votes.length !== 0) {

      // Find all voted candidates based on the votes array
      const votedCandidates = candidates.filter(candidate =>
        votes.includes(candidate.id)
      );

      // Set the selected candidate state
      if (votedCandidates.length > 0) {
        setSelectedCandidates(votedCandidates); // Assuming you have a state for multiple selected candidates
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
    // Retrieve existing votes from localStorage and save the updated array
    let votes = JSON.parse(localStorage.getItem("halloween-votes")) || [];

    if (!votes.includes(id)) {
      votes.push(id);
      localStorage.setItem("halloween-votes", JSON.stringify(votes));
    }

    // Find the candidate that was voted for
    const votedCandidate = candidates.find((candidate) => candidate.id === id);
    if (votedCandidate) {
      setSelectedCandidates((prevSelected) => [
        ...prevSelected,
        votedCandidate,
      ]);

      persistVote(id, comment);
    }
  };

  return (
    <Container>
      <Header />
      <Container>
        {selectedCandidates.map((candidate, index) => (
          <VotedCandidateCard key={index} costume={candidate.costume} />
        ))}
      </Container>
      <Grid container spacing={4} sx={{ marginBottom: "1rem" }}>
        {candidates.map((candidate, index) => {
          // Retrieve existing votes from localStorage
          const votes = JSON.parse(localStorage.getItem("halloween-votes")) || [];

          return (
            <Grid item xs={12} md={6} lg={4} key={candidate.id}>
              <CandidateCard
                index={index % 4}
                candidateId={candidate.id}
                name={candidate.name}
                costume={candidate.costume}
                votes={candidate.votes}
                hasVoted={selectedCandidates.length === 2}
                onVote={handleVote}
                disableVoteButton={candidate.id === userID || votes.includes(candidate.id)} // Disable the button if userId matches candidate.id
              />
            </Grid>
          );
        })}
      </Grid>
      {isAdmin ? <Admin totalCandidates={candidates.length} /> : ""}
    </Container>
  );
};

export default Home;
