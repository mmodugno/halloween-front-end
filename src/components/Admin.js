import React, { useState } from 'react';
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import AdminEndVote from './AdminEndVote'
import AdminVotes from './AdminVotes'


const Admin = () => {
  const [openEndVoteModal, setOpenEndVoteModal] = useState(false);
  const [voteEnded, setVoteEnded] = useState(false)

  const endVote = async () => {
    const requestOptions = {
      method: 'PUT'
    };
    try {
      await (await fetch(apiURL + "finish", requestOptions)).json()
      setVoteEnded(true)
    }
    catch (e) {
      console.log(e);
    }
    setOpenEndVoteModal(false)
  }

  const apiURL = "http://localhost:8080/api/"

  return (
    <Container
      spacing={2}
      sx={{
        bgcolor: '#000000',
      }}
    >
      <Stack spacing={2}>
      {!voteEnded ? <Box>
          <Button onClick={() => setOpenEndVoteModal(true)} variant="contained" size="large" color="error">
            Finalizar Votación
          </Button>
        </Box>
         : ""} 

        <Box>
          <Accordion defaultExpanded={!voteEnded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Votos
            </AccordionSummary>
            <AccordionDetails>
              <AdminVotes />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
      <AdminEndVote openEndVoteModal={openEndVoteModal} setOpenEndVoteModal={setOpenEndVoteModal} endVote={endVote} />
    </Container>
  );
};

export default Admin;
