var canvas = document.getElementById("canvas");//вынести в g_context
var context = canvas.getContext("2d");

var isPaused = true;

var FPS = 60;
var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/FPS)};

var g_context = {};
g_context.lastTime = new Date();
g_context.img = new Image();
g_context.img.src = "img/spritesheet.png";
g_context.player = new Player();
g_context.computer = new Computer();
g_context.ball = new Ball(200, 300);
g_context.touch = 0;

window.onload = function()
{
   animate(step);
};

var step = function()
{
    if (isPaused) {
        var currentTime = new Date();
        deltaTime = currentTime - g_context.lastTime;
        update(deltaTime);
        render();
        g_context.lastTime = currentTime;;
    }
    animate(step);
};



var render = function()
{
    drawField();
    drawWalls();
    g_context.player.render();
    g_context.computer.render();
    g_context.ball.render();
};

var drawWalls = function()
{
    context.beginPath();
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 800, 10);

    context.beginPath();
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 10, 800);

    context.beginPath();
    context.fillStyle = '#000000';
    context.fillRect(590, 0, 10, 800);

    context.beginPath();
    context.fillStyle = '#000000';
    context.fillRect(0, 790, 800, 10);
}

var drawField = function()
{
	context.drawImage(g_context.img, 5, 5, 600, 800, 0, 0, 600, 800);
}

var LEFT_DIRECTION = 1;
var RIGHT_DIRECTION = 2;
var NO_DIRECTION = 3;

function Paddle(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 300;
	this.currentDirection = NO_DIRECTION;
    this.r = this.width / 2;
}

Paddle.prototype.render = function()
{
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(g_context.img, 620, 530, 100, 20, this.x+5, this.y+5, this.width-10, this.height-10);
	//явно не вынесены константы
};

function Player()
{
//объект начального состояния
    this.paddle = new Paddle(250, 760, 100, 20);
}

function Computer()
{
    this.paddle = new Paddle(250, 20, 100, 20);
}

Player.prototype.render = function()
{
    this.paddle.render();
};

Computer.prototype.render = function()
{
    this.paddle.render();
};

function Ball()
{
    this.x = 300;
    this.y = 400;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 10;
}

Ball.prototype.render = function()
{
    context.drawImage(g_context.img, 612, 5, 520, 505, this.x-15, this.y-15, 30, 30);
};

var update = function(deltaTime)
{
    g_context.player.update(deltaTime);
    g_context.ball.update(g_context.player.paddle);
};

var keysDown = {};

window.addEventListener("keydown", function(event)
{
    if (event.keyCode == 37)
    {
        g_context.player.paddle.currentDirection = LEFT_DIRECTION;
    }
    if (event.keyCode == 39)
    {
        g_context.player.paddle.currentDirection = RIGHT_DIRECTION;
    }
});

Player.prototype.update = function(deltaTime)
{
    if (this.paddle.currentDirection == LEFT_DIRECTION)
    {
        this.paddle.x -= this.paddle.x_speed * deltaTime / 1000;
    }
    if (this.paddle.currentDirection == RIGHT_DIRECTION)
    {
        this.paddle.x += this.paddle.x_speed * deltaTime / 1000;
    }
    if (this.paddle.x < 10)
    {
        this.paddle.x = 10;
    }
    if (this.paddle.x + this.paddle.width > 590)
    {
        this.paddle.x = 590 - this.paddle.width;
    }
    this.paddle.currentDirection = NO_DIRECTION;
}

Ball.prototype.update = function(playerPaddle)
{
    this.x += this.x_speed * deltaTime / 10;
    this.y += this.y_speed * deltaTime / 10;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
    if(top_y > 400 && g_context.touch == 0)
    {
        if(top_y < (playerPaddle.y + playerPaddle.height) && bottom_y > playerPaddle.y && top_x < (playerPaddle.x + playerPaddle.width) && bottom_x > playerPaddle.x)
            {
            g_context.touch = g_context.touch + 1;
            this.y_speed = -3;
            this.x_speed = -3;
            this.y += this.y_speed;
        }
    }
    else if (top_y > 400 && g_context.touch > 0)
    {
        if(top_y < (playerPaddle.y + playerPaddle.height) && bottom_y > playerPaddle.y && top_x < (playerPaddle.x + playerPaddle.width) && bottom_x > playerPaddle.x)
        {
          this.y_speed = -3;
          this.x_speed = this.x_speed;
          this.y += this.y_speed;
        }
    }


  if(this.x - 5 < 20)
  {
    this.x = 25;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 580)
  {
    this.x = 575;
    this.x_speed = -this.x_speed;
  }
  if (this.y - 5 < 20)
  {
      this.y = 25;
      this.y_speed = -this.y_speed;
  }
};


document.getElementById("pause").onclick = stopGame;
function stopGame()
{
    isPaused = false;
}

document.getElementById("start").onclick = startGame;
function startGame()
{
    isPaused = true;
    g_context.lastTime = new Date();
}




