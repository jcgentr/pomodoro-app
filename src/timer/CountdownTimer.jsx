import React, { useState, useEffect } from 'react'
import marblesSound from './marbles.wav'

const CountdownTimer = ({workTime, breakTime}) => {
    const audioElement = new Audio(marblesSound)
    // audioElement.play()

    // workTime and breakTime are passed in as seconds
    const [countdownInterval, setCountdownInterval] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [hasBeenStarted, setHasBeenStarted] = useState(false)
    const [isWorking, setIsWorking] = useState(false)

    useEffect(() => {
        if(!hasBeenStarted && isWorking) setTimeRemaining(workTime)
        else if(!hasBeenStarted && !isWorking) setTimeRemaining(breakTime)
    }, [workTime, hasBeenStarted, isWorking, breakTime])

    useEffect(() => {
        if(timeRemaining === 0) {
            audioElement.play()
            handleStop()
        }
    }, [timeRemaining])

    const tick = () => {
        setTimeRemaining(prevTime => prevTime === 0 ? 0 : prevTime - 1)
    }

    const handleStart = () => {
        if(timeRemaining > 0) {
            setCountdownInterval(setInterval(tick, 1000))
            setHasBeenStarted(true) 
        }
    }

    const handleStop = () => {
        setCountdownInterval(clearInterval(countdownInterval))      
    }

    const handleReset = () => {
        handleStop()
        setHasBeenStarted(false)
    }

    const handleToggle = (e) => {
        e.target.checked ? setTimeRemaining(workTime) : setTimeRemaining(breakTime)
        handleReset()
        setIsWorking(!isWorking)
    }

    const minutesLeft = Math.floor(timeRemaining / 60)
    const secondsLeft = Math.round(timeRemaining % 60)

    return (
        <div>
            <button onClick={() => handleStart()}>Start</button>
            <button onClick={() => handleStop()}>Stop</button>
            <button onClick={() => handleReset()}>Reset</button>
            <h3>Time left: {minutesLeft} : {secondsLeft}</h3>
            Break
            <label className="switch">
                <input type="checkbox" onChange={(e) => handleToggle(e)}/>
                <span className="slider round"></span>
            </label>
            Work
        </div>
    )
}

export default CountdownTimer