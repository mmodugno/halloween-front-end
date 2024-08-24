import React, { useState } from 'react';
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import AdminEndVote from './AdminEndVote'
import AdminVotes from './AdminVotes'


const Admin = () => {
  const [openEndVoteModal, setOpenEndVoteModal] = useState(false);

  const endVote = async () => {
    alert('finito')
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
          <Button onClick={() => setOpenEndVoteModal(true)} variant="contained" size="large" color="error">
            Finalizar Votación
          </Button>
        </Box>
        <Box>
          <Accordion defaultExpanded>
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
            <AccordionActions>
              <Button variant="contained" endIcon={<RefreshIcon />}>Actualizar</Button>
            </AccordionActions>
          </Accordion>
        </Box>
      </Stack>
      <AdminEndVote openEndVoteModal={openEndVoteModal} setOpenEndVoteModal={setOpenEndVoteModal} endVote={endVote} />
    </Container>
  );
};

export default Admin;
