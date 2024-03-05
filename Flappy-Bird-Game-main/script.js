const bird = document.querySelector(".bird");
const img = document.getElementById("bird-1");

let gravity = 0;
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
// let score_title = document.querySelector(".score_title");

let game_state = "Start";
// img.style.display = "none";

let isJumping = false;
let isGameOver = false;
let stoneImages = ["KAMEN_4.webp", "KAMEN_5.webp", "KAMEN_6.webp", "KAMEN_7.webp"];

document.body.addEventListener("touchstart", function (e) {
   console.log("Ты тапнул по экрану!");

   if (e.touches.length > 0 && game_state != "Play") {
      pipe_spriteArr.forEach((elem) => {
         elem.remove();
      });
   }

   if (e.touches.length > 0) {
      isJumping = true;
      img.src = "images/DRAKON_LITTLE_2.webp";
   }
});

document.addEventListener("touchend", () => {
   img.src = "images/DRAKON_LITTLE_1.webp";
});

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyPress);

function handleKeyPress(e) {
   if (e.type === "keydown") {
      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = true;
         img.src = "images/DRAKON_LITTLE_2.webp";
      }
   } else if (e.type === "keyup") {
      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = false;
         img.src = "images/DRAKON_LITTLE_1.webp";
      }
   }
}
const pipe_spriteArr = [];
function play() {
   isGameOver = false;
   bird.style.top = "30vh";
   // let pipe_sprite = document.querySelectorAll(".pipe_sprite");

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
               isGameOver = true;
               return;
            }

            if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + fixedMoveSpeed >= bird_props.left && element.increase_score === "1") {
               score_val.innerHTML = +score_val.innerHTML + 1;
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
         img.src = "images/DRAKON_LITTLE_2.webp";
         bird_dy = -6;
         isJumping = false;
      }

      if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
         game_state = "End";
         message.style.left = "28vw";
         window.location.reload();
         return;
      }

      bird.style.top = bird_props.top + bird_dy + "px";
      bird_props = bird.getBoundingClientRect();
      requestAnimationFrame(apply_gravity);
   }
   requestAnimationFrame(apply_gravity);

   function create_pipe() {
      if (game_state != "Play") return;
      let pipe_separation = 0;

      const testValue = () => {
         if (isGameOver) {
            clearInterval(pipeInterval);
         }
         pipe_separation = 0;

         let pipe_posi = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

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
   }
   let pipeInterval = setInterval(testValue, 3000);
}

requestAnimationFrame(create_pipe);
}

function StartRound() {
   img.style.display = "block";
   bird.style.top = "30vh";
   game_state = "Play";
   score_val.innerHTML = "0";
   message.classList.add("none");
   img.style.opacity = 1;
   play();
}

const trainingBtn = document.querySelector("button:nth-of-type(1)");
const easyBtn = document.querySelector("button:nth-of-type(2)");
const normalBtn = document.querySelector("button:nth-of-type(3)");
const hardBtn = document.querySelector("button:nth-of-type(4)");

trainingBtn.addEventListener("click", () => {
   pipe_gap = 50;
   StartRound();
});

easyBtn.addEventListener("click", () => {
   gravity = 0.3;
   move_speed = 0.005;
   pipe_gap = 60;
   StartRound();
});

normalBtn.addEventListener("click", () => {
   gravity = 0.3;
   move_speed = 0.005;
   pipe_gap = 70;
   ferstRoundVh = "%";
   coffForTrain = 0;
   StartRound();
});

hardBtn.addEventListener("click", () => {
   gravity = 0.3;
   move_speed = 0.009;
   pipe_gap = 40;
   StartRound();
});

function goToMenu() {
   message.classList.remove("none");
   losemessage.classList.add("none");
   img.style.opacity = 0;
   resetGame();
   bird.style.top = "30vh";
   bird_props = bird.getBoundingClientRect();
}

function resetGame() {
   isJumping = false;
   isGameOver = false;
   game_state = "Start";
}

















// function create_pipe() {
//    if (game_state != "Play") return;
//    let pipe_separation = 0;

//    const renderTube = () => {
//       if (isGameOver) {
//          clearInterval(pipeInterval);
//       }
//       pipe_separation = 0;

//       let pipe_posi = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

//       let pipe_sprite_inv = document.createElement("div");
//       pipe_sprite_inv.className = "pipe_sprite";
//       pipe_sprite_inv.style.top = pipe_posi * coffForTrain - 70 + ferstRoundVh;
//       pipe_sprite_inv.style.left = "100vw";

//       let pipe_sprite = document.createElement("div");
//       pipe_sprite.className = "pipe_sprite";
//       pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
//       pipe_sprite.style.left = "100vw";
//       pipe_sprite.increase_score = "1";

//       // let pipe_image_inv = document.createElement("img");
//       // let randomStoneImage = stoneImages[Math.floor(Math.random() * stoneImages.length)];
//       // pipe_image_inv.src = `images/stones/${randomStoneImage}`;
//       // pipe_image_inv.style.height = "120%";
//       // pipe_image_inv.style.position = "relative";
//       // pipe_image_inv.style.top = "-10%";
//       // pipe_sprite_inv.appendChild(pipe_image_inv);

//       // let pipe_image = document.createElement("img");
//       // let randomStoneImage2 = stoneImages[Math.floor(Math.random() * stoneImages.length)];
//       // pipe_image.src = `images/stones/${randomStoneImage2}`;
//       // pipe_image.style.height = "120%";
//       // pipe_image.style.position = "relative";
//       // pipe_image.style.bottom = "-10%";
//       // pipe_sprite.appendChild(pipe_image);

//       document.body.appendChild(pipe_sprite_inv);
//       document.body.appendChild(pipe_sprite);
//       pipe_spriteArr.push(pipe_sprite_inv);
//       pipe_spriteArr.push(pipe_sprite);

//       // Move the pipes into view
//       setTimeout(() => {
//          pipe_sprite_inv.style.transition = "left 0s";
//          pipe_sprite.style.transition = "left 0s";
//          pipe_sprite_inv.style.left = "calc(100vw - 52px)";
//          pipe_sprite.style.left = "calc(100vw - 52px)";
//       }, 100);
//    };

//    let pipeInterval = setInterval(renderTube, 3000);
// }