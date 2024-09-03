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

<Container
      spacing={2}
      sx={{
        bgcolor: '#000000',
      }}
    >
      <Stack spacing={2}>
              <Box>
          <Accordion>
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
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell sx={{fontWeight: "bold" }}>Nombre</TableCell>
          <TableCell sx={{fontWeight: "bold" }}>Mensaje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {votes.map((row) => (
            <TableRow
              key={row.user}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.user}
              </TableCell>
              <TableCell>{row.message}</TableCell>
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




    
  );
}
