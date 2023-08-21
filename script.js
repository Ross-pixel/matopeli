const settingsModal = document.getElementById("settingsModal");
const startButton = document.getElementById("startButton");
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const scoreArea = document.querySelector(".score-area");
const score = document.getElementById("score");

let numRows;
let numCols;
let cellSize;
let numScore = 0;

// Displaying the settings modal
window.onload = function () {
  settingsModal.style.display = "block";
};

startButton.addEventListener("click", () => {
  numRows = parseInt(rowsInput.value);
  numCols = parseInt(colsInput.value);
  cellSize = 20; // Update cell size

  settingsModal.style.display = "none";
  canvas.width = numCols * cellSize;
  canvas.height = numRows * cellSize;
  scoreArea.style.display = "block";

  initializeGame(); // Calling the game initialization function here
});

// Starting the game
function initializeGame() {
  const canvas = document.getElementById("canvas");
  cellSize = 20; // Update cell size
  canvas.width = numCols * cellSize;
  canvas.height = numRows * cellSize;
  const ctx = canvas.getContext("2d");

  // Set initial snake position
  let snake = [{ x: 10, y: 10 }];

  // Set initial snake speed
  let speed = 300;

  // Initialize foodPosition variable
  let foodPosition = null;

  // Set initial movement direction
  let direction = "right";

  // Function to generate random food position
  function generateFood() {
    // Generate random coordinates for food
    const foodX = Math.floor(Math.random() * numCols);
    const foodY = Math.floor(Math.random() * numRows);

    // Check if food position does not overlap with the snake
    if (!snake.some((segment) => segment.x === foodX && segment.y === foodY)) {
      foodPosition = { x: foodX, y: foodY };
    } else {
      generateFood(); // If food overlaps with the snake, try generating a new position
    }
  }

  // Function to update the game state
  function updateGame() {
    const cellSize = canvas.height / numRows;
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display a border around the game field
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Move the snake
    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "right") newHead.x = (newHead.x + 1) % numCols;
    else if (direction === "left")
      newHead.x = (newHead.x - 1 + numCols) % numCols;
    else if (direction === "up")
      newHead.y = (newHead.y - 1 + numRows) % numRows;
    else if (direction === "down") newHead.y = (newHead.y + 1) % numRows;

    // Check for collision with the snake itself
    if (
      snake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )
    ) {
      // Snake collided with itself, end the game and display a message
      alert(`You lost! Your score: ${numScore}. Press OK to restart.`);
      // Reset values and restart the game
      snake = [{ x: 10, y: 10 }];
      direction = "right";
      speed = 300;
      foodPosition = null;
      generateFood();
      updateGame();
      return; // Exit the function to stop updating after losing
    }

    // Check if the snake ate the food
    if (
      foodPosition &&
      newHead.x === foodPosition.x &&
      newHead.y === foodPosition.y
    ) {
      // Snake ate the food, increase its length
      snake.unshift(newHead);
      numScore += 100;
      score.innerHTML = numScore;
      if (speed > 100) {
        speed *= 0.98;
      }
      // Increase the speed
      foodPosition = null; // Reset food position
    } else {
      // Snake did not eat the food, add a new head and remove the tail
      snake.unshift(newHead);
      if (snake.length > 3) snake.pop();
    }

    // Display the food
    if (!foodPosition) {
      generateFood();
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(
        foodPosition.x * cellSize,
        foodPosition.y * cellSize,
        cellSize,
        cellSize
      );
      ctx.strokeStyle = "darkred"; // Set border color for food
      ctx.strokeRect(
        foodPosition.x * cellSize,
        foodPosition.y * cellSize,
        cellSize,
        cellSize
      );
    }

    // Display the snake
    snake.forEach((segment) => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
      ctx.strokeStyle = "darkgreen"; // Set border color for segment
      ctx.strokeRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      ); // Draw segment border
    });

    // Draw the head with a different color
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(
      newHead.x * cellSize,
      newHead.y * cellSize,
      cellSize,
      cellSize
    );
    ctx.strokeStyle = "darkgreen"; // Set border color for head
    ctx.strokeRect(
      newHead.x * cellSize,
      newHead.y * cellSize,
      cellSize,
      cellSize
    ); // Draw head border

    // Start the next update cycle
    setTimeout(updateGame, speed);
  }

  // Key listener for changing the movement direction
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    else if (event.key === "ArrowLeft" && direction !== "right")
      direction = "left";
    else if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowDown" && direction !== "up")
      direction = "down";
  });

  // Start the game
  updateGame();
}
