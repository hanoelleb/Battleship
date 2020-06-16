const ship = require('../src/Ship');
const gameboard = require('../src/Gameboard');
const player = require('../src/Player');

//////////////////SHIP/////////////////

test('can create ships of different lengths (> 0 &&  =< 10)', () =>{
    const ship1 = ship(1,1);
    const ship2 = ship(2,3);

    expect(ship1.length).toBe(1);
    expect(ship2.length).toBe(3);
});

test('ship factory will throw error with invalid length (<= 0 || > 10)', () => {
    expect(() => {ship(1,0)}).toThrow();
    expect(() => {ship(2,11)}).toThrow();
});


test('ship can be hit', () => {
    const ship1 = ship(1,5);
    ship1.hit(4);
    ship1.hit(0);

    expect(ship1.getHits()).toContain(4);
    expect(ship1.getHits()).toContain(0);
    expect(ship1.getHits()).not.toContain(2);
});

test('ship will not be hit if given invalid number (negative or larger than length)', () => {
    const ship1 = ship(1,5);

    expect(() => {ship1.hit(-1)}).toThrow();
    expect(() => {ship1.hit(7)}).toThrow();
});


test('ship returns if it is sunk', () => {
    const ship1 = ship(1,4);
    ship1.hit(0);
    ship1.hit(2);
    ship1.hit(1);
    ship1.hit(3);

    expect(ship1.isSunk()).toBeTruthy();
});

/////////////////GAMEBOARD///////////////////////


test('Can place ships on board', () => {
    const gb = gameboard();
    gb.place(0,5,5);
    gb.place(6,2,8);

    expect(gb.isFilled(0,5)).toBeTruthy();
    expect(gb.isFilled(0,6)).toBeTruthy(); 
    expect(gb.isFilled(0,7)).toBeFalsy();

    expect(gb.isFilled(6,2)).toBeTruthy();
    expect(gb.isFilled(6,3)).toBeTruthy();
    expect(gb.isFilled(6,4)).toBeTruthy();
    expect(gb.isFilled(6,5)).toBeFalsy();

    expect(gb.isFilled(3,4)).toBeFalsy();
});

test('Cannot place a ship in a space occupied by other ship', () => { 
    const gb = gameboard();
    gb.place(0,3,1);
    expect(gb.place(0,3,2)).toBeFalsy();
    expect(gb.place(0,2,5)).toBeFalsy();
    expect(gb.place(0,1,8)).toBeFalsy();
});

test('Will detect and record if shot hit a ship', () => {
    const gb = gameboard();
    gb.place(0,3,8);

    gb.receiveAttack(0,4);
    gb.receiveAttack(0,5);
    
    const hits = gb.shipHits(8);
    expect(hits).toContain(1);
    expect(hits).toContain(2);
    expect(hits).not.toContain(0);

    gb.place(3,4,9);
    gb.receiveAttack(3,4);
    expect(gb.shipHits(9)).toContain(0);
});

test('Will record missed shots', () => {
    const gb = gameboard();
    gb.place(5,0,1);

    gb.receiveAttack(6,4);
    gb.receiveAttack(9,2);
    gb.receiveAttack(5,0);

    expect(gb.getMissedShots()).toStrictEqual([[6,4],[9,2]]);
    //expect(gb.getMissedShots()).toContain([9,2]);
    expect(gb.getMissedShots()).not.toContain([5,0]);
});

test('Reports if all ships have sunk', () => {
    const gb = gameboard();
    expect(gb.areAllSunk()).toBeFalsy();
    //one tile ships
    gb.place(0,0,1);
    gb.receiveAttack(0,0);

    gb.place(0,2,2);
    gb.receiveAttack(0,2);

    gb.place(0,4,3);
    gb.receiveAttack(0,4);

    gb.place(0,6,4);
    gb.receiveAttack(0,6);

    //two tile ships
    gb.place(1,0,5);
    gb.receiveAttack(1,0);
    gb.receiveAttack(1,1);

    gb.place(1,5,6);
    gb.receiveAttack(1,5);
    gb.receiveAttack(1,6);

    gb.place(2,3,7)
    gb.receiveAttack(2,3);
    gb.receiveAttack(2,4);

    //three tile ships
    gb.place(3,0,8);
    gb.receiveAttack(3,0);
    gb.receiveAttack(3,1);
    gb.receiveAttack(3,2);

    gb.place(3,6,9);
    gb.receiveAttack(3,6);
    gb.receiveAttack(3,7);
    gb.receiveAttack(3,8);

    //four tile ships
    gb.place(4,4,10);
    gb.receiveAttack(4,4);
    gb.receiveAttack(4,5);
    gb.receiveAttack(4,6);
    gb.receiveAttack(4,7);

    expect(gb.areAllSunk()).toBeTruthy();
});

////////////////PLAYER/////////////////////


test('Player can place ships', () => {
    const p1 = player();
    const gb = gameboard();

    p1.placeShip(gb,0,0,1);
    expect(gb.isFilled(0,0)).toBeTruthy();
});

test('Player can attack enemy board', () => {
    const p1 = player();
    const gb = gameboard();

    p1.makeMove(gb,0,0);
    expect(gb.getMissedShots()).toStrictEqual([[0,0]]);
});

