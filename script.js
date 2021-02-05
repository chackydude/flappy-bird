var cvs = document.getElementById("canvas"); // Выбор элемента canvas по id
var ctx = cvs.getContext("2d"); // Описание типа графики

// Изображения
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeDown = new Image();
var gameOver = new Image();

// Звуковые файлы 
var score_audio = new Audio();

// Указание путей к изображениям и аудио
bird.src = "img_2/bird.png";
bg.src = "img_2/background_long.png";
fg.src = "img_2/ground_long.png";
pipeUp.src = "img_2/tube1.png";
pipeDown.src = "img_2/tube2.png";
gameOver.src = "img_2/game_over.jpg";

score_audio.src = "audio/score.mp3";
 
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

// document.addEventListener("keydown", function(difficulty){
// 	if (difficulty.keyCode === 76) {
// 		level = prompt('Выберите уровень сложности (easy, medium, hard)','');
// 		localStorage.setItem('set-level', level);
//
// 		if (localStorage.getItem('set-level') == 'easy') {
// 			step = 2;
// 			grav = 2;
// 		};
//
// 		if (localStorage.getItem('set-level') == 'medium') {
// 			step = 3;
// 			grav = 2;
// 		};
//
// 		if (localStorage.getItem('set-level') == 'hard') {
// 			step = 4;
// 			grav = 2;
// 		};
// 	}
// });
// Проблема изменения уровня сложности заключается в том, что при различных step не всегда значение pipe[i].x будет равно 1

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

var	grav = 2.65; // изменение координаты Y
var score = 0;	// счет
var step = 2; // изменение координаты X
function draw() {
	ctx.drawImage(bg , 0, 0);	
	
	// Цикл с помощью которого отрисовываются и передвигаются препятствия
	for (var i = 0; i < pipe.length; i++) {

		  // Переменная step определяет на сколько изменится координата препятствия за одну итерацию

		  // Отрисовка препятствий pipeUp и pipeDown
		  ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    	  ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    	  // Изменение координаты x препятствий 
    	  pipe[i].x -= step;

    	  // Условие появления новых препятствий
    	  if (pipe[i].x === 931) { //945
    	  	pipe.push({
    	  		x : cvs.width,
    	  		y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    	  	});
    	  }

    	//Условие game over'a (касание препятствия или пола)
    	if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
			    // location.reload(); (старая версия)
			    step = 0;
			    // ctx.clearRect(0, 0, cvs.width, cvs.height); (старая версия)
			    ctx.drawImage(gameOver, 0, 0, cvs.width, cvs.height);
			    return alert(`Game over! Your score: ${score}. Press F5 to restart.`);
			}

		// Условие увеличения счета
		if (pipe[i].x === 1) {
			score++;
			score_audio.play();
		};

		// if ((score >= 1) && (score < 5)) {
		// 	step = 2.5;
		// 	grav = 3.25;
		// };

		// if ((score >= 5) && (score < 10)) {
		// 	step = 3;
		// 	grav = 3.75;
		// };
		// console.log(step, grav);
		// Проблема изменения уровня сложности заключается в том, что при различных step не всегда значение pipe[i].x будет равно 1
 	}

	//Отрисовка объектов пола и птицы
	ctx.drawImage(bird, xPos, yPos);
	ctx.drawImage(fg, 0, cvs.height - fg.height );
    
    //Условие записи нового рекорда
	if (score > localStorage.getItem('record_fb')) {
			localStorage.setItem('record_fb', score);
		};

	// Увеличение координаты y для имитации гравитации
	yPos += grav;
	
	//Дорисовка интерфейса Счета и Рекорда(localstorage)
	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Score:" + score, 10, cvs.height - 50);

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Record:" + localStorage.getItem('record_fb'), 10, cvs.height - 25);

	requestAnimationFrame(draw);
};

// Пока не загрузится изображение tube2.png не загрузится страница
pipeDown.onload = draw; 

