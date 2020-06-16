import {Game, ShipCard} from './DOM.js';
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

function initShipCard(ships) {
     const container = document.getElementById('Card');
     ReactDOM.render(e(ShipCard, {ships: ships}), container); 
}

function gameLoop() {
    const running = true;
    var turn = 1;

    const p1 = player(1);
    const p2 = player(2);

    const gb1 = gameboard(1);
    const gb2 = gameboard(2);

    //todo: implement system for user to place ships
    //placeBoats(p1, gb1);
    initShipCard(gb1.getShips());
    placeBoats(p2, gb2);

    const container = document.getElementById('Game');
    ReactDOM.render(e(Game, {boards: [gb1, gb2]}), container);
}

gameLoop();
