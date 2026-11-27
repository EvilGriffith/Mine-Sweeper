class Cell {
   constructor(isclose,bombis,around,flag){
    this.isclose = isclose
    this.bombis = bombis
    this.around = around
    this.flag = flag
   }
}
export class Board {
    createBoard(width,cof){
        let board = []
        const playercof = cof
        const S = width * width
        let bombs = Math.round(S * playercof)
        const bombtoret = bombs
        for(let i = 0; i < S; i++){
            board.push(new Cell(true,false,null,false))
        }
        while(bombs > 0){
            const i = Math.floor(Math.random() * board.length)
            if(board[i].bombis == false){
                board[i].bombis = true
                bombs -= 1
            }
        }

        // считаем сколько бомб вокруг каждой клетки =)

        const height = board.length / width
        for(let i = 0; i < board.length; i++){
            if(board[i].bombis == false){
                let bombsaroundcell = 0

                const row = Math.floor(i / width)
                const col = i % width

                for (let r = row - 1; r <= row + 1; r++) {
                    for (let c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < height && c >= 0 && c < width) {
                            const neighborIndex = r * width + c;
                            if (board[neighborIndex].bombis === true) {
                                bombsaroundcell += 1;
                            }
                        }
                    }
                }
                if(bombsaroundcell != 0){
                    board[i].around = bombsaroundcell
                }
            }
        }

        // выводим результат

        return [board,bombtoret]
    }
}