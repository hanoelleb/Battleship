import React from 'react';
import ReactDOM from 'react-dom';
import './Gameboard';
import styles from './styles.module.css'
'use strict'; 

var successDrop = false;
var gameRunning = false;

const e = React.createElement;

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = ({hasBoat: false, isAttacked: false});
	this.handleDragOver = this.handleDragOver.bind(this);
	this.handleEnter = this.handleEnter.bind(this);
	this.handleExit = this.handleExit.bind(this);
	this.handleDrop = this.handleDrop.bind(this);
    }

    handleClick() {
	console.log('game running: ' + gameRunning);
	if (gameRunning) {
            if (this.props.board.getId() == 2 && this.props.turn == 1) {
	    const hit = this.props.board.receiveAttack(this.props.row, this.props.col);
        
	    if (hit) {
	            if (this.props.board.areAllSunk()) {
                         alert('Congratulations! You sunk their battleships!');	
	            }

                    this.setState({isAttacked: true});
                    this.props.handler();
	        }
            }
        } else {
	    alert('Please place all your ships!');
	}
    }

    handleEnter(event) {
        const id = event.dataTransfer.getData('id');
	const canPlace = this.props.board.canPlace(this.props.row, this.props.col, id);
        if (canPlace) {
	    successDrop=true;
	    console.log(successDrop);
	} else {
	    successDrop = false;
	    console.log(successDrop);
	}
    }

    handleExit() {
        successDrop = false;
	console.log(successDrop);
    }

    handleDragOver(event) {
	event.preventDefault();
    }

    handleDrop(event) {
        const id = event.dataTransfer.getData('id');
	alert('dropped ship ' + id + ' on square ' + this.props.row + ' ' + this.props.col);
	console.log('id: ' + id);
	const canPlace = this.props.board.place(this.props.row, this.props.col, id);
	console.log(canPlace);
	/*if (canPlace) {
	    console.log('id: ' + id);
	    successDrop = true;
	}*/
	this.props.placeHandler();
    }

    handleBoat() {
        //this.setState({hasBoat: true});
    }

    render(){
        const row = this.props.row;
        const col = this.props.col;
	const val = this.props.val; 
	if (val != 0 && val < 50 && this.props.board.getId() !== 2) {
	    return e('div', {className: styles.Boat, onClick: this.handleClick });
	} 
        else if (val === 50) {
            return e('div', {className: styles.Attacked, onClick: this.handleClick });
	}
        else if (val === 80) { 
            return e('div', {className: styles.Missed, onClick: this.handleClick });
	}
        return e('div', {className: styles.Square, onClick: this.handleClick, onDragOver: this.handleDragOver, onDrop: this.handleDrop,
	onDragEnter: this.handleEnter});
    }
}

class GameBoard extends React.Component {
    
    renderSquare(i,j,val,board) {
        return e(Square, {row: i, col: j, val: val, board: board, handler: this.props.handler, placeHandler: this.props.placeHandler, 
		turn: this.props.turn}, null);
    }
    
    render() {
	const gameboard = this.props.board;
	const BOARDSIZE = 10;
	const board = [];
	for (var i = 0; i < BOARDSIZE; i++) {
            for (var j = 0; j < BOARDSIZE; j++) {
		const val = gameboard.getBoard()[i][j];
                const square = this.renderSquare(i,j,val,gameboard);
                board.push(square);
	    }
	}
        return e('div', {className: styles.Board}, board);
    }
}

class Game extends React.Component {
    constructor(props) {
	super(props);
	this.placeHandler = this.placeHandler.bind(this);
        this.moveHandler = this.moveHandler.bind(this);
	this.chooseMove = this.chooseMove.bind(this);
	this.state = ({turn: 1});
    }

    placeHandler() {
	this.setState({});
    }

    moveHandler() {
        this.setState({turn: 2});
	this.chooseMove();
    }

    chooseMove() {
	const playerBoard = this.props.boards[0];
	var row = Math.floor((Math.random() * 10));
        var col = Math.floor((Math.random() * 10));

	while(!playerBoard.receiveAttack(row, col)){
             row = Math.floor((Math.random() * 10));
             col = Math.floor((Math.random() * 10));
	}
	if (this.props.boards[0].areAllSunk()) {
	    alert('Sorry! All your battleships have sunk!');
	}
        this.setState({turn: 1});
    }

    renderBoard(board) {
        return e(GameBoard, {board: board, handler: this.moveHandler, placeHandler: this.placeHandler, turn: this.state.turn});
    }

    renderShipCard(board) {
        return e(ShipCard, {ships: board.getShips(), board: board, placeHandler: this.placeHandler});
    }

    render() {
	const gameboards = this.props.boards;
        const boards = [];
        boards.push(this.renderBoard(gameboards[0]));
        boards.push(this.renderBoard(gameboards[1]));
        const gameDiv = e('div', {className: styles.Game}, boards);

	const shipcard = this.renderShipCard(gameboards[0]);
	return e('div', null, gameDiv, shipcard);
    }
}

class ShipSquare extends React.Component {
    render(){
        const row = this.props.row;
        const col = this.props.col;
        const val = this.props.val;
        return e('div', {className: styles.Boat});
    }
}

class Ship extends React.Component {
    constructor(props) {
         super(props);
	 this.handleDrag = this.handleDrag.bind(this);
	 this.handleDragEnd = this.handleDragEnd.bind(this);
    }

    renderSquare() {
        return e(ShipSquare, {row: 0, col: 0, val: this.props.ship.id});
    }

    handleDrag(event) {
        console.log('dragging ship: ' + this.props.ship.id);
	event.dataTransfer.setData('id', this.props.ship.id);
    }

    handleDragEnd(event) {
        if (successDrop) {
	     console.log('successful drop');
	     this.props.removeHandler(this.props.ship.id);
	     successDrop = false;
	}
    }

    render() {
        const ship = this.props.ship;
	var squares = [];
	for (var i = 0; i < ship.length; i++) {
            squares.push(this.renderSquare());
	}
	return e('div', {draggable: true, className: styles.Ship, onDragStart: this.handleDrag, onDragEnd: this.handleDragEnd }, squares);
    }
}

class ShipCard extends React.Component {
    
    constructor(props) {
        super(props);
	this.removeShip = this.removeShip.bind(this);
	this.placeShipsRandom = this.placeShipsRandom.bind(this);
        this.state = ({placed: []});
    }

    renderShip(ship) {
        return e(Ship, {ship: ship, removeHandler: this.removeShip});
    }

    removeShip(id) {
	console.log('here');
	const ships = this.props.ships;
        const ids = this.state.placed;
	ids.push(id);
	console.log('ids: ' + ids);
	this.setState({placed: ids});
    }

    placeShipsRandom() {
        var row = Math.floor((Math.random() * 10));
	var col = Math.floor((Math.random() * 10));
	const ids = this.state.placed;
        for (var i = 1; i <= 10; i++) {
            if (ids.indexOf(i) === -1) {
                while ( !(this.props.board.place(row, col, i)) ){
                    row = Math.floor((Math.random() * 10));
                    col = Math.floor((Math.random() * 10));
                }
                ids.push(i);
	    }
        }
	this.setState({placed: ids});
	this.props.placeHandler();
    }

    render() {
	const ships = this.props.ships.slice();
        if (this.state.placed.length !== 10) {
            gameRunning = false;
            var shipGrid = []	
	    for (var i = 0; i < ships.length; i++){
	        if (this.state.placed.indexOf(i+1) === -1)
	            shipGrid.push(this.renderShip(ships[i]));    
	    } 
	    var randomPlace = e('button', {onClick: this.placeShipsRandom}, 'Randomize');
	} else {
            gameRunning = true;
	}
        return e('div', {className: styles.ShipCard}, shipGrid, randomPlace);
    }
}

function renderGame(boards) {
    const container = document.getElementById('Game');
    ReactDOM.render(e(Game, {boards: boards, handler: this.moveHandler}), container);
}

export {Game, ShipCard};
