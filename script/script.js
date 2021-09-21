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
        var arrayItemCounts = {};
        for (var i in inputArray){
            if (!(arrayItemCounts.hasOwnProperty(inputArray[i]))){
                arrayItemCounts[inputArray[i]] = 1
            } else {
                arrayItemCounts[inputArray[i]] += 1
            }
        }
        var keysByCount = Object.keys(arrayItemCounts).sort(function(a, b){
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
            e.target.textContent = '🌕';
            checkResult();
            player1.changeState();
            player2.changeState();
            if (!player1.getState() && player2.getState() && player2.isCPU()) {
               cpuPlay(); 
            } 

        }   else if (!player2.isCPU() && player2.getState() && e.target.textContent === '')  {
                    e.target.textContent = '🌞';
                    checkResult();
                    player1.changeState();
                    player2.changeState();
            }
    }

    const cpuPlay = () => {                   //cpu play
        let tile = cpuImp();
        setTimeout( () => {
            _board[tile].textContent = '🌞';
            checkResult();
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
        let tiles = [];
        
        for (let i = 0; i < _board.length; i++) {
            tiles[i] = _board[i].textContent;
        }
        
        for (let i = 0; i < winCombi.length; i++) {  //aim to win (fill the third one)
            if (tiles[winCombi[i][2]] === '' && tiles[winCombi[i][0]] === '🌞' && tiles[winCombi[i][0]] === tiles[winCombi[i][1]])
                {choice = winCombi[i][2]; break;}
                else if (tiles[winCombi[i][1]] === '' && tiles[winCombi[i][2]] === '🌞' && tiles[winCombi[i][0]] === tiles[winCombi[i][2]])
                {choice = winCombi[i][1]; break;}
                else if (tiles[winCombi[i][0]] === '' && tiles[winCombi[i][1]] === '🌞' && tiles[winCombi[i][1]] === tiles[winCombi[i][2]])
                {choice = winCombi[i][0]; break;}
        }
        if (choice === undefined) {                  //aim to not lose (prevent filling the third one)
            for (let i = 0; i < winCombi.length; i++) {   
                if (tiles[winCombi[i][2]] === '' && tiles[winCombi[i][0]] === '🌕' && tiles[winCombi[i][0]] === tiles[winCombi[i][1]])
                    {choice = winCombi[i][2]; break;}
                    else if (tiles[winCombi[i][1]] === '' && tiles[winCombi[i][2]] === '🌕' && tiles[winCombi[i][0]] === tiles[winCombi[i][2]])
                    {choice = winCombi[i][1]; break;}
                    else if (tiles[winCombi[i][0]] === '' && tiles[winCombi[i][1]] === '🌕' && tiles[winCombi[i][1]] === tiles[winCombi[i][2]])
                    {choice = winCombi[i][0]; break;}
            }
        }
        if (choice === undefined) {                  //choose best possible move
            let allPlrPossWinCombi = [];
            let currPlrPossWinCombi = [];
            for (let i = 0; i < winCombi.length; i++) {
                    if (tiles[winCombi[i][0]] !== '🌞' && tiles[winCombi[i][1]] !== '🌞' && tiles[winCombi[i][2]] !== '🌞') 
                        if (tiles[winCombi[i][0]] === '🌕' || tiles[winCombi[i][1]] === '🌕' || tiles[winCombi[i][2]] === '🌕') {
                            currPlrPossWinCombi = currPlrPossWinCombi.concat(winCombi[i]);
                        }
                            else allPlrPossWinCombi = allPlrPossWinCombi.concat(winCombi[i]);                        
            }

            let bestMoves = uniqueCountPreserve(currPlrPossWinCombi);
            let allBestMoves = uniqueCountPreserve(allPlrPossWinCombi);
            if (allBestMoves.length !== 0) {
                for (let i = allBestMoves.length - 1; i >= 0; i--) {
                    if (tiles[allBestMoves[i]] === '') {
                        if (bestMoves.includes(allBestMoves[i])) {
                            choice = allBestMoves[i]; 
                            break
                        }
                    }
                }
            }   else {for (let i = 0; i < tiles.length; i++) {if (tiles[i] === '') {choice = i; break;}}}
        }
        return choice;
    }

    const checkResult = () => {
        let tiles = [];
        for (let i = 0; i < _board.length; i++) {
            tiles[i] = _board[i].textContent;
        }
        for (let i = 0; i < winCombi.length; i++) {
            if (tiles[winCombi[i][0]] !== '' &&
                tiles[winCombi[i][0]] === tiles[winCombi[i][1]] &&
                tiles[winCombi[i][0]] === tiles[winCombi[i][2]]) {
            tiles[winCombi[i][0]] == '🌕' ? alert('🌕 wins!') : alert('🌞 wins!');
            resetBoard();
            return;
        }
        }
        if (tiles.join('').length === 18) {
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