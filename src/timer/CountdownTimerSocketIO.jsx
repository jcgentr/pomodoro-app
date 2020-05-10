import React, { useState, useEffect } from 'react'
import moment from "moment"
import marblesSound from './marbles.wav'

const CountdownTimer = ({workTime, breakTime, socket}) => {
    // workTime and breakTime are passed in as seconds
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [hasBeenStarted, setHasBeenStarted] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [isStopped, setIsStopped] = useState(true)
    const [dateTime, setDateTime] = useState(null)
    const [prevDateTime, setPrevDateTime] = useState(null)

    useEffect(() => {
        socket.on("FromAPI", newDate => {
          setDateTime(new Date(newDate))
        })
        // eslint-disable-next-line
      }, [])
      
    useEffect(() => {
        if(!hasBeenStarted && isWorking) setTimeRemaining(workTime)
        else if(!hasBeenStarted && !isWorking) setTimeRemaining(breakTime)
    }, [workTime, hasBeenStarted, isWorking, breakTime])

    useEffect(() => {
        if(hasBeenStarted && !isStopped) {
            const diff = Math.abs(dateTime - prevDateTime) / 1000
            setTimeRemaining(prev => {
                if ((prev - diff) <= 0) return 0
                else return prev - diff
            })
        }
        setPrevDateTime(new Date(dateTime))
        // eslint-disable-next-line
    }, [dateTime])

    useEffect(() => {
        if(timeRemaining === 0) {
            socket.emit('pomodoroCompleted', isWorking ? "work" : "break")
            handleStop()
        }
        // eslint-disable-next-line
    }, [timeRemaining])

    const handleStart = () => {
        if(timeRemaining > 0 && isStopped) {
            setPrevDateTime(dateTime)
            setHasBeenStarted(true)
            setIsStopped(false)
        }
    }

    const handleStop = () => {
        setIsStopped(true)
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
            <h4>{moment(dateTime).format('MMMM Do YYYY, h:mm a')}</h4>
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
            {(timeRemaining <= 0) ?
                (<audio autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>) :
                (<audio muted autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>)
            }
        </div>
    )
}

export default CountdownTimer