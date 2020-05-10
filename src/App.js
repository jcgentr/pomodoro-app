import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import logo from './logo.svg'
import './App.css'

import CountdownTimerSocketIO from './timer/CountdownTimerSocketIO'
import TimerOptions from './timer/TimerOptions'
import CountdownTimer from './timer/CountdownTimer'

const SOCKETIO_ENDPOINT = process.env.NODE_ENV === "development" ? 
"http://127.0.0.1:5000" : "https://protected-falls-94459.herokuapp.com/"
const socket = socketIOClient(SOCKETIO_ENDPOINT)

const App = () => {
  const [workTime, setWorkTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [isSocketAlive, setIsSocketAlive] = useState(false)

  useEffect(() => {
    console.log(SOCKETIO_ENDPOINT)
    socket.on('connect', () => {
      setIsSocketAlive(true)
    })
    socket.on('disconnect', () => {
      setIsSocketAlive(false)
    })
  }, [])

  const handleClick = (wt, bt) => {
    if(wt >= 5 && wt <= 60) setWorkTime(wt)
    if(bt >= 1 && bt <= 25) setBreakTime(bt)
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <TimerOptions
          workTime={workTime} 
          breakTime={breakTime} 
          onClick={(wt, bt) => handleClick(wt, bt)}  
        />
        {isSocketAlive ? 
          (<CountdownTimerSocketIO 
            socket={socket}
            workTime={workTime*60}
            breakTime={breakTime*60}
          />) : 
          (<CountdownTimer 
            workTime={workTime*60}
            breakTime={breakTime*60}
          />)}
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

export default App
