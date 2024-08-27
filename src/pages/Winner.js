import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


import Admin from '../components/Admin';
import WinnerPodium from '../components/WinnerPodium';

function Winner({isAdmin, voteFinished}) {
    const { width, height } = useWindowSize()
    const [winners, setWinners] = useState([{ "costume": "control remoto", "name": "pa", "votes_count": 3, "data": [{ "user": "guchi", "message": "good" }, { "user": "tute", "message": "good" }] }, { "costume": "panda", "name": "maga", "votes_count": 2, "data": [{ "user": "ma", "message": "good" }] }, { "costume": "panda grande", "name": "guchi", "votes_count": 1, "data": [{ "user": "maga" }] }]);

    async function getWinners() {
        try {
            const win = await (await fetch('http://localhost:8080/api/results/winners')).json()
            setWinners(win)
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => getWinners, []);



    return (
        <div className="App">
            <h1 style={{ fontFamily: 'Nightmare', color: 'white', fontSize: "4rem", textAlign: 'center', margin: "1rem" }}>
                Ganadores
            </h1>
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
                    colors={["#ec661e","#ff9033","#61146f","#c1405a","#ab1d4f"]}
                />
            </div>
            {isAdmin ? <Admin voteFinished={voteFinished}/> : ""} 
        </div>
    );
}

export default Winner;

