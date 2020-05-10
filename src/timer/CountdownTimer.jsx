import React, { useState, useEffect, useRef } from 'react'
import marblesSound from './marbles.wav'

const CountdownTimer = ({workTime, breakTime}) => {
    // workTime and breakTime are passed in as seconds
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [hasBeenStarted, setHasBeenStarted] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [isStopped, setIsStopped] = useState(true)
    const [startDateTime, setStartDateTime] = useState(null)
    const [delay, setDelay] = useState(null)

    useInterval(() => {
        const now = new Date()
        const currentTimeElapsed = Math.floor((now - startDateTime)/1000) + timeElapsed
    
        if (isWorking) {
            const time = workTime - currentTimeElapsed
            setTimeRemaining(time <= 0 ? 0 : time)
        } else {
            const time = breakTime - currentTimeElapsed
            setTimeRemaining(time <= 0 ? 0 : time)
        }
    }, delay)

    useEffect(() => {
        return () => {
            //cleanup fxn when unmounting this component
        }
    }, [])

    useEffect(() => {
       handleReset()
       // eslint-disable-next-line
    }, [workTime, breakTime])

    useEffect(() => {
        if(!hasBeenStarted && isWorking) setTimeRemaining(workTime)
        else if(!hasBeenStarted && !isWorking) setTimeRemaining(breakTime)
    }, [workTime, hasBeenStarted, isWorking, breakTime])

    useEffect(() => {
        if(timeRemaining === 0) {
            handleStop()
        }
        // eslint-disable-next-line
    }, [timeRemaining])

    const handleStart = () => {
        if(timeRemaining > 0 && isStopped) {
            setStartDateTime(new Date())
            setDelay(1000)
            setHasBeenStarted(true)
            setIsStopped(false)
        }
    }

    const handleStop = () => {
        setIsStopped(true)
        // timeElapsed snapshot
        if (isWorking) setTimeElapsed(workTime - timeRemaining)
        else setTimeElapsed(breakTime - timeRemaining)
        // stop interval
        setDelay(null)
    }

    const handleReset = () => {
        handleStop()
        setTimeElapsed(0)
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
            {(timeRemaining === 0) ?
                (<audio autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>) :
                (<audio muted autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>)
            }
        </div>
    )
}

export default CountdownTimer

// from Dan Abramov @ https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef(null)
  
    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current()
      }
      if (delay !== null) {
        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    }, [delay])
  }