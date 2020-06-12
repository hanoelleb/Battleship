import {Game} from './DOM.js';
const player = require('./Player');
const gameboard = require('./Gameboard');

const e = React.createElement;

function initGame() {
    renderGame();
}

function placeBoats(player, board){
    var row = 0;
    var col = 0;
    for (var i = 1; i <= 10; i++) {
        while ( !(player.placeShip(board, row, col, i)) ){
            row = Math.floor((Math.random() * 10));
            col = Math.floor((Math.random() * 10));
	}
    }
}

function gameLoop() {
    const running = true;
    var turn = 1;

    const p1 = player(1);
    const p2 = player(2);

    const gb1 = gameboard();
    const gb2 = gameboard();

    
    placeBoats(p1, gb1);
    placeBoats(p2, gb2);
    const container = document.getElementById('Game');
    ReactDOM.render(e(Game, {boards: [gb1, gb2]}), container);
    /*
    renderGame([gb1, gb2]);
    while (true) {
        renderGame([gb1, gb2]);
    }*/

    /*
    while (running) {
        if (turn === 1) {
             
            //players turn
            turn = 2;
	} else {
            //comp turn
            var row = Math.floor((Math.random() * 10));
            var col = Math.floor((Math.random() * 10));
            while(!gb1.receiveAttack(row, col)){
                row = Math.floor((Math.random() * 10));
                col = Math.floor((Math.random() * 10));}
            turn = 1;
	}
	renderGame([gb1, gb2]);
	//check for winner
    }*/
}

//const container = document.getElementById('Game');
//    ReactDOM.render(e(Game, {boards: boards}), container);
gameLoop();
