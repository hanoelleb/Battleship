const gameboard = require('./Gameboard');

const PlayerFactory = (pid) => {

    var id = pid;
    var board = gameboard(id);

    const placeShip = (gb, row, col, id) => {
        gb.place(row,col,id);
    }

    const makeMove = (enemyGb, row, col) => {
        enemyGb.receiveAttack(row,col);    
    }

    return {placeShip, makeMove};
}

module.exports = PlayerFactory;
