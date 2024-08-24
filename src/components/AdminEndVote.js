import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function AdminEndVote({openEndVoteModal, setOpenEndVoteModal, endVote}) {
    const handleClose = () => {
        setOpenEndVoteModal(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={openEndVoteModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Cerrar Votación?
                </DialogTitle>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={endVote} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
