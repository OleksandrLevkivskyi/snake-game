import { useState, useEffect, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import {
  canvas_size,
  apple_start,
  directions,
  scale,
  snake_start,
  initial_speed,
  direction_start,
} from '../utils/constants';
import '../App.css';
import GameOver from './GameOver';

function Game({setState}) {
  const [direction, setDirection] = useState(direction_start);
  const [snake, setSnake] = useState(snake_start);
  const [apple, setApple] = useState(apple_start);
  const [speed, setSpeed] = useState(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [points, setPoints] = useState(0);
  const [pause, setPause] =useState(false)
  const [active, setActive] = useState(false)
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const [foodType, setFoodType] = useState('red')
  const [counter, setCounter] = useState(1)
  const [saveSpeed, setSaveSpeed] = useState(null)
  const [roundPointsArr, setRoundPointsArr] = useState([])
  
  const startGame = () => {
    setPoints(0);
    setIsPlaying(true);
    setSnake(snake_start);
    setApple(apple_start);
    setDirection(direction_start);
    setSpeed(initial_speed);
    setGameOver(false);
    wrapperRef.current?.focus();
    setActive(true);
    setState(false)
  };

  const endGame = () => {
    setIsPlaying(false);
    setSpeed(null);
    setGameOver(true);
    setActive(false)
    setRoundPointsArr([])
  };

  const pauseGame = () => {
    setSaveSpeed(speed)
    setSpeed(null);
    setPause(true);
  }

  const continueGame = () => {
    setSpeed(saveSpeed);
    setPause(false)
  }
  
  const moveSnake = (event) => {
    const { key } = event;
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowRight' ||
      key === 'ArrowLeft'
    ) {
      if (
        direction.x + directions[key].x &&
        direction.y + directions[key].y
      ) {
        setDirection(directions[key]);
      }
    }
  };

  const checkAvailableSlot = (piece) => {
    switch (true) {
        case piece * scale >= canvas_size.x 
          && piece * scale >= canvas_size.y:
            return 0
        case piece * scale < 0:
            return (canvas_size.x)/scale - 1  && (canvas_size.y)/scale - 1 
        default:
            return piece 
    }
  };

  const checkCollision = (piece, snoko = snake) => {
    for (const segment of snoko) {
      if (piece.x === segment.x && piece.y === segment.y) return true;
    }
    return false;
  };

  const createRandomApple = () => {
    return {
      x: Math.floor((Math.random() * canvas_size.x) / scale),
      y: Math.floor((Math.random() * canvas_size.y) / scale),
    };
  };

  const increaseSpeed = () => {
    const round10=(val)=> {
      return Math.round(Math.floor(val / 10)) * 10;
    }
    let roundPoints = round10(points) 
    roundPointsArr.unshift(roundPoints)
    if (roundPointsArr[0] !== roundPointsArr[1] 
      && roundPointsArr[0] !== 0 
      && roundPointsArr[0] % 50 === 0){
        setSpeed(speed - 50);    
    }
	}

  const changePoints = () => {
    if(counter % 4 === 0) {
      setPoints(points + 5)            
    } else if (counter % 7 === 0) {
      setPoints(points + 10)            
    } else {
      setPoints(points + 1)            
    }         
}

const changeFoodColor = () => {
    let newCounter = counter + 1
    if(newCounter % 4 === 0) {            
        setFoodType('yellow')
    } else if (newCounter % 7 === 0) {            
        setFoodType('black')
    } else {            
        setFoodType('red')
    }
}

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0].x === apple.x && newSnake[0].y === apple.y) {
      let newApple = createRandomApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createRandomApple();
      }
      setCounter(counter + 1)
      changePoints();
      changeFoodColor();
      increaseSpeed();
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = [...snake]; 
    const newSnakeHead = {
      x: checkAvailableSlot(snakeCopy[0].x + direction.x),
      y: checkAvailableSlot(snakeCopy[0].y + direction.y),
    };
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  }; 

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context == null) throw new Error('Could not get context');
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, canvas_size.x, canvas_size.y);
    context.fillStyle = 'green';
    snake.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));
    context.fillStyle = foodType;
    context.fillRect(apple.x, apple.y, 1, 1);
  }, [snake, apple, foodType]);

  useInterval(() => gameLoop(), speed);

  return (
    <div className="wrapper">
      <div
        ref={wrapperRef}
        className="canvas"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => moveSnake(event)}
      >
        <canvas
          style={
            gameOver
              ? { border: '1px solid black', opacity: 0.5 }
              : { border: '1px solid black' }
          }
          ref={canvasRef}
          width={canvas_size.x}
          height={canvas_size.y}
        />
        {gameOver && <GameOver points={points} setState={setState} startGame={startGame} />}
        {!isPlaying && (
          <button className="start" onClick={startGame}>
            Start Game
          </button>
        )}
        {!pause 
        ? <button className={active ? "start pause active" : "start pause"} onClick={pauseGame}>Pause</button> 
        : <button className= "start pause active"  onClick={continueGame}>Continue</button>
      }
        <p className="points">{points}</p>
      </div>      
    </div>
  );
  
}

export default Game;