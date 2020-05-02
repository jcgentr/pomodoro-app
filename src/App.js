import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import CountdownTimer from './timer/CountdownTimer'
import TimerOptions from './timer/TimerOptions'

const App = () => {
  const [workTime, setWorkTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)

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
        <CountdownTimer 
          workTime={workTime*60}
          breakTime={breakTime*60}
        />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

export default App
