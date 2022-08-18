const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/field.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;
let score = 0;
let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 3)) * box
};

let colorHard =true;
let hardModeActive = false;
let snake = [];
snake[0]= {
    x: 9*box,
    y: 10*box
};

let dir;
let speedGame = 150;
let snakeDead = false;
let start = null;

document.addEventListener("keydown", direction);

//move on mobile
function moveDown(){
    if(dir != "up")
        dir = "down";
}
function moveUp(){
    if(dir != "down")
        dir = "up";
}
function moveLeft(){
    if(dir != "right")
        dir = "left";
}
function moveRight(){
    if(dir != "left")
        dir = "right";
}

//direction of snake
function direction(event){
    if(event.keyCode == 37 && dir != "right")
        dir = "left";
    else if(event.keyCode == 38 && dir != "down")
        dir = "up";
    else if(event.keyCode == 39 && dir != "left")
        dir = "right";
    else if(event.keyCode == 40 && dir != "up")
        dir = "down";
}

//dead snake
function eatTail(head, arr){
    for(let i = 0; i < arr.length; i++){
        if(head.x == arr[i].x && head.y == arr[i].y){
            ctx.fillStyle = "white";
            if(score<20){
                ctx.font = "37px Arial";
                ctx.fillText("Game over, loser! Your score "+ score, box*1, box*10);
            }
            else if(score<=40){
                ctx.font = "43px Arial";
                ctx.fillText("Game over! Your score "+ score, box*1.5, box*10);
            }
            else if(score<254){
                ctx.font = "37px Arial";
                ctx.fillText("U so crazy maaaan! Your score "+ score, box*1, box*10);
            }
            else if(score>253){
                ctx.font = "60px Arial";
                ctx.fillText("U F*CKEN CHEATER!!!", box*1, box*10);
            }
            snakeDead = true;
        }
    }

}

//create food
function newFood(arr){
    food = {
        x: Math.floor((Math.random() * 17 + 1)) * box,
        y: Math.floor((Math.random() * 15 + 3)) * box
    };
    for(let i = 0; i < arr.length; i++){
        if(food.x == arr[i].x && food.y == arr[i].y){
            newFood(arr);    
        }
    }        
}

function hardMode(){
    speedGame = 50; 
    hardModeActive = true;  
}

function needDrawGame(){
    if (!start) 
        start = (+new Date);
}

function drawGame(){
    if (snakeDead)
        return false;
    ctx.drawImage(ground, 0, 0);

    ctx.drawImage(foodImg, food.x, food.y);

    if (hardModeActive){
        if (colorHard){
            ctx.fillStyle = "gray";
            colorHard = false;
        }
        else{
            ctx.fillStyle = "black";
            colorHard =true;
        }
        ctx.font = "30px Arial";
        ctx.fillText("Very hard mode", box*12, box*1.5);
    } 

    for(let i = 0; i<snake.length; i++){
        ctx.fillStyle = i == 0 ? "green" : "red";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box*2.5, box*1.7);


    needDrawGame();
    if(((+new Date) - start)>speedGame){
        start = null;

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if(snakeX == food.x && snakeY == food.y){
            score++;
            newFood(snake);
        }else{
            snake.pop();   
        }

        if(dir == "left") snakeX -= box;
        if(dir == "right") snakeX += box;
        if(dir == "down") snakeY += box;
        if(dir == "up") snakeY -= box;

        if(snakeX < box){
            snakeX = box*17; 
        }
        else if(snakeX > box*17){
            snakeX = box;
        }
        else if(snakeY < 3*box){
            snakeY = box*17;
        }
        else if(snakeY > box*17){
            snakeY = 3*box;
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        eatTail(newHead, snake);

        snake.unshift(newHead);
    }
    window.requestAnimationFrame(drawGame);
}

window.requestAnimationFrame(drawGame);