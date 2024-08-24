import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


import WinnerPodium from '../components/WinnerPodium';

function Winner() {
    const { width, height } = useWindowSize()
    const [winners,setWinners] = useState([]);

    async function getWinners() {
        try{
            const win = await (await fetch('http://localhost:8080/api/results/winners')).json()
            setWinners(win)
        }
        catch (e){
            console.log(e)
        }
    }
    useEffect(() => getWinners, []);

    

    return (
        <div className="App">
            <h2 className="font-serif text-2xl text-center text-gray-800 w-full border-b p-3">
                Ganadores
            </h2>
            <div className="container relative mx-auto max-w-screen-sm pb-8">
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={0}
                >
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <WinnerPodium winners={winners.sort((a, b) => b.votes_count - a.votes_count)} />
                    </div>
                </Stack>
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={300}
                />
            </div>
        </div>
    );
}

export default Winner;

