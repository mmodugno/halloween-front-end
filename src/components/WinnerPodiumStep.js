import { motion } from 'framer-motion'

function WinnerPodiumStep({ winner, position }) {
  const offset = 2 - position

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        placeContent: 'center'
      }}
    >
      <motion.div
        style={{
          alignSelf: 'center',
          marginBottom: '.25rem'
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              delay: 0.1,
              duration: 0.75
            }
          },
          hidden: { opacity: 0 }
        }}
      >
        <span
          style={{
            width: '5rem',
            placeContent: 'left',
            display: 'inline-flex',
            color: "white"
          }}
        >
          {winner.name}
        </span>

      </motion.div>

      <motion.div
        style={{
          width: '4rem',
          placeContent: 'center',
          display: 'flex',
          borderTopLeftRadius: '.5rem',
          borderTopRightRadius: '.5rem',
          backgroundColor: '#ff4814',
          marginBottom: -1,
          filter: `opacity(${0.1 + winner.votes_count / 3})`
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            height: 100 + 50 * (1 + 1 / winner.position) - (winner.position - 1) * 50,
            opacity: 1/winner.position + 0.3,
            transition: {
              delay: 1 + offset,
              duration: 1.5,
              ease: 'backInOut'
            }
          },
          hidden: { opacity: 0, height: 0 }
        }}
      >
        <span style={{ color: 'white', alignSelf: 'flex-end' }}>{winner.votes_count} votos</span>
      </motion.div>
    </div>
  )
}

export default WinnerPodiumStep;
