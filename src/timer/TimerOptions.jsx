import React from 'react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

const TimerOptions = ({onClick, workTime, breakTime}) => {
    
    return (
        <div>
            <h5>Select Break Time: {breakTime} minutes 
                <button onClick={() => onClick(workTime, breakTime+1)}><FaArrowUp /></button>
                <button onClick={() => onClick(workTime, breakTime-1)}><FaArrowDown /></button>
            </h5>
            <h5>Select Work Time: {workTime} minutes 
                <button onClick={() => onClick(workTime+1, breakTime)}><FaArrowUp /></button>
                <button onClick={() => onClick(workTime-1, breakTime)}><FaArrowDown /></button>
            </h5>
        </div>    
    )
}

export default TimerOptions