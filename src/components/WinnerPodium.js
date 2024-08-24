import WinnerPodiumStep from './WinnerPodiumStep';

function WinnerPodium({ winners }) {
    winners[0].position = 1
    for (let i = 1; i < winners.length; i++) {
        if (winners[i].votes_count === winners[i - 1].votes_count) {
            winners[i].position = winners[i - 1].position
        } else {
            winners[i].position = (winners[i - 1].position + 1)
        }
    }
    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    gridAutoFlow: 'column dense',
                    gap: '.5rem'
                }}
            >
            </div>
            <div
                style={{
                    display: 'grid',
                    gridAutoFlow: 'column dense',
                    gap: '.5rem',
                    marginTop: '2rem',
                    justifyContent: 'center',
                    justifyItems: 'center',
                    alignContent: 'flex-end',
                    alignItems: 'flex-end',
                    borderBottom: '1px solid #e5e7eb',
                    height: 250
                }}
            >
                {winners.map((winner, index) => (
                    <WinnerPodiumStep key={winner.name} winner={winner} position={winner.position} />
                ))}
            </div>
        </div>
    );
}

export default WinnerPodium;
