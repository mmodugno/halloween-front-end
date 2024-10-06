import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import HalloweenButton from "./base/HalloweenButton";
import { useState } from "react";

export default function CandidateCardModal({
  openModal,
  setOpenModal,
  submitVote,
  costume,
}) {
  const handleClose = () => {
    setOpenModal(false);
  };

  const [inputErr, setInputErr] = useState(false)

  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            
            if (!formJson.comment || formJson.comment.trim() === "") {
              setInputErr(true)
              return; // Prevent the form from submitting
            }
            setInputErr(false)
            submitVote(formJson.comment);
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "black", color: "orange" }}>
          Votar a {costume}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "black" }}>
          <TextField
            autoFocus
            multiline
            margin="dense"
            id="comment"
            name="comment"
            label="Dejale un mensajito"
            fullWidth
            variant="standard"
            color="warning"
            InputLabelProps={{
              style: { color: "orange" },
            }}
            inputProps={{ style: { color: "#cfb8d3" } }}
            error={inputErr}
            helperText={inputErr ? "Dejá un mensajito te dije": ""}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "black" }}>
          <HalloweenButton type="submit">Votar</HalloweenButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
