const board = document.querySelector(".board");
const blockheight = 50;
const blockwidth = 50;
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement =document.querySelector("#high-score");
const timeElement = document.querySelector("#time");
const scoreElement = document.querySelector("#score");

const cols = Math.floor(board.clientWidth/blockwidth);
const rows = Math.floor(board.clientHeight/blockheight);
const blocks = [];
let snake = [{
    x:1,y:3
}];


let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let elapsedSeconds = 0;

highScoreElement.innerText = highScore;

let direction = "down";

let intervalId =null;
let timerIntervalId = null;

let food = {x: Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};

for( let row=0 ; row < rows  ; row++){
    for( let col=0 ; col <cols ; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
};

function render(){
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === "left"){
        head= {x: snake[0].x , y: snake[0].y-1};
    }
    else if (direction === "right"){
        head= {x: snake[0].x , y: snake[0].y+1};
    }
    else if (direction === "down"){
        head= {x: snake[0].x+1 , y: snake[0].y};
    }else if (direction === "up"){
        head= {x: snake[0].x-1 , y: snake[0].y};
    };

    // wall collision logic
    if(head.x <0 || head.x>= rows || head.y <0 || head.y>=cols){
        clearInterval(intervalId);
        clearInterval(timerIntervalId);

        modal.style.display= "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    //food consume logic
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score +=10;
        scoreElement.innerText = score;
        if(score > highScore){
            highScore = score;
            localStorage.setItem("high score",highScore);
        }
    }

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
};

startButton.addEventListener("click",()=>{
    modal.style.display="none";
    intervalId=setInterval(()=>{render();},300);
    startTimer();
});

restartButton.addEventListener("click",restartGame);

function startTimer(){
    timerIntervalId = setInterval(() =>{
        elapsedSeconds += 1;
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        timeElement.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    },1000);
}

function restartGame(){
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    }); 

    score=0;
    elapsedSeconds=0;

    scoreElement.innerText = score;
    timeElement.innerText = "00:00";
    highScoreElement.innerText = highScore;

    modal.style.display="none";
    direction="down";
    snake = [{x:1,y:3}];
    food = {x: Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
    intervalId=setInterval(()=>{render();},400);
    startTimer();

};

addEventListener("keydown" , (event)=>{
    if(event.key === "ArrowUp"){
        direction= "up";
    }
    else if(event.key === "ArrowDown"){
        direction = "down";
    }
    else if(event.key === "ArrowLeft"){
        direction = "left";
    }
    else if(event.key === "ArrowRight"){
        direction = "right";
    }
});