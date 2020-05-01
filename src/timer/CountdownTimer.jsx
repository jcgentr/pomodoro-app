import React, { useState, useEffect } from 'react'

const CountdownTimer = ({workTime}) => {
    const [countdownInterval, setCountdownInterval] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [hasBeenStarted, setHasBeenStarted] = useState(false)

    useEffect(() => {
        if(!hasBeenStarted) setTimeRemaining(workTime*60)
    }, [workTime, hasBeenStarted])

    const tick = () => {
        setTimeRemaining(prevTime => prevTime - 1)
    }

    const handleStart = () => {
        setCountdownInterval(setInterval(tick, 1000))
        setHasBeenStarted(true) 
    }

    const handleStop = () => {
        setCountdownInterval(clearInterval(countdownInterval))      
    }

    const handleReset = () => {
        handleStop()
        setHasBeenStarted(false)
    }
    return (
        <div>
            <button onClick={() => handleStart()}>Start</button>
            <button onClick={() => handleStop()}>Stop</button>
            <button onClick={() => handleReset()}>Reset</button>
            <h3>Time left: {timeRemaining} seconds</h3>
        </div>
    )
}

export default CountdownTimer