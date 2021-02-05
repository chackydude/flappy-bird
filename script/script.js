import { config } from "./config.js";

let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d"); // graphs. type

// images
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeDown = new Image();
let gameOver = new Image();

// audio
let score_audio = new Audio();

bird.src = "desktop/bird.png";
bg.src = "desktop/background.png";
fg.src = "desktop/ground.png";
pipeUp.src = "desktop/tube1.png";
pipeDown.src = "desktop/tube2.png";
gameOver.src = "desktop/game-over.jpg";
score_audio.src = "audio/score.mp3";

// first barrier
config.pipe[0] = {
	x : cvs.width,
	y : 0
};

// pause
document.addEventListener("keydown", function(pause){
	if (pause.code === "KeyP") {
		alert('Pause');
	}
});

document.addEventListener("keydown", moveUp);

function moveUp() {
	config.yPos -= 30;
}

function drawInterface(score) {
	// score
	ctx.fillStyle = "#000";
	ctx.font = "26px Consolas";
	ctx.fillText("Score:" + score, 10, cvs.height - 50);

	// record
	ctx.fillStyle = "#000";
	ctx.font = "26px Consolas";
	ctx.fillText("Record:" + localStorage.getItem('record_fb'), 10, cvs.height - 25);
}

function isGameOver(currentPipe) {
	// barrier touch
	return config.xPos + bird.width >= currentPipe.x
		&& config.xPos <= currentPipe.x + pipeUp.width
		&& (config.yPos <= currentPipe.y + pipeUp.height || config.yPos + bird.height >= currentPipe.y + pipeUp.height + config.gap)
		// ground touch
		|| config.yPos + bird.height >= cvs.height - fg.height;
}

function checkScore(score) {
	if (score > localStorage.getItem('record_fb')) {
		localStorage.setItem('record_fb', score);
	}
}

function drawGame() {
	// background
	ctx.drawImage(bg , 0, 0);

	// drawing all barriers
	for (let i = 0; i < config.pipe.length; i++) {

		  // drawing pipeUp & pipeDown
		  ctx.drawImage(pipeUp, config.pipe[i].x, config.pipe[i].y);
    	  ctx.drawImage(pipeDown, config.pipe[i].x, config.pipe[i].y + pipeUp.height + config.gap);

    	  // changing OX coordinate of barrier
		  config.pipe[i].x -= config.step;

    	  // condition of spawning new barrier
    	  if (config.pipe[i].x === config.SPAWN_POINT_X) {
			  config.pipe.push({
    	  		x : cvs.width,
    	  		y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    	  	});
    	  }

    	// game over condition
    	if (isGameOver(config.pipe[i])) {
				config.step = 0;
			    ctx.drawImage(gameOver, 0, 0, cvs.width, cvs.height);
			    return alert(`Game over! Your score: ${config.score}. Press F5 to restart.`);
		}

		// score increase condition
		if (config.pipe[i].x === config.SCORE_POINT_X) {
			config.score++;
			score_audio.play();
		}
 	}

	// floor & bird
	ctx.drawImage(bird, config.xPos, config.yPos);
	ctx.drawImage(fg, 0, cvs.height - fg.height );

    // record check
	checkScore(config.score);

	// changing OY coordinate of bird
	config.yPos += config.grav;

	drawInterface(config.score);
	requestAnimationFrame(drawGame);
}

// run
window.onload = drawGame;

