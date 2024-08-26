import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ColorButton = styled(Button)(({ theme }) => ({
    color: "#cfb8d3",
    backgroundColor: "#61146f",
    '&:hover': {
        backgroundColor: "#571263",
    },
    '&:disabled': {
        backgroundColor: "rgba(169,169,169,0.4)",
        color: "rgba(0,0,0,0.3)",
    },
}));

export default function HalloweenButton(inputProps) {
    return <ColorButton {...inputProps} variant="contained">{inputProps.children}</ColorButton>
}
