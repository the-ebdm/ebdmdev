// Basic pong game with 2 paddles and a ball
const speedCounter = document.getElementById("speed");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ballSize = 10;
const paddleHeight = 10;
const paddleWidth = 75;

const state = {
  pause: true,
  end: false,
  speed: 20,
  frame: 0,
  score: 0,
  ball: new Ball({
    ctx: ctx,
    name: "ball",
    x: canvas.width / 2,
    y: canvas.height / 2,
    height: ballSize,
    width: ballSize,
    color: "#0095DD"
  }),
  paddles: [
    new Paddle({
      ctx: ctx,
      name: "paddle1",
      x: (canvas.width - 75) / 2,
      y: canvas.height - paddleHeight,
      height: paddleHeight,
      width: 75,
      color: "green"
    }),
    new Paddle({
      ctx: ctx,
      name: "paddle2",
      x: (canvas.width - 75) / 2,
      y: 0,
      height: paddleHeight,
      width: 75,
      color: "red"
    })
  ]
}
state.objects = [state.ball, ...state.paddles]

// Autosize canvas
function autosize() {
  const maxWidth = 400;
  const maxHeight = 400;
  canvas.width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth;
  canvas.height = window.innerHeight > maxHeight ? maxHeight : window.innerHeight;
  state.paddles[0].x = (canvas.width - 75) / 2;
  state.paddles[0].y = canvas.height - paddleHeight;
  state.paddles[1].x = (canvas.width - 75) / 2;
  state.paddles[1].y = 0;

  state.ball.x = canvas.width / 2;
  state.ball.y = canvas.height / 2;
}

addEventListener("resize", (event) => {
  console.log(`Resized to ${window.innerWidth}x${window.innerHeight}`)
  autosize();
});

function pause() {
  state.pause = !state.pause;
  if (state.pause === false) {
    setTimeout(startGameLoop, state.speed);
  }
}

function setSpeed(speed) {
  state.speed = speed;
  speedCounter.value = speed;
}

function play() {
  autosize();
  state.ball.dx = 1;
  state.ball.dy = 2;
  setSpeed(state.speed);
  startGameLoop();
}

function startGameLoop() {
  state.frame++;
  update();
  draw();
  // ai(state.paddles[0], state.ball);
  ai(state.paddles[1], state.ball);
  state.speed = speedCounter.value;
  if (!state.pause) {
    setTimeout(startGameLoop, state.speed);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.objects.forEach(object => object.draw());
  drawLine(0, canvas.height / 2, canvas.width, canvas.height / 2, "black");
  drawScore();
  if (state.end) {
    state.ball.color = "red";
    state.ball.draw();
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 75, canvas.height / 2 - 20);
    ctx.fillText(`Score: ${state.score}`, canvas.width / 2 - 50, canvas.height / 2 + 35);
  }
}

function drawLine(x, y, dx, dy, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(dx, dy);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  // Score
  ctx.fillText(`Score: ${state.score}`, 8, 20);
  // Pause
  ctx.fillText(`Pause: ${state.pause}`, 8, 40);
}

function update() {
  state.paddles.forEach((paddle) => paddle.update(state.ball));
  state.ball.update();
}

function getSpeed(distance) {
  const modifier = distance / 10
  const max = 3;

  return modifier > max ? max : modifier;
}

function ai(paddle, ball) {
  if (state.pause) {
    paddle.dx = 0;
    return;
  };
  // Which paddle am I? Top or bottom?
  // If ball is moving away from paddle, don't move
  if (paddle.type() === "top" && ball.dy > 0 || paddle.type() === "bottom" && ball.dy < 0) {
    paddle.dx = 0;
  }

  // If ball is moving towards paddle, move towards it
  if (paddle.type() === "top" && ball.dy < 0) {
    if (ball.x + ball.dx < paddle.x + paddle.width / 2) {
      const distance = Math.abs(ball.x + ball.dx - (paddle.x + paddle.width / 2));
      paddle.dx = -getSpeed(distance);
    }
    if (ball.x + ball.dx > paddle.x + paddle.width / 2) {
      const distance = Math.abs(ball.x + ball.dx - (paddle.x + paddle.width / 2));
      paddle.dx = getSpeed(distance);
    }
  }
  if (paddle.type() === "bottom" && ball.dy > 0) {
    paddle.dx = -2;
  }
}

addEventListener("click", (event) => {
  console.log(event)
  pause();
});

addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      state.paddles[0].dx = -7;
      break;

    case "ArrowRight":
      state.paddles[0].dx = 7;
      break;

    case " ":
      pause();
      break;

    default:
      break;
  }
});

addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    state.paddles[0].dx = 0;
  }
});

play();