const bird = document.querySelector(".bird-container");

const bird1Img = document.querySelector(".bird");
const bird2Img = document.querySelector(".bird2");

let gravity = 0.3;
let pipe_gap = 55;
let move_speed = 0.01;
let firstRoundProcent = "%";
let ferstRoundVh = "vh";
let coffForTrain = 1;
let fixedMoveSpeed = move_speed * window.innerWidth;
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let losemessage = document.querySelector(".losemessage");
let winmessage = document.querySelector(".winmessage");
let counter = 0;
let idlevel = 0;

const trainingBtn = document.querySelector(".button__play_0");
const easyBtn = document.querySelector(".button__play_1");
const normalBtn = document.querySelector(".button__play_2");
const hardBtn = document.querySelector(".button__play_3");
const easyCount = document.querySelector(".button__count-1");
const normalCount = document.querySelector(".button__count-2");
const hardCount = document.querySelector(".button__count-3");

let game_state = "Start";
bird.style.display = "none";

let isJumping = false;
let isGameOver = false;
let stoneImages = ["KAMEN_4.webp", "KAMEN_5.webp", "KAMEN_6.webp", "KAMEN_7.webp"];

let gameData = {};
function saveToLocalStoragedefault() {
   gameData = { count1: 2, count2: 2, count3: 2, value1: false, value2: false, value3: false };
   localStorage.setItem("gameData", JSON.stringify(gameData));
}
function saveToLocalStorage() {
   localStorage.setItem("gameData", JSON.stringify(gameData));
}
function loadFromLocalStorage() {
   const storedData = localStorage.getItem("gameData");
   if (storedData !== null) {
      gameData = JSON.parse(storedData);
   } else {
      saveToLocalStoragedefault();
   }
}

document.addEventListener("DOMContentLoaded", function () {
   loadFromLocalStorage();

   // Устанавливаем значения текста счетчиков
   easyCount.textContent = gameData.count1 === 1 ? `${gameData.count1} попытка` : `${gameData.count1} попытки`;
   normalCount.textContent = gameData.count2 === 1 ? `${gameData.count2} попытка` : `${gameData.count2} попытки`;
   hardCount.textContent = gameData.count3 === 1 ? `${gameData.count3} попытка` : `${gameData.count3} попытки`;

   // Проверяем значения переменных value и изменяем src изображений
   if (gameData.value1) {
      document.querySelector(".button__img-1").src = "images/coin-card.png";
      easyBtn.classList.add("none");
      easyCount.textContent = "+300 баллов";
   }
   if (gameData.value2) {
      document.querySelector(".button__img-2").src = "images/coin-card.png";
      normalBtn.classList.add("none");
      normalCount.textContent = "+300 баллов";
   }
   if (gameData.value3) {
      document.querySelector(".button__img-3").src = "images/coin-card.png";
      hardBtn.classList.add("none");
      hardCount.textContent = "+300 баллов";
   }

   if (!gameData.value1 && gameData.count1 <= 0) {
      easyCount.textContent = "0 баллов";
      easyBtn.classList.add("none");
   }
   if (!gameData.value2 && gameData.count2 <= 0) {
      normalCount.textContent = "0 баллов";
      normalBtn.classList.add("none");
   }
   if (!gameData.value3 && gameData.count3 <= 0) {
      hardCount.textContent = "0 баллов";
      hardBtn.classList.add("none");
   }
});

document.body.addEventListener("touchstart", function (e) {
   console.log("Ты тапнул по экрану!");

   if (e.touches.length > 0 && game_state != "Play") {
      pipe_spriteArr.forEach((elem) => {
         elem.remove();
      });
   }

   if (e.touches.length > 0) {
      isJumping = true;
      dragonFlyAnimation();
   }
});

document.addEventListener("touchend", () => {
   dragonFlyAnimationDown();
});

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyPress);

function handleKeyPress(e) {
   if (e.type === "keydown") {
      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = true;
         dragonFlyAnimation();
      }
   } else if (e.type === "keyup") {
      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = false;
         dragonFlyAnimationDown();
      }
   }
}
const pipe_spriteArr = [];
function play() {
   isGameOver = false;
   bird.style.top = "30vh";

   function move() {
      if (game_state !== "Play") return;

      pipe_spriteArr.forEach((element) => {
         let pipe_sprite_props = element.getBoundingClientRect();
         bird_props = bird.getBoundingClientRect();

         if (pipe_sprite_props.right <= 0) {
            element.remove();
            // pipe_spriteArr.splice(pipe_spriteArr.indexOf(element), 1);
         } else {
            if (
               bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
               bird_props.left + bird_props.width > pipe_sprite_props.left &&
               bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
               bird_props.top + bird_props.height > pipe_sprite_props.top
            ) {
               game_state = "End";
               losemessage.classList.remove("none");
               if ((idlevel == 1 && gameData.count1 > 1) || (idlevel == 2 && gameData.count2 > 1) || (idlevel == 3 && gameData.count3 > 1)) {
                  losemessage.innerHTML = `<img class="modal-img" src="images/dragon-card.png" alt="" />Вы врезались, еще есть попытка, но попробуйте сначала на тренировке <button class="button__play" onclick="reload()">Закрыть</button>`;
               }
               isGameOver = true;
               console.log(gameData["count" + idlevel]);
               gameData["count" + idlevel] -= 1;
               console.log(gameData);
               saveToLocalStorage();

               return;
            }

            if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + fixedMoveSpeed >= bird_props.left && element.increase_score === "1") {
               counter += 1; // Увеличиваем значение counter на 1
               score_val.innerHTML = `${counter}/10`; // Обновляем значение в HTML
            }

            if (counter >= 1) {
               game_state = "End";
               if (idlevel == 0) {
                  winmessage.innerHTML = `<img class="modal-img" src="images/dragon-card.png" alt="" />Ты прошел тренировку <button class="button__play" onclick="reload()">Закрыть</button>`;
               }

               winmessage.classList.remove("none");
               bird.style.display = "none";
               isGameOver = true;
               gameData["value" + idlevel] = true;
               console.log(gameData);
               saveToLocalStorage();
            }

            element.style.left = pipe_sprite_props.left - fixedMoveSpeed + "px";
         }
      });
      bird_props = bird.getBoundingClientRect();

      requestAnimationFrame(move);
   }

   requestAnimationFrame(move);

   let bird_dy = 0;
   function apply_gravity() {
      if (game_state != "Play") return;
      bird_dy = bird_dy + gravity;

      if (isJumping) {
         dragonFlyAnimation();
         bird_dy = -6;
         isJumping = false;
      }

      if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
         game_state = "End";
         message.style.left = "28vw";
         losemessage.classList.remove("none");
         if ((idlevel == 1 && gameData.count1 > 1) || (idlevel == 2 && gameData.count2 > 1) || (idlevel == 3 && gameData.count3 > 1)) {
            losemessage.innerHTML = `<img class="modal-img" src="images/dragon-card.png" alt="" />
            Вы врезались, еще есть попытка, но попробуйте сначала на тренировке <button class="button__play" onclick="reload()">Закрыть</button>`;
         }
         isGameOver = true;
         console.log(gameData["count" + idlevel]);
         gameData["count" + idlevel] -= 1;
         console.log(gameData);
         saveToLocalStorage();
         return;
      }

      bird.style.top = bird_props.top + bird_dy + "px";
      bird_props = bird.getBoundingClientRect();
      requestAnimationFrame(apply_gravity);
   }
   requestAnimationFrame(apply_gravity);

   function create_pipe() {
      if (game_state != "Play") return;

      const testValue = () => {
         if (isGameOver) {
            clearInterval(pipeInterval);
         }
         pipe_separation = 0;

         let pipe_posi = Math.floor(Math.random() * 16) + 10;

         let pipe_sprite_inv = document.createElement("div");
         pipe_sprite_inv.className = "pipe_sprite";
         pipe_sprite_inv.style.top = pipe_posi * coffForTrain - 70 + ferstRoundVh;
         pipe_sprite_inv.style.left = "100vw";

         let pipe_sprite = document.createElement("div");
         pipe_sprite.className = "pipe_sprite";
         pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
         pipe_sprite.style.left = "100vw";
         pipe_sprite.increase_score = "1";

         let pipe_image_inv = document.createElement("img");
         let randomStoneImage = stoneImages[Math.floor(Math.random() * stoneImages.length)];
         pipe_image_inv.src = `images/stones/${randomStoneImage}`;
         pipe_image_inv.style.height = "120%";
         pipe_image_inv.style.position = "relative";
         pipe_image_inv.style.top = "-10%";
         pipe_sprite_inv.appendChild(pipe_image_inv);

         let pipe_image = document.createElement("img");
         let randomStoneImage2 = stoneImages[Math.floor(Math.random() * stoneImages.length)];
         pipe_image.src = `images/stones/${randomStoneImage2}`;
         pipe_image.style.height = "120%";
         pipe_image.style.position = "relative";
         pipe_image.style.bottom = "-10%";
         pipe_sprite.appendChild(pipe_image);

         document.body.appendChild(pipe_sprite_inv);
         document.body.appendChild(pipe_sprite);
         pipe_spriteArr.push(pipe_sprite_inv);
         pipe_spriteArr.push(pipe_sprite);
      };
      let pipeInterval = setInterval(testValue, 3000);
   }

   requestAnimationFrame(create_pipe);
}

function StartRound() {
   bird.style.display = "block";
   bird.style.top = "30vh";
   game_state = "Play";
   counter = 0;
   score_val.innerHTML = "0/10";
   message.classList.add("none");
   bird.style.opacity = 1;
   console.log(idlevel);
   play();
}

trainingBtn.addEventListener("click", () => {
   pipe_gap = 50;
   idlevel = 0;
   StartRound();
});

easyBtn.addEventListener("click", () => {
   pipe_gap = 70;
   ferstRoundVh = "%";
   coffForTrain = 0;
   idlevel = 1;
   StartRound();
});

normalBtn.addEventListener("click", () => {
   pipe_gap = 60;
   idlevel = 2;
   StartRound();
});

hardBtn.addEventListener("click", () => {
   pipe_gap = 45;
   idlevel = 3;
   StartRound();
});

function reload() {
   window.location.reload();
}

function resetGame() {
   isJumping = false;
   isGameOver = false;
   game_state = "Start";
}

function dragonFlyAnimation() {
   bird1Img.classList.add("none");
   bird2Img.classList.remove("none");
}
function dragonFlyAnimationDown() {
   bird1Img.classList.remove("none");
   bird2Img.classList.add("none");
}
