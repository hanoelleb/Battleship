import React from 'react';
import ReactDOM from 'react-dom';
import './Gameboard';
import styles from './styles.module.css'
'use strict'; 

const e = React.createElement;

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = ({hasBoat: false, isAttacked: false});
    }

    handleClick() {
	alert('clicked ' + this.props.row + ' ' + this.props.col);
	const hit = this.props.board.receiveAttack(this.props.row, this.props.col);
        this.setState({isAttacked: true});
        this.props.handler();
    }

    handleBoat() {
        //this.setState({hasBoat: true});
    }

    render(){
        const row = this.props.row;
        const col = this.props.col;
	const val = this.props.val; 
	
	if (val != 0 && val < 50) {
	    return e('div', {className: styles.Boat, onClick: this.handleClick });
	} 
        else if (val != 0) {
            return e('div', {className: styles.Attacked, onClick: this.handleClick });
	}
        return e('div', {className: styles.Square, onClick: this.handleClick });
    }
}

class GameBoard extends React.Component {

    //constructor(props) {
    //     super(props);
    //}
    renderSquare(i,j,val,board) {
        return e(Square, {row: i, col: j, val: val, board: board, handler: this.props.handler}, null);
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
        this.moveHandler = this.moveHandler.bind(this);
	this.state = ({turn: 1});
    }

    moveHandler() {
        if (this.state.turn == 1) {
            this.setState({turn: 2});
	} else {
            this.setState({turn: 1});	
	}
    }

    renderBoard(board) {
        return e(GameBoard, {board: board, handler: this.moveHandler});
    }

    render() {
	const gameboards = this.props.boards;
        const boards = [];
        boards.push(this.renderBoard(gameboards[0]));
        boards.push(this.renderBoard(gameboards[1]));
	return e('div', {className: styles.Game}, boards);
    }
}

function renderGame(boards) {
    const container = document.getElementById('Game');
    ReactDOM.render(e(Game, {boards: boards, handler: this.moveHandler}), container);
}

export {Game};
