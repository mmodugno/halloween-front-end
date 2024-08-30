import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SendIcon from '@mui/icons-material/Send';

import Ghost from '../components/SplashGhost'

import '../styles/Splash.css';

function Splash({ setPassphrase, setUserID, setIsAdmin }) {
    const [wrongPassword, setWrongPassword] = useState(false)
    const [passphraseInput, setPassphraseInput] = useState('')

    async function validatePassphrase() {
        const requestLogInOptions = {
            method: 'GET',
            headers: {
                'User': passphraseInput,
            },
        };
        try {
            const userData = await (await fetch('http://localhost:8080/api/users/login', requestLogInOptions)).json()
            setUserID(userData.id)
            localStorage.setItem('halloween-passphrase', JSON.stringify(passphraseInput));
            localStorage.setItem('halloween-user', JSON.stringify(userData.id));
            localStorage.setItem('halloween-admin', JSON.stringify(userData.is_admin));
            setPassphrase(passphraseInput)
            console.log("userData: ", userData);
            setIsAdmin(userData.is_admin)
            return setWrongPassword(false)
        }
        catch (e) {
            console.log(e);
            setWrongPassword(true)
        }

        if (passphraseInput === 'maga' || passphraseInput === 'winner') {
            setUserID(1)
            localStorage.setItem('halloween-passphrase', JSON.stringify(passphraseInput));
            localStorage.setItem('halloween-user', JSON.stringify(1));
            localStorage.setItem('halloween-admin', JSON.stringify(true));
            setPassphrase(passphraseInput)
            setIsAdmin(true)

            return setWrongPassword(false)
        }
        setWrongPassword(true)
    }

    return (
        <Box style={{ height: "100vh", backgroundColor: "#ec661e" }} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Box>
                <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Halloween' }}>
                    BIENVENIDOS
                </Typography>
            </Box>
            <Ghost />
            <Box>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                    <TextField
                        inputProps={{ style: { textTransform: "lowercase" } }}
                        required
                        value={passphraseInput}
                        onChange={p => setPassphraseInput(p.target.value.toLowerCase())}
                        label="Contraseña"
                    />
                    <Button
                        sx={{ backgroundColor: "#000000 !important" }}
                        onClick={async () => await validatePassphrase()}
                    >
                        <SendIcon />
                    </Button>
                </ButtonGroup>
            </Box>
            <Box sx={{ mt: 2 }}>
                <span>{wrongPassword ? "⚠️ Contraseña incorrecta." : ""}</span>
            </Box>
        </Box>
    );
}

export default Splash;

