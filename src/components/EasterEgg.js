import * as React from 'react';
import Dialog from '@mui/material/Dialog';

function EasterEgg({open, setOpen}) {
  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <img src={require('../assets/paraaa.gif')} alt="you can't pass" />
      </Dialog>
    </div>
  );
}

export default EasterEgg;
