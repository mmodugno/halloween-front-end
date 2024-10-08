import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";


export default function CandidateVotes() {
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const userID = JSON.parse(localStorage.getItem('halloween-user'));
const [votes, setVotes] = useState([])
const [phrase, setPhrase] = useState("")


useEffect(() => {
  loadVotes()
}, []);

useEffect(() => {
  setPhrase(pickPhrase());  
}, []);


async function loadVotes() {
  try {
      const res = await (await fetch(backendUrl + "/results/" + userID)).json()
      setVotes(res)
      console.log(res);
      return
  }
  catch (e) {
      console.log(e);
      setVotes([])
  }
  }

  function pickPhrase() {
    const phrases = [
      "Tranqui! Capaz no te votaron porque todavía están tratando de entender qué sos...",
      "Bueno che, parece que te disfrazaste del hombre invisible.",
      "Que la sigan chupando viejo.",
      "Te juro que ni se dieron cuenta que estabas disfrazado.",
      "¿Estabas disfrazado de fantasma o qué?",
      "Capaz que te confundieron con la decoración...",
      "No te votó ni tu mamá, che.",
      "Capaz tu disfraz es tan avanzado que los demás no están listos para entenderlo.",
      "Capaz la gente tiene mal gusto, pero el tuyo es peor.",
      "Bueno, ya sabes de qué NO disfrazarte la próxima fiesta."
    ];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }
  
  return (
    (votes | votes.length>0) ?
<Container
      spacing={2}
    >
      <Stack spacing={2}>
        <Box>
        <h4
        style={{ color: 'white', fontSize: "1.5rem", textAlign: 'center', margin: "1rem" }}
      >
        Tus votos: {votes.length}
      </h4>
        </Box>
              <Box>
          <Accordion  defaultExpanded={true}
          sx={{
            bgcolor: '#ee9362',
          }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Ver Mensajes
            </AccordionSummary>
            <AccordionDetails>
            <TableContainer 
    component={Paper}
    >
      <Table sx={{ minWidth: 350, bgcolor: "#eeb79a"}} aria-label="simple table">
        <TableBody> 
          {votes
          .filter((row) => row.message && row.message.trim() !== "")
          .map((row) => (
            <TableRow
              key={row.user}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{
              borderBottom: "1px solid #ee9362", 
            }}
            >{row.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
    </Container>
    : <Container>
        <Box>
      <h4
        style={{ color: 'white', fontSize: "1.5rem", textAlign: 'center', margin: "1rem" }}
      >
        No tenés votos 😢
      </h4>
      </Box>
      <Box >
        <p style={{ color: 'white', fontSize: "1rem", textAlign: 'center', margin: "1rem" }}>
        {
          pickPhrase()
        }
        </p>
        
      </Box>
    </Container>
  );
}
