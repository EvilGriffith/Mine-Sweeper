import { useLocation } from "react-router-dom"
import "../css/main.css"
import "../css/room.css"
import { Board } from "../classes/Board"
import { useEffect, useRef, useState } from "react"
import opencell from "../assets/opencell.png"
import closecell from "../assets/closecell.png"
import f from "../assets/flag.png"
import bombanimation from "../assets/bomb.webp"
import explor from "../assets/explore.mp3"

export default function Room() {
    const [width,cof] = useLocation().state
    const init = new Board()
    const [b, bbs,t] = init.createBoard(width,cof)
    const screenwidth = window.innerWidth



    const [board,setboard] = useState(b)
    const [time,setTime] = useState(t)
    const [minutes,setminutes] = useState(0)
    const [seconds,setseconds] = useState(0)
    const [bombs,setbombs] = useState(bbs)
    const [explore,setexplore] = useState(false)
    const [exid,setexid] = useState(0)
    const [gameover,setgameover] = useState(1)
    const audioRef = useRef(null)
    const pressTimer = useRef(null)
    const longPress = useRef(false)


    useEffect(() => {
        setminutes(Math.floor(time / 60))
        setseconds(time % 60)
    },[time])

    useEffect(() => {
    if (gameover !== 1) return;
    const timer = setInterval(() => {
        setTime(prev => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
    }, [gameover]);

    useEffect(() => {
    if (time === 0 && gameover === 1) {
    lose();
    }
}, [time, gameover]);

    const restart = () => {
        const init = new Board()
        const [b, bbs] = init.createBoard(width,cof)
        setTime(t)
        setboard(b)
        setbombs(bbs)
        setexplore(false)
        setexid(0)
        setgameover(1)
        const audio = audioRef.current
        audio.pause()
        audio.currentTime = 0
    }
    const lose = () => {
        const audio = audioRef.current
        audio.currentTime = 0
        audio.play().catch(error => {
            console.log(error)
        })
        setexid(exid+1)
        setexplore(true)
        setgameover(0)
    }

    const cellCLick = (isclose,bombis,flag,index) => {
        if (!isclose || flag || gameover == 0 || gameover == 2) return;
        if(bombis){
            lose()
        }

        const copyboard = board.map(cell => ({ ...cell }));

        const queue = [index];
        const visited = new Set();

        while (queue.length > 0) {
            const current = queue.shift();

            if (visited.has(current)) continue;
            visited.add(current);

            const cell = copyboard[current];

            if (!cell || cell.bombis) continue;

            // Открываем клетку
            cell.isclose = false;

            // Если вокруг есть цифра — дальше не распространяемся
            if (Number(cell.around) > 0) continue;

            // Определяем координаты клетки
            const row = Math.floor(current / width);
            const col = current % width;

            // Проверяем 8 соседних клеток
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {

                    if (x === 0 && y === 0) continue;

                    const newRow = row + y;
                    const newCol = col + x;

                    // Проверяем границы поля
                    if (
                        newRow < 0 ||
                        newCol < 0 ||
                        newRow >= width ||
                        newCol >= width
                    ) continue;

                    const neighborIndex = newRow * width + newCol;

                    if (!visited.has(neighborIndex)) {
                        queue.push(neighborIndex);
                    }
                }
            }
        }

        setboard(copyboard);
    }

    const checkbombs = (newboard, newbombs) => {
        if(newbombs === 0){
            for(let i = 0; i < newboard.length; i++){
                if(newboard[i].bombis === true && newboard[i].flag === false){
                    lose()
                    return
                }
            }

            setgameover(2)
        }
    }

    const stayflag = (i) => {
        if(gameover == 1){
            const copyboard = board.map(cell => ({ ...cell }))
            if(copyboard[i].isclose == true && bombs > 0){
                copyboard[i].flag = true
                const copybombs = bombs - 1
                setbombs(copybombs)
                setboard(copyboard)
                checkbombs(copyboard,copybombs)
            }
            
            
        }
    }

    return(
        <div className="back">
            <div className="boardwin">
                <div className="board" style={{"--board-size": width}}>
                    <audio ref={audioRef} src={explor} preload="auto"/>
                    {
                        board.map(({isclose,bombis,around,flag},i) => {
                            return(
                                <div className="cell" style={{
                                    backgroundImage: `url(${explore && bombis ? `${bombanimation}?t=${Date.now()}` : flag ? f : isclose ? closecell : opencell})`}} 
                                    
                                    onPointerDown={(e) => {
                                        e.preventDefault()
                                        longPress.current = false
                                        pressTimer.current = setTimeout(() => {
                                            longPress.current = true
                                            stayflag(i)
                                        },300)
                                    }}

                                    onPointerUp={() => {
                                        clearTimeout(pressTimer.current)
                                    }}

                                    onPointerLeave={() => {
                                        clearTimeout(pressTimer.current)
                                    }}

                                    onPointerCancel={() => {
                                        clearTimeout(pressTimer.current)
                                    }}

                                    onContextMenu={(e) => {e.preventDefault(); stayflag(i)}}

                                    onClick={() => {
                                        if(longPress.current){
                                            longPress.current = false
                                            return
                                        }
                                        cellCLick(isclose,bombis,flag,i)
                                    }} 

                                    >{
                                    !isclose && <div style={{
                                        fontSize: 
                                        screenwidth > 500 ? 
                                        width == 16 ? "30px":
                                        width == 32 ? "15px":
                                        width == 40 ? "17px" : "10px":
                                        width == 16 ? "21px":
                                        width == 32 ? "10px":
                                        width == 40 ? "8px" : "10px",
                                        color: 
                                        around == 1 ? "blue":
                                        around == 2 ? "green":
                                        around == 3 ? "red":
                                        around == 4 ? "violet":
                                        around == 5 ? "brown" : "brown"
                                    }}>{around}</div>
                                }</div>
                            )
                        })
                    }
                </div>
                <div className="infowin">
                    <div className="bombs">Bombs left: {bombs}</div>
                    <div className="boardwid">{width + "x " + width}</div>
                    <div className="time">Time: <div style={{
                        color: 
                        time > 10 ? "white" : "red",
                        marginLeft: '4px'
                    }}>{minutes}:{seconds < 10 ? "0" + seconds : seconds}</div></div>
                    <div className="gameover">{gameover == 0 ? "Game Over" : gameover == 1 ?"Game Continue" : gameover == 2 ? "Game Win" : "Game Win"}</div>
                    <div className="restart" onClick={restart}>Restart</div>
                </div>
            </div>
        </div>
    )
}