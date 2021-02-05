let cvs = document.getElementById("canvas"); // Выбор элемента canvas по id
let ctx = cvs.getContext("2d"); // Описание типа графики

// Изображения
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeDown = new Image();
let gameOver = new Image();

// Звуковые файлы 
let score_audio = new Audio();

// Указание путей к изображениям и аудио
bird.src = "img_2/bird.png";
bg.src = "img_2/background_long.png";
fg.src = "img_2/ground_long.png";
pipeUp.src = "img_2/tube1.png";
pipeDown.src = "img_2/tube2.png";
gameOver.src = "img_2/game_over.jpg";
score_audio.src = "audio/score.mp3";

// Параметры
const SPAWN_POINT_X = 931;
const SCORE_POINT_X = 1;
let isStarted = false;

// Обработка нажатий 
document.addEventListener("keydown", moveUp);

// Функция для обработки нажатий 
function moveUp() {
	yPos -= 30;
}

// Пауза
document.addEventListener("keydown", function(pause){
	if (pause.code === "KeyP") {
		alert('Pause');
	}
});

// Создание препятствий pipeUp и pipeDown 
// (pipe - массив, хранящий в себе координаты препятствий)
let pipe = [];

pipe[0] = {
	x : cvs.width,
	y : 0
};

// Переменная gap - определяет расстояние между pipeUp и pipeDown
let gap = 100;

//Позиция объекта bird
let xPos = 10;
let	yPos = 150;

let	grav = 2.65; // изменение координаты Y
let score = 0;	// счет
let step = 2; // изменение координаты X

function drawInterface(score) {
	//Дорисовка интерфейса Счета и Рекорда(localstorage)
	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Score:" + score, 10, cvs.height - 50);

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Record:" + localStorage.getItem('record_fb'), 10, cvs.height - 25);
}

function isGameOver(currentPipe) {
		// касание препятствия
	return xPos + bird.width >= currentPipe.x
		&& xPos <= currentPipe.x + pipeUp.width
		&& (yPos <= currentPipe.y + pipeUp.height || yPos + bird.height >= currentPipe.y + pipeUp.height + gap)
		// касание земли
		|| yPos + bird.height >= cvs.height - fg.height;
}

function checkScore(score) {
	if (score > localStorage.getItem('record_fb')) {
		localStorage.setItem('record_fb', score);
	}
}

function drawGame() {
	// отрисовка фона
	ctx.drawImage(bg , 0, 0);

	// цикл с помощью которого отрисовываются и передвигаются препятствия
	for (let i = 0; i < pipe.length; i++) {

		  // отрисовка препятствий pipeUp и pipeDown
		  ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    	  ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    	  // изменение координаты x препятствий
    	  pipe[i].x -= step;

    	  // условие появления новых препятствий
    	  if (pipe[i].x === SPAWN_POINT_X) {
    	  	pipe.push({
    	  		x : cvs.width,
    	  		y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    	  	});
    	  }

    	// условие game over'a (касание препятствия или пола)
    	if (isGameOver(pipe[i])) {
			    step = 0;
			    ctx.drawImage(gameOver, 0, 0, cvs.width, cvs.height);
			    return alert(`Game over! Your score: ${score}. Press F5 to restart.`);
		}

		// условие увеличения счета
		if (pipe[i].x === SCORE_POINT_X) {
			score++;
			score_audio.play();
		}
 	}

	// отрисовка объектов пола и птицы
	ctx.drawImage(bird, xPos, yPos);
	ctx.drawImage(fg, 0, cvs.height - fg.height );

    // проверка на рекорд
	checkScore(score);

	// увеличение координаты y для имитации гравитации
	yPos += grav;

	drawInterface(score);
	requestAnimationFrame(drawGame);
}

// Пока не загрузится изображение tube2.png не загрузится страница
window.onload = drawGame;

