const Player = (name, state, cpu) => {
    const getName  = () => name;
    const setName = (newName) => name = newName;
    const getState = () => state;
    const changeState = () => (state === true) ? state = false : state = true;
    const isCPU = () => cpu;
    return {
        getName,
        setName,
        getState,
        changeState,
        isCPU
    };
}

const Gameboard = (function () {
    'use strict';
    const boardCtn = document.getElementById('board-ctn');
    const _board = [];
    const winCombi = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    function uniqueCountPreserve(inputArray){  //function to sort by reoccurence
        let arrayItemCounts = {};
        for (let i in inputArray){
            if (!(arrayItemCounts.hasOwnProperty(inputArray[i]))){
                arrayItemCounts[inputArray[i]] = 1
            } else {
                arrayItemCounts[inputArray[i]] += 1
            }
        }
        let keysByCount = Object.keys(arrayItemCounts).sort(function(a, b){
            return arrayItemCounts[a]-arrayItemCounts[b];
        });
    
        return(keysByCount)
    }

    const initBoard = () => {
        boardCtn.replaceChildren('');
        const fragment = new DocumentFragment();
        for (let i = 0; i < 9; i++) {
            _board[i] = document.createElement('div');
            _board[i].addEventListener('click', playTile);
            _board[i].classList.add('tile');
            fragment.appendChild(_board[i]);
        }
        boardCtn.appendChild(fragment);
    }

    const resetBoard = () => {
        _board.forEach((tile) => tile.textContent = '');
        if (player1.getState()) player1.changeState();
        if (!player2.getState()) player2.changeState();
    }

    const playTile = e => {
        if (player1.getState() && e.target.textContent === '') {
            e.target.textContent = 'O';
            checkMatchResult();
            player1.changeState();
            player2.changeState();
            if (!player1.getState() && player2.getState() && player2.isCPU()) {
               cpuPlay(); 
            } 

        }   else if (!player2.isCPU() && player2.getState() && e.target.textContent === '')  {
                    e.target.textContent = 'X';
                    checkMatchResult();
                    player1.changeState();
                    player2.changeState();
            }
    }

    const cpuPlay = () => {                   //cpu play
        let tile = cpuImp();
        setTimeout( () => {
            _board[tile].textContent = 'X';
            checkMatchResult();
            player1.changeState();
            player2.changeState();}
        ,1000);
    }

    const cpuEasy = () => {
        let choice = Math.floor(Math.random() * 9);
        while(_board[choice].textContent !== '') choice = Math.floor(Math.random() * 9);
        return choice;
    }

    const cpuImp = () => {
        let choice;
        let tiles = [0,1,2,3,4,5,6,7,8];
        
        for (let i = 0; i < _board.length; i++) {
            if (_board[i].textContent !== '') tiles[i] = _board[i].textContent;
        }
        if (choice === undefined) {
            function getPossMoves(board) {
                return  board.filter(s => s != 'O' && s != 'X');
            }
            function checkWin(board, player){
                if (
                       (board[0] == player && board[1] == player && board[2] == player) ||
                       (board[3] == player && board[4] == player && board[5] == player) ||
                       (board[6] == player && board[7] == player && board[8] == player) ||
                       (board[0] == player && board[3] == player && board[6] == player) ||
                       (board[1] == player && board[4] == player && board[7] == player) ||
                       (board[2] == player && board[5] == player && board[8] == player) ||
                       (board[0] == player && board[4] == player && board[8] == player) ||
                       (board[2] == player && board[4] == player && board[6] == player)
                       ) {
                       return true;
                   } else {
                       return false;
                   }
               }
            function minimax(board, player) {
                let possMoves = getPossMoves(board);
                let allMoves = [];
                if (checkWin(board, 'O')) return {score: -10};
                if (checkWin(board, 'X')) return {score: 10};
                if (possMoves.length === 0) return {score: 0};
                    for (let i = 0; i < possMoves.length; i++) {
                        let currMove = {};
                            currMove.index = board[possMoves[i]];
                        board[possMoves[i]] = player;
                        if (player === 'O') {
                            
                            let result = minimax(board, 'X');
                            currMove.score = result.score; 
                        }
                            else if (player === 'X') {
                                let result = minimax(board, 'O');
                                currMove.score = result.score; 
                        }
                        board[possMoves[i]] = currMove.index;
                        allMoves.push(currMove);
                    }
                let bestMove;
                if(player === 'X'){
                    let bestScore = -10000;
                    for(let i = 0; i < allMoves.length; i++){
                        if(allMoves[i].score > bestScore){
                            bestScore = allMoves[i].score;
                            bestMove = i;
                        }
                      }
                    }else{
                      let bestScore = 10000;
                      for(let i = 0; i < allMoves.length; i++){
                        if(allMoves[i].score < bestScore){
                          bestScore = allMoves[i].score;
                          bestMove = i;
                        }
                      }
                    }
                    return allMoves[bestMove];
            }
            choice = minimax(tiles, 'X');
            }
        return choice.index;      
}

    const checkMatchResult = () => {
        let tiles = [];
        for (let i = 0; i < _board.length; i++) {
            tiles[i] = _board[i].textContent;
        }
        for (let i = 0; i < winCombi.length; i++) {
            if (tiles[winCombi[i][0]] !== '' &&
                tiles[winCombi[i][0]] === tiles[winCombi[i][1]] &&
                tiles[winCombi[i][0]] === tiles[winCombi[i][2]]) {
            tiles[winCombi[i][0]] == 'O' ? alert('🌕 wins!') : alert('🌞 wins!');
            resetBoard();
            return;
        }
        }
        if (tiles.join('').length === 9) {
        alert('Tie!');
        resetBoard();
    }
    }

    return {
        initBoard,
    }
})();

const player1 = Player('NAT', true, false);
const player2 = Player('Himself', false, true);
Gameboard.initBoard();