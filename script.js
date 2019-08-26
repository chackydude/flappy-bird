var cvs = document.getElementById("canvas"); // Выбор элемента canvas по id
var ctx = cvs.getContext("2d"); // Описание типа графики

// Создание объектов, учавствущих в отображении

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeDown = new Image();

// Звуковые файлы 

var score_audio = new Audio();

//Указание путей к изображениям и аудио

bird.src = "img/bird.png";
bg.src = "img_2/background_long.png";
fg.src = "img_2/ground_long.png";
pipeUp.src = "img/tube1.png";
pipeDown.src = "img/tube2.png";

score_audio.src = "audio/score.mp3";
 
//Обработка нажатий 

document.addEventListener("keydown", moveUp);

// Функция для обработки нажатий 

function moveUp() {
	yPos -= 30;
};

//Создание препятствий pipeUp и pipeDown 
//(pipe - массив, хранящий в себе препятствия, 
//которые прошел объект bird)

var pipe = [];

pipe[0] = {
	x : cvs.width,
	y : 0
}

// Переменная gap - определяет расстояние между pipeUp и pipeDown

var gap = 100;

//Позиция объекта bird

var xPos = 10;	
var	yPos = 150;
var	grav = 2;
var score = 0;
function draw() {
	ctx.drawImage(bg , 0, 0);	
	
	// Цикл с помощью которого отрисовываются и передвигаются препятствия
	for (var i = 0; i < pipe.length; i++) {

		  //Отрисовка препятствий pipeUp и pipeDown
		  ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    	  ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    	  //Изменение координаты x препятствий 
    	  pipe[i].x--;

    	  //Условие появления новых препятствий
    	  if (pipe[i].x == 945) {
    	  	pipe.push({
    	  		x : cvs.width,
    	  		y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    	  	});
    	  }

    	//Условие game over'a (касание препятствия или пола)
    	if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
			location.reload();
		}

		//Условие увеличения счета
		if (pipe[i].x == 5) {
			score++;
			score_audio.play();
		}
		
	}
    
    //Условие записи нового рекорда
	if (score > localStorage.getItem('record_fb')) {
			localStorage.setItem('record_fb', score);
		};

	//Отрисовка объектов пола и птицы
	ctx.drawImage(fg, 0, cvs.height - fg.height );
	ctx.drawImage(bird, xPos, yPos);

	//Увеличение координаты y для имитации гравитации
	yPos += grav;
	
	//Дорисовка интерфейса Счета и Рекорда
	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Счет:" + score, 10, cvs.height - 50);

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Рекорд:" + localStorage.getItem('record_fb'), 10, cvs.height - 25);

	requestAnimationFrame(draw);
};

//Пока не загрузится изображение tube2.png не загрузится страница
pipeDown.onload = draw; 

