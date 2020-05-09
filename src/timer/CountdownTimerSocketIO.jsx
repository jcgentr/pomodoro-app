import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import moment from "moment"
import marblesSound from './marbles.wav'

const ENDPOINT = "http://127.0.0.1:5000"

const CountdownTimer = ({workTime, breakTime}) => {
    // workTime and breakTime are passed in as seconds
    const [timeRemaining, setTimeRemaining] = useState(null)
    const [hasBeenStarted, setHasBeenStarted] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [isStopped, setIsStopped] = useState(true)
    const [dateTime, setDateTime] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'))

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)
        socket.on("FromAPI", data => {
          setDateTime(moment(data).format('MMMM Do YYYY, h:mm:ss a'))
        })
        // eslint-disable-next-line
      }, [])
      
    useEffect(() => {
        if(!hasBeenStarted && isWorking) setTimeRemaining(workTime)
        else if(!hasBeenStarted && !isWorking) setTimeRemaining(breakTime)
    }, [workTime, hasBeenStarted, isWorking, breakTime])

    useEffect(() => {
        if(hasBeenStarted && !isStopped) setTimeRemaining(prev => prev - 1)
        // eslint-disable-next-line
    }, [dateTime])

    useEffect(() => {
        if(timeRemaining === 0) {
            handleStop()
        }
        // eslint-disable-next-line
    }, [timeRemaining])

    const handleStart = () => {
        if(timeRemaining > 0 && isStopped) {
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
            <h4>{dateTime}</h4>
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
                (<audio id="audio" autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>) :
                (<audio id="audio" muted autoPlay loop> <source src={marblesSound} type="audio/wav" /> </audio>)
            }
        </div>
    )
}

export default CountdownTimer