import { useEffect, useState } from "react";
import "./App.css";

import BlueCandy from "./assets/blue-candy.png";
import GreenCandy from "./assets/green-candy.png";
import OrangeCandy from "./assets/orange-candy.png";
import PurpleCandy from "./assets/Purple-candy.png";
import RedCandy from "./assets/red-candy.png";
import YellowCandy from "./assets/yellow-candy.png";
import Blank from "./assets/blank.png";

const width = 8;
const colors = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy,
];

function App() {
  const [currentColors, setCurrentColors] = useState([]);
  const [squareBeingDraggedFrom, setSquareBeingDraggedFrom] = useState(null);
  const [squareBeingDraggedTo, setSquareBeingDraggedTo] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const createBoard = () => {
    const randomColors = [];
    for (let i = 0; i < width * width; i++) {
      randomColors.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setCurrentColors(randomColors);
    console.log(currentColors);
  };

  const checkForMatchedColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const ithcolor = currentColors[i];
      const isBlank = currentColors[i] === Blank;
      if (
        columnOfThree.every((sqaure) => currentColors[sqaure] === ithcolor) &&
        !isBlank
      ) {
        // if three columns have same colors
        columnOfThree.forEach((square) => (currentColors[square] = Blank));
        if (gameStarted) {
          setScore((s) => s + 3);
        }
        return true;
      }
    }
  };

  const checkForMatchedColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfThree = [i, i + width, i + width * 2, i + width * 3];
      const ithcolor = currentColors[i];
      const isBlank = currentColors[i] === Blank;
      if (
        columnOfThree.every((sqaure) => currentColors[sqaure] === ithcolor) &&
        !isBlank
      ) {
        // if four columns have same colors
        columnOfThree.forEach((square) => (currentColors[square] = Blank));
        if (gameStarted) {
          setScore((s) => s + 4);
        }
        return true;
      }
    }
  };

  const checkForMatchedRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const columnOfThree = [i, i + 1, i + 2];
      const ithcolor = currentColors[i];
      const isBlank = currentColors[i] === Blank;
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      if (notValid.includes(i)) {
        continue;
      }
      if (
        columnOfThree.every((sqaure) => currentColors[sqaure] === ithcolor) &&
        !isBlank
      ) {
        // if three columns have same colors
        columnOfThree.forEach((square) => (currentColors[square] = Blank));
        if (gameStarted) {
          setScore((s) => s + 3);
        }
        return true;
      }
    }
  };

  const checkForMatchedRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const columnOfThree = [i, i + 1, i + 2, i + 3];
      const ithcolor = currentColors[i];
      const isBlank = currentColors[i] === Blank;
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      if (notValid.includes(i)) {
        continue;
      }
      if (
        columnOfThree.every((sqaure) => currentColors[sqaure] === ithcolor) &&
        !isBlank
      ) {
        // if three columns have same colors
        columnOfThree.forEach((square) => (currentColors[square] = Blank));
        if (gameStarted) {
          setScore((s) => s + 4);
        }
        return true;
      }
    }
  };

  const moveBlocksBelowInEmptySpace = () => {
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];

    for (let i = 0; i < 56; i++) {
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColors[i] === Blank) {
        let newRandomColor = Math.floor(Math.random() * colors.length);
        currentColors[i] = colors[newRandomColor];
      }
      if (currentColors[i + width] === Blank) {
        currentColors[i + width] = currentColors[i];
        currentColors[i] = Blank;
      }
    }
  };

  const dragStart = (e) => {
    console.log(e.target);
    console.log("Drag-start");
    setSquareBeingDraggedFrom(e.target);
    setGameStarted(true);
  };

  const dragDrop = (e) => {
    console.log(e.target);
    console.log("Drag-dropped");
    setSquareBeingDraggedTo(e.target);
  };

  const dragEnd = (e) => {
    console.log(e.target);
    console.log("Drag-end");
    const draggedFromId = parseInt(
      squareBeingDraggedFrom.getAttribute("data-id")
    );
    const draggedToId = parseInt(squareBeingDraggedTo.getAttribute("data-id"));
    console.log(draggedFromId + "->" + draggedToId);

    currentColors[draggedFromId] = squareBeingDraggedTo.getAttribute("src");
    currentColors[draggedToId] = squareBeingDraggedFrom.getAttribute("src");

    // rules for this according to the game:
    // 1. drag can only be in one of the four directions and only for one unit distance
    // 2. if it matches any row or column on drag then continue else return the previous state of grid before drag

    const validMoves = [
      draggedFromId - 1,
      draggedFromId - width,
      draggedFromId + 1,
      draggedFromId + width,
    ];

    const move = validMoves.includes(draggedToId);

    if (
      draggedToId &&
      move &&
      (checkForMatchedColumnOfFour() ||
        checkForMatchedColumnOfThree() ||
        checkForMatchedRowOfFour() ||
        checkForMatchedRowOfThree())
    ) {
      setSquareBeingDraggedFrom(null);
      setSquareBeingDraggedTo(null);
    } else {
      currentColors[draggedFromId] = squareBeingDraggedFrom.getAttribute("src");
      currentColors[draggedToId] = squareBeingDraggedTo.getAttribute("src");
      setCurrentColors([...currentColors]);
    }
    setGameStarted(false);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForMatchedColumnOfFour();
      checkForMatchedRowOfFour();
      checkForMatchedColumnOfThree();
      checkForMatchedRowOfThree();
      moveBlocksBelowInEmptySpace();

      setCurrentColors([...currentColors]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForMatchedColumnOfFour,
    checkForMatchedRowOfFour,
    checkForMatchedColumnOfThree,
    checkForMatchedRowOfThree,
    moveBlocksBelowInEmptySpace,
    currentColors,
  ]);

  return (
    <>
      <div>
        <h2>Score : {score}</h2>
      </div>
      <div className="app">
        <div className="game">
          {currentColors.map((randomColor, index) => (
            <img
              key={index}
              src={randomColor}
              alt={randomColor}
              data-id={index}
              draggable={true}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDragStart={dragStart}
              onDrop={dragDrop}
              onDragEnd={dragEnd}

              // alt={randomColor}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
