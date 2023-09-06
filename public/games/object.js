class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class MovableObject {
  constructor({ ctx, name, x, y, width, height, color }) {
    this.ctx = ctx;
    this.name = name;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.color = color;
    this.position = new Position(x, y);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, 1, 1)
    this.ctx.fillStyle = "red"
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class Ball extends MovableObject {
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, 1, 1)
    this.ctx.fillStyle = "red"
    this.ctx.fill();
    this.ctx.closePath();
  }

  bounce(direction, spice = false) {
    console.log(`bounce ${direction}`)
    // If ball is moving up or down, reverse direction
    if (direction === "vertical") {
      if (spice) {
        this.dy = -(this.dy + (Math.random()));
      } else {
        this.dy = -this.dy;
      }
    } else if (direction === "horizontal") {
      this.dx = -this.dx;
    } else {
      console.log("Invalid direction")
    }
  }

  update() {
    // Check for collision with walls, up and down
    if (this.x + this.dx > canvas.width - 10 || this.x + this.dx < 10) {
      this.bounce("horizontal")
    }

    // Check for collision with walls, left and right
    if (this.y < 10 || this.y > canvas.height - 10) {
      this.bounce("vertical")
    }

    // If game isn't paused, update ball position
    if (!state.pause) {
      this.x += this.dx;
      this.y += this.dy;
    }
  }
}

class Paddle extends MovableObject {
  type() {
    return this.y > canvas.height / 2 ? "bottom" : "top"
  }

  update(ball) {
    let obstructed = false;
    const directionOfMovement = this.dx > 0 ? "right" : "left";
    // Check for collision with walls
    if (this.x > canvas.width - this.width || this.x + this.dx < 0) {
      obstructed = true;
      // Is the paddle obstructed by the right or left wall?
      const wall = this.x > canvas.width - this.width ? "right" : "left";
      // If paddle is obstructed, only allow it to move in the opposite direction
      if (directionOfMovement != wall) {
        obstructed = false;
      }
    }

    // Which paddle am I? Top or bottom?
    let paddleType = this.y > canvas.height / 2 ? "bottom" : "top";

    // Check for collision with ball for top paddle
    if (paddleType === "top") {
      if (ball.y - ball.height + ball.dy < this.y + this.height) {
        ball.bounce("vertical");
      }
    }

    // Check for collision with ball for bottom paddle
    if (paddleType === "bottom") {
      if ((ball.y + ball.height + ball.dy) > this.y) {
        console.log("reached bottom paddle level")
        // Check if ball is within paddle width
        if (ball.x + ball.width > this.x && ball.x < this.x + this.width) {
          console.log("hit bottom paddle")
          state.score++
          ball.bounce("vertical", true);
        } else {
          console.log("missed bottom paddle")
          if (ball.y + ball.height + ball.dy > canvas.height) {
            state.score = 0;
            state.pause = true;
            state.end = true;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = 0;
            ball.dy = 0;
            // Print game over
          }
        }
      }
    }

    if (!obstructed) {
      this.x += this.dx;
      this.y += this.dy;
    }
  }
}