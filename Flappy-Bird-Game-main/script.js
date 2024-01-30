let move_speed = 3,
   gravity = 0.3;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
// let sound_point = new Audio("sounds effect/point.mp3");
// let sound_die = new Audio("sounds effect/die.mp3");

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

let isJumping = false;

document.body.addEventListener("touchstart", function (e) {
    console.log("Ты тапнул по экрану!");
 
    if (e.touches.length > 0 && game_state != "Play") {
       document.querySelectorAll(".pipe_sprite").forEach((elem) => {
          elem.remove();
       });
       img.style.display = "block";
       bird.style.top = "20vh";
       game_state = "Play";
       message.innerHTML = "";
       score_title.innerHTML = "Score : ";
       score_val.innerHTML = "0";
       message.classList.remove("messageStyle");
       play();
    }
 
    if (e.touches.length > 0) {
       isJumping = true;
       img.src = "images/DRAKON_LITTLE_2.png";
    }
 });
 
 document.addEventListener("touchend", (e) => {
      img.src = "images/DRAKON_LITTLE_1.png";
 });
 

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyPress);

function handleKeyPress(e) {
   if (e.type === "keydown") {
      if ((e.key == "Enter" || e.key == " ") && game_state != "Play") {
         document.querySelectorAll(".pipe_sprite").forEach((e) => {
            e.remove();
         });
         img.style.display = "block";
         bird.style.top = "20vh";
         game_state = "Play";
         message.innerHTML = "";
         score_title.innerHTML = "Score : ";
         score_val.innerHTML = "0";
         message.classList.remove("messageStyle");
         play();
      }

      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = true;
         img.src = "images/DRAKON_LITTLE_2.png";
      }
   } else if (e.type === "keyup") {
      if (e.key == "ArrowUp" || e.key == " ") {
         isJumping = false;
         img.src = "images/DRAKON_LITTLE_1.png";
      }
   }
}

function play() {
   function move() {
      if (game_state != "Play") return;

      let pipe_sprite = document.querySelectorAll(".pipe_sprite");
      pipe_sprite.forEach((element) => {
         let pipe_sprite_props = element.getBoundingClientRect();
         bird_props = bird.getBoundingClientRect();

         if (pipe_sprite_props.right <= 0) {
            element.remove();
         } else {
            if (
               bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
               bird_props.left + bird_props.width > pipe_sprite_props.left &&
               bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
               bird_props.top + bird_props.height > pipe_sprite_props.top
            ) {
               game_state = "End";
               message.innerHTML = "Game Over".fontcolor("red") + "<br>Press Enter or Space To Restart";
               message.classList.add("messageStyle");
            //    sound_die.play();
               return;
            } else {
               if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == "1") {
                  score_val.innerHTML = +score_val.innerHTML + 1;
                //   sound_point.play();
               }
               element.style.left = pipe_sprite_props.left - move_speed + "px";
            }
         }
      });
      requestAnimationFrame(move);
   }
   requestAnimationFrame(move);

   let bird_dy = 0;
   function apply_gravity() {
      if (game_state != "Play") return;
      bird_dy = bird_dy + gravity;

      if (isJumping) {
         img.src = "images/DRAKON_LITTLE_2.png";
         bird_dy = -5;
         isJumping = false;
      }

      if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
         game_state = "End";
         message.style.left = "28vw";
         window.location.reload();
         message.classList.remove("messageStyle");
         return;
      }

      bird.style.top = bird_props.top + bird_dy + "px";
      bird_props = bird.getBoundingClientRect();
      requestAnimationFrame(apply_gravity);
   }
   requestAnimationFrame(apply_gravity);

   let pipe_separation = 5;
   let pipe_gap = 65;

   function create_pipe() {
      if (game_state != "Play") return;

      setInterval(() => {
         if (pipe_separation > 200) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement("div");
            pipe_sprite_inv.className = "pipe_sprite";
            pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
            pipe_sprite_inv.style.left = "100vw";

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement("div");
            pipe_sprite.className = "pipe_sprite";
            pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
            pipe_sprite.style.left = "100vw";
            pipe_sprite.increase_score = "1";

            document.body.appendChild(pipe_sprite);
         }
         pipe_separation++;
      }, 20); //  Как часто вызывать колонны
   }
   requestAnimationFrame(create_pipe);
}
