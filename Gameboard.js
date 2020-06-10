const Ship = require('./Ship');

const GameboardFactory = () => {

    const ATTACKED = 50;
    var ships = [
        Ship(1,1),
        Ship(2,1),
	Ship(3,1),
        Ship(4,1),
        Ship(5,2),
        Ship(6,2),
        Ship(7,2),
        Ship(8,3),
        Ship(9,3),
        Ship(10,4),
    ];

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

    const place = (row, col, id) => {
        for (var i = 0; i < ships[id-1].length; i++) {
            //taken spot so return false as it can't be placed here.
            if (board[row][col+i] !== 0) {
		return false;
	    }
	}

        ships[id-1].setPos(row, col);
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
            const pos = ships[id-1].getPos();
            //if horizontal
            const hitAt = Math.abs(pos[1] - col);
            ships[id-1].hit(hitAt);
            board[row][col] = ATTACKED;
        } else if (board[row][col] === 0) {
            missedShots.push([row,col]);
	}
    }

    const shipHits = (id) => {
        return ships[id-1].getHits();
    }

    const getMissedShots = () => {return missedShots;}

    const areAllSunk = () => {
        for (var i = 0; i < ships.length; i++) {
            if (!ships[i].isSunk)
                return false;
	}
        return true;
    }

    return {place, isFilled, getMissedShots, receiveAttack, shipHits, areAllSunk};
}

module.exports = GameboardFactory;
