
const ShipFactory = (id, length) => {
    if (length <= 0 || length > 10)
	throw new Error('Invalid Length');

    var hits = [];
    pos = [0,0];

    const hit = (pos) => {
	//greater than/equal to size of ship or negative number not allowed
        if (pos >= length || pos < 0)
            throw new Error('Invalid pos');
	
	for (var i = 0; i < hits.length; i++) {
	    //was already hit at this position
            if (hits[i] === pos)
                throw new Error('Invalid pos');
        }
	hits.push(pos);
    }

    const getHits = () => {
        return hits;
    }

    const getPos = () => {
        return pos;
    }

    const setPos = (row, col) => {
        pos = [row, col];
    }

    const isSunk = () => {
        return hits.length === length;
    }

    return {id, length, hit, getHits, setPos, getPos, isSunk};
};

module.exports = ShipFactory;
