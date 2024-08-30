import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HalloweenButton from './base/HalloweenButton';

export default function CandidateCardModal({ openModal, setOpenModal, submitVote, costume }) {

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            submitVote(formJson.comment)
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{backgroundColor: 'black',color:'orange'}}>Votar a {costume}</DialogTitle>
        <DialogContent sx={{backgroundColor: 'black'}}>
          <TextField
            autoFocus
            multiline
            margin="dense"
            id="comment"
            name="comment"
            label="Comentario [Opcional]"
            fullWidth
            variant="standard"
            color="warning"
            InputLabelProps={{
              style: { color: 'orange' },
            }}
            inputProps={{ style: { color: "#cfb8d3" } }}

          />
        </DialogContent>
        <DialogActions sx={{backgroundColor: 'black'}}>
          <HalloweenButton type="submit">Votar</HalloweenButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
