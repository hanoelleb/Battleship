const gameboard = require('./Gameboard');

const PlayerFactory = (pid) => {

    var id = pid;
    const placeShip = (gb, row, col, id) => {
        return gb.place(row,col,id);
    }

    const makeMove = (enemyGb, row, col) => {
        enemyGb.receiveAttack(row,col);    
    }

    return {placeShip, makeMove,id};
}

module.exports = PlayerFactory;
