import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
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


useEffect(() => {
  loadVotes()
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
  }
  }
  
  return (
    votes.length>0 ?
<Container
      spacing={2}
    >
      <Stack spacing={2}>
              <Box>
          <Accordion  
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
    : <Container></Container>
  );
}
