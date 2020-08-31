import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

  if( props.winner ) {
    return (
      <button className="square" onClick={props.onClick}>
        <b>{props.value}</b>
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  
  renderSquare(i, winners) {
    let winner = 0;
    if(winners.includes(i)){
      winner = 1;
    }
    return <Square winner={winner} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, this.props.winners)}
          {this.renderSquare(1, this.props.winners)}
          {this.renderSquare(2, this.props.winners)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.props.winners)}
          {this.renderSquare(4, this.props.winners)}
          {this.renderSquare(5, this.props.winners)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.props.winners)}
          {this.renderSquare(7, this.props.winners)}
          {this.renderSquare(8, this.props.winners)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: new Array(9).fill(null),
        pos: 0,
        turn: "X"
      }],
      order: 0,
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.history[history.length - 1];
    const squares = current.squares.slice();

    // if winner or square already filled
    if(calculateWinner(squares) || squares[i]){
        return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      // concat does not mutate original array like push?
      history: history.concat([{
        squares: squares,
        pos: i,
        turn: squares[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  reorder() {
    this.setState({
      order: !this.state.order
    })
  }

  render() {

    let history = this.state.history;
    const current = this.state.history[this.state.stepNumber];
    const order = this.state.order;
    const stepNumber = this.state.stepNumber;

    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {

      if(order){
        move = history.length - 1 - move;
      }

      const i = history[move].pos;
      const col = (i % 3);
      let row;
      if( i >= 0 && i < 3 ) {
          row = 0;
      } else if ( i >= 3 && i < 6 ) {
          row = 1;
      } else if ( i >= 6 && i <= 8 ){
          row = 2;
      }
      
      const desc = move ? 'Go to move #' + move + " " + history[move].turn + " (" + (row + 1) + "," + (col + 1) + ")" : 'Go to game start';
      if( move === stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    })

    let status;
    if(winner) {
      status = 'Winner: ' + winner[winner.length-1];
    } else if( stepNumber === 9 ){
      status = 'CATS GAME!!!!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') ;
    }

    let winners = winner ? winner.slice(0, winner.length-1) : [];
    return (
      <div className="game">
        <div className="game-board">
          <Board winners={winners} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick= {() => this.reorder()}>{order ? "ASC ORDER" : "DESC ORDER"}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c, squares[a]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
