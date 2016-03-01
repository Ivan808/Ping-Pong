var g_context = {};
g_context.lastTime = new Date();
g_context.img = new Image();
g_context.img.src = "img/spritesheet.png";
g_context.player = new Player();
g_context.computer = new Computer();
g_context.ball = new Ball(200, 300);
g_context.firstTouchComputer = 0;
g_context.firstTouchPlayer = 0;
g_context.canvas = document.getElementById("canvas");
g_context.context = canvas.getContext("2d");
g_context.spritePaddleLeftTopX = 620;
g_context.spritePaddleLeftTopY = 520;
g_context.spritePaddleRightBottomX = 100;
g_context.spritePaddleRightBottomY = 20;
g_context.scorePlayer = 0;
g_context.scoreBot = 0;
g_context.FPS = 60;

window.onload = function()
{
   step();
};


var step = function()
{
    var currentTime = new Date();
    deltaTime = currentTime - g_context.lastTime;
    update(deltaTime);
    render();
    g_context.lastTime = currentTime;
};



var render = function()
{
    drawField();
    drawWalls();
    g_context.player.render();
    g_context.computer.render();
    g_context.ball.render();
    score();
    drawButton();
};

var drawWalls = function()
{
    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(0, 0, 800, 10);

    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(0, 0, 10, 800);

    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(590, 0, 10, 800);

    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(0, 790, 800, 10);
}

var drawField = function()
{
	g_context.context.drawImage(g_context.img, 5, 5, 600, 800, 0, 0, 600, 800);
}

var LEFT_DIRECTION = 1;
var RIGHT_DIRECTION = 2;
var NO_DIRECTION = 3;

function Paddle(x, y, width, height, speed)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = speed;
    this.currentDirection = NO_DIRECTION;
    this.r = this.width / 2;
}

Paddle.prototype.render = function()
{
    g_context.context.fillStyle = "#0000FF";
    g_context.context.fillRect(this.x, this.y, this.width, this.height);
    g_context.context.drawImage(g_context.img, g_context.spritePaddleLeftTopX, g_context.spritePaddleLeftTopY, g_context.spritePaddleRightBottomX, g_context.spritePaddleRightBottomY, this.x+5, this.y+5, this.width-10, this.height-10);
};

function Player()
{
    this.paddle = new Paddle(250, 760, 100, 20, 300);
}

function Computer()
{
    this.paddle = new Paddle(250, 20, 100, 20, 250);
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
    this.y = 730;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 10;
}

Ball.prototype.render = function()
{
    g_context.context.drawImage(g_context.img, 612, 5, 520, 505, this.x-15, this.y-15, 30, 30);
};

var update = function(deltaTime)
{
    g_context.player.update(deltaTime);
    g_context.ball.update(g_context.player.paddle, g_context.computer.paddle);
	g_context.computer.update(deltaTime);
};

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

window.addEventListener("keyup", function(event)
{
	if (event.keyCode == 37 || event.keyCode == 39)
    {
        g_context.player.paddle.currentDirection = NO_DIRECTION;
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
}

Computer.prototype.update = function(deltaTime)
{
    var deltaX = this.paddle.x_speed * deltaTime / 1000;
    
    if (this.paddle.x < g_context.ball.x)
    {
        this.paddle.x += deltaX;
    }
    if (this.paddle.x > g_context.ball.x)
    {
        this.paddle.x -= deltaX;
    }
    if (this.paddle.x < 10)
    {
        this.paddle.x = 10;
    }
    if (this.paddle.x + this.paddle.width > 590)//move
    {
        this.paddle.x = 590 - this.paddle.width;
    }
}

Ball.prototype.update = function(playerPaddle, computerPaddle)
{
    this.x += this.x_speed * deltaTime / 10;
    this.y += this.y_speed * deltaTime / 10;
    var top_x = this.x - 15;
    var top_y = this.y - 15;
    var bottom_x = this.x + 15;
    var bottom_y = this.y + 15;
    var leftDirection = 2;
    var rightDirection = 1;
    var direction = 0;
    if(top_y > 400 && g_context.firstTouchPlayer == 0)
    {
        if(top_y < (playerPaddle.y + playerPaddle.height) && bottom_y > playerPaddle.y && top_x < (playerPaddle.x + playerPaddle.width) && bottom_x > playerPaddle.x)
        {
            g_context.firstTouchPlayer = g_context.firstTouchPlayer + 1;
            this.y_speed = -3;
            direction = Math.floor(Math.random() * (2 - 1 + 1)) + 1;;
            console.log(direction);
            if (direction == leftDirection)
            {
                this.x_speed = -3;
            }
            else 
            {
                this.x_speed = 3;
            }
            this.y += this.y_speed;
        }
    }
    else if (top_y > 400 && g_context.firstTouchPlayer > 0)
    {
        if(top_y < (playerPaddle.y + playerPaddle.height) && bottom_y > playerPaddle.y && top_x < (playerPaddle.x + playerPaddle.width) && bottom_x > playerPaddle.x)
        {
            this.y_speed = -3;
            this.x_speed = this.x_speed;
            this.y += this.y_speed;
        }
    }
    
    else if (top_y < 400)
    {
        if(top_y < (computerPaddle.y + computerPaddle.height) && bottom_y > computerPaddle.y && top_x < (computerPaddle.x + computerPaddle.width) && bottom_x > computerPaddle.x)
        {
            this.y_speed = 3;
            this.x_speed = this.x_speed;
            this.y += this.y_speed;
        }
    }

    
    if(this.x - 5 < 20)
    {
        this.x = 25;
        this.x_speed = -this.x_speed;
    }     
    else if(this.x + 5 > 580)
    {
        this.x = 575;
        this.x_speed = -this.x_speed;
    }
    
    if(this.y - 5 < 20)
    {
        g_context.scorePlayer++;
        this.y = 700;
        this.y_speed = 3;
        this.x = 300;
        this.x_speed = 0;
        g_context.firstTouchPlayer = 0;
        g_context.computer.paddle.x = 250;
        g_context.player.paddle.x = 250;
    }     
    else if(this.y + 5 > 780)
    {
        g_context.scoreBot++;
        this.y = 100;
        this.y_speed = -3;
        this.x = 300;
        this.x_speed = 0;
        g_context.computer.paddle.x = 250;
        g_context.firstTouchPlayer = 0;
        g_context.player.paddle.x = 250;
    }
    
};


function stopGame()
{
    clearInterval(g_context.intervalId);
    
}

function startGame()
{
    g_context.intervalId = setInterval(step, 1000 / g_context.FPS);
    g_context.lastTime = new Date();
}

var score = function()
{
    g_context.context.font = 'bold 50px sans-serif';
    g_context.context.strokeText(g_context.scoreBot, 550, 350);
    g_context.context.strokeText(g_context.scorePlayer, 550, 500);
}

var drawButton = function()
{
    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(510, 360, 70, 30);
    g_context.context.fillStyle = '#FFFFFF';
    g_context.context.font = 'bold 20px Tahoma';
    g_context.context.fillText("start", 520, 380);
    
    g_context.context.beginPath();
    g_context.context.fillStyle = '#000000';
    g_context.context.fillRect(510, 420, 70, 30);
    g_context.context.fillStyle = '#FFFFFF';
    g_context.context.font = 'bold 20px Tahoma';
    g_context.context.fillText("pause", 515, 440);
}

g_context.canvas.addEventListener('mousedown', checkMousePosition, false);
function checkMousePosition(e)
{
    var minValueOfStartButtonX = 510;
    var maxValueOfStartButtonX = 580;
    var minValueOfStartButtonY = 360;
    var maxValueOfStartButtonY = 390;
    if ((e.offsetX > minValueOfStartButtonX) && (e.offsetX < maxValueOfStartButtonX))
    {
        if ((e.offsetY > minValueOfStartButtonY) && (e.offsetY < maxValueOfStartButtonY))
        {
            startGame();
        }
    }
    var minValueOfStopButtonX = 510;
    var maxValueOfStopButtonX = 580;
    var minValueOfStopButtonY = 420;
    var maxValueOfStopButtonY = 450;
    if ((e.offsetX > minValueOfStopButtonX) && (e.offsetX < maxValueOfStopButtonX))
    {
        if ((e.offsetY > minValueOfStopButtonY) && (e.offsetY < maxValueOfStopButtonY))
        {
            stopGame();
        }
    }   
}



