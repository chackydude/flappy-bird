import { config } from "./config.js";

// buffers
let gravBuffer = config.grav;
let stepBuffer = config.step;
let animationId;

// DOM elements
let cvs = document.querySelector(".field");
let ctx = cvs.getContext("2d"); // graphs. type

let userScoreElement = document.querySelector(".user-score-sheet__user-score");
let userRecordElement = document.querySelector(".user-score-sheet__user-record");
let tapButton = document.querySelector(".tap-button");

let pauseButton = document.querySelector(".pause-button");
let pauseWrapper = document.querySelector(".pause-wrapper");
let gameOverWrapper = document.querySelector(".game-over-wrapper");
let closeButtonPause = document.querySelector('.pause-window__close-pause-button');

let restartGameOverButton = document.querySelector('.game-over-menu__restart-button');
let restartPauseButton = document.querySelector('.pause-menu__restart-button');

// 20 - wrapper's margin-top, 100vh mobile bug
document.body.style.height = (document.documentElement.clientHeight.toString() - 20)+ 'px';

// images
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeDown = new Image();
let gameOver = new Image();

// audio
let score_audio = new Audio();

bird.src = "mobile/bird.png";
bg.src = "mobile/background.png";
fg.src = "mobile/ground.png";
pipeUp.src = "mobile/tube1.png";
pipeDown.src = "mobile/tube2.png";
gameOver.src = "desktop/game-over.jpg";
score_audio.src = "audio/score.mp3";

// first barrier
config.pipe[0] = {
	x : cvs.width,
	y : 0
};

// adding event listeners
// restart
closeButtonPause.addEventListener("click", resumeGame);
restartGameOverButton.addEventListener('click', () => {
	gameOverWrapper.style.display = 'none';
	restartGame();
});
restartPauseButton.addEventListener('click', () => {
	pauseWrapper.style.display = 'none';
	cancelAnimationFrame(animationId);
	restartGame();
});

// move up (mobile)
tapButton.addEventListener("click", moveUp);

// movu up (desktop)
document.addEventListener("keydown", moveUp);

function moveUp() {
	config.yPos -= 30;
}

// pause (desktop)
document.addEventListener("keydown", function(pause){
	if (pause.code === "KeyP") {
		alert('Pause');
	}
});

// pause (mobile)
pauseButton.addEventListener('click', pauseGame);

// game control
function pauseGame() {
	changePauseDialogVisibility();
	pauseAction();
}

function pauseAction() {
	config.grav = 0;
	config.step = 0;
}

function resumeGame() {
	changePauseDialogVisibility();
	resume();
}

function resume() {
	config.grav = gravBuffer;
	config.step = stepBuffer;
}

function restartGame() {
	config.step = stepBuffer;
	config.grav = gravBuffer;
	config.score = 0;
	config.pipe = [];
	config.xPos = 10;
	config.yPos = 150;
	config.pipe[0] = {
		x : cvs.width,
		y : 0
	};
	requestAnimationFrame(drawGame);
}

function changePauseDialogVisibility() {
	if (pauseWrapper.style.display === "grid") {
		pauseWrapper.style.display = "none";
	} else {
		pauseWrapper.style.display = "grid";
		pauseWrapper.style.placeItems = "center"
	}
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
		userRecordElement.innerText = `Record: ${localStorage.getItem('record_fb')} `;
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
    			// field view fix
				ctx.drawImage(bird, config.xPos, config.yPos);
				ctx.drawImage(fg, 0, cvs.height - fg.height );
				config.step = 0;
				gameOverWrapper.style.display = "grid";
				gameOverWrapper.style.placeItems = "center";
    			return;
    	}

		// score increase condition
		if (config.pipe[i].x === config.SCORE_POINT_X) {
			config.score++;
			score_audio.play();
			userScoreElement.innerText = `Score: ${config.score}`;
		}
 	}

	// floor & bird
	ctx.drawImage(bird, config.xPos, config.yPos);
	ctx.drawImage(fg, 0, cvs.height - fg.height );

    // record check
	checkScore(config.score);

	// changing OY coordinate of bird
	config.yPos += config.grav;

	userScoreElement.innerText = `Score: ${config.score}`;
	userRecordElement.innerText = `Record: ${localStorage.getItem('record_fb')} `;

	// drawInterface(config.score);
	animationId = requestAnimationFrame(drawGame);
}

// run
window.onload = drawGame;

