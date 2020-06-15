const Ship = require('./Ship');

const GameboardFactory = (id) => {

    var id = id;

    const ATTACKED = 50;
    const MISSED = 80;

    var ships = [
    ];

    var ship1 = Ship(1,1);
    ships.push(ship1);

    var ship2 = Ship(2,1);
    ships.push(ship2);

    var ship3 = Ship(3,1);
    ships.push(ship3);

    var ship4 = Ship(4,1);
    ships.push(ship4);

    var ship5 = Ship(5,2);
    ships.push(ship5);

    var ship6 = Ship(6,2);
    ships.push(ship6);

    var ship7 = Ship(7,2);
    ships.push(ship7);

    var ship8 = Ship(8,3);
    ships.push(ship8);

    var ship9 = Ship(9,3);
    ships.push(ship9);

    var ship10 = Ship(10,4);
    ships.push(ship10);

    var board = [
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
       [0,0,0,0,0,0,0,0,0,0],
    ];
 
    var missedShots = [];

    const getId = () => {
        return id;
    }

    const place = (row, col, id) => {
        for (var i = 0; i < ships[id-1].length; i++) {
            //taken spot so return false as it can't be placed here.
            if (board[row][col+i] !== 0) {
		return false;
	    }
	}

	var ship = ships[id-1];
	ship.setPos(row,col);

	for (var i = 0; i < ships[id-1].length; i++) {
            board[row][col+i] = id;
        }
	return true;
    }

    const isFilled = (row, col) => {
        return board[row][col] !== 0;
    }

    //todo: implement receiveAttack(row,col), shipHits(id), getMissedShots()
    const receiveAttack = (row,col) => {
        if (board[row][col] !== 0 && board[row][col] != ATTACKED) {
            const id = board[row][col];
	    console.log(id);
	    console.log(ships[id-1]);
            const pos = ships[id-1].getPos();
            //if horizontal
            const hitAt = Math.abs(pos[1] - col);
            ships[id-1].hit(hitAt);
            board[row][col] = ATTACKED;
	    return true;
        } else if (board[row][col] === 0) { 
            missedShots.push([row,col]);
            board[row][col] = MISSED;
            return true;
	}
        return false;
    }

    const shipHits = (id) => {
        return ships[id-1].getHits();
    }

    const getMissedShots = () => {return missedShots;}

    const areAllSunk = () => {
        console.log(ships);
        for (var i = 0; i < ships.length; i++) {
            if (!ships[i].isSunk)
                return false;
	}
        return true;
    }

    const getBoard = () => {
        return board;
    }

    const getShipsPos = () => {
         for (var j = 0; j < ships.length; j++){
               console.log('ship pos: ' + ships[j].getPos());
            }
    }

    return {place, isFilled, getId, getBoard, getMissedShots, receiveAttack, shipHits, areAllSunk, getShipsPos};
}

module.exports = GameboardFactory;
