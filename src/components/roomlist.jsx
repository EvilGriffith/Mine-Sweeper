import { Link } from 'react-router-dom'
import { useState } from 'react'
import "../css/roomlist.css"
import "../css/main.css"


export default function Roomlist() {
  const [cof,setcof] = useState(0.15625)
  const [but1,setbut1] = useState("butactived")
  const [but2,setbut2] = useState("but1")
  const [but3,setbut3] = useState("but1")
  const [playerwidth,setplayerwidth] = useState(0)
  const [sebut,setsebut] = useState(false)
  const hadleClick = (numbut) => {
    if(numbut == 1){
      if(cof !== 0.15625){
        setcof(0.15625)
        setbut1("butactived")
        setbut2("but1")
        setbut3("but1")
      }
    }
    else if (numbut == 2){
      if(cof !== 0.18){
        setcof(0.18)
        setbut1("but")
        setbut2("but1actived")
        setbut3("but1")
      }
    }
    else if (numbut == 3){
      if(cof !== 0.20625){
        setcof(0.20625)
        setbut1("but")
        setbut2("but1")
        setbut3("but1actived")
      }
    }
  }
  
  return (
    <div className='back'>
      <div className='window'>
        <div className='name'>Mine Sweeper</div>
        <Link to="/room" state={[16,cof]} className='roombut'>16x 16</Link>
        <Link to="/room" state={[32,cof]} className='roombut'>32x 32</Link>
        <Link to="/room" state={[40,cof]} className='roombut'>40x 40</Link>
        <Link to="/room" state={playerwidth >= 10 ? [playerwidth,cof] : [16,cof]} className='roombut'>Custom Room</Link>
        <div className='set' onClick={() => {setsebut(true)}}/>
        <div className={sebut ? "setwindow" : "setwindowclose"}>
          <div className='setname'>Settings Custom Room <div className='exit' onClick={() => {setsebut(false)}}/></div>
          <div className='oneset'>Width: {sebut ? <input className='input' value={playerwidth} type='number' onChange={(e) => {setplayerwidth(e.target.value)}} min={10} max={40}/> : <></>}</div>
          <div className='oneset'>height: {playerwidth}</div>
        </div>
        <div className='butwindow'>
          <div className={but1} onClick={() => {hadleClick(1)}}>Easy</div>
          <div className={but2} onClick={() => {hadleClick(2)}}>Medium</div>
          <div className={but3} onClick={() => {hadleClick(3)}}>Hard</div>
        </div>
      </div>
    </div>
  )
}


