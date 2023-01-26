// Reference all elements you'll be using: i.e Birds, Timer
let popUp = document.getElementsByClassName("popup")[0];
let startButton = popUp.children[5];
let scoreElement = document.querySelector("#score");
let timeLimitElement = document.querySelector("#time");
let birdsKilledElement = document.querySelector("#birdsKilled");
let birdContainer = document.querySelector(".birdContainer");
let endPopup = document.getElementsByClassName("Ending")[0];
let popupScore = document.getElementById("finalScore");
let losing = document.getElementsByClassName("lose-popup")[0];
let tryAgainBtn = losing.children[2];
let newGamebtn = endPopup.children[2];
let presentBomb;

let birdsPresent = new Array();
let score = 0; //Score Starts As Zero
let birdsKilled = 0; //Brids Killed Start Off As Zero
timeLimitElement.innerText = 60; // Timer Starts From 60
birdsKilledElement.innerText = birdsKilled;

window.onload = function () {
  startButton.onclick = function () {
    popUp.style.display = "none"; //Hiding The popup

    // Setting Date Of When Player Started The Game
    let currentDate= new Date().toJSON().slice(0,10);
    localStorage.setItem("date",currentDate);
   // console.log(currentDate);
    // Setting Timer For Every Second
    window.setInterval(() => {
      if (timeLimitElement.innerText != 0) {
        timeLimitElement.innerText -= 1;
      }
    }, 1000);

    //During the game you will move the birds every time for each second
    let spawningBirds = window.setInterval(() => {
      if (timeLimitElement.innerText == 0) {
        //Condition Of When Timer Goes Off
        //If Player Loses
        clearInterval(spawningBirds);
        if (score < 50) {
          losing.style.display = "block";
          tryAgainBtn.onclick = function () {
            window.location.reload();
          };
        }
        //If Player Wins
        else {
          popupScore.innerText = "Congratulations! Your Score Is " + score;
          endPopup.style.display = "block";
          newGamebtn.onclick = function () {
            window.location.reload();
          };
        }
        let finalScore=score;
        localStorage.setItem("score",finalScore);
        let lastPlayer=playerName;
        localStorage.setItem("lastName",lastPlayer);
      }

      // ------------- Birds Moving Algorithm ---------------------------------

      moveBirds();
      if ( presentBomb != undefined ) {
        moveBomb(presentBomb);
      }

      // ------------- Birds Moving Algorithm ---------------------------------

      //Randomizing whethter each second a bird should be spawned or not
      let birdElement;
      let spawnBird = Math.floor(Math.random() * 10);
      if (
        spawnBird == 1 ||
        spawnBird == 4 ||
        spawnBird == 7 ||
        spawnBird == 9
      ) {
        // --------------- Spawning Birds Algorithm ------------------------------

        let birdType = Math.floor(Math.random() * 10); //Randomizing Bird Type.
        if (birdType == 1 ) {
          birdElement = BirdFactory(BirdType.blue);
          birdContainer.append(birdElement);
        }

        if (birdType == 4) {
          birdElement = BirdFactory(BirdType.black);
          birdContainer.append(birdElement);
        }

        if (birdType == 6 || birdType == 7) {
          birdElement = BirdFactory(BirdType.white);
          birdContainer.append(birdElement);
        }
      }

      birdsKilledElement.innerText = birdsKilled; //Updating BirdsKilled Number Each Second
      scoreElement.innerText = score; //Updating Score Each Second

      // --------------- Spawning Birds Algorithm ------------------------------

      
    }, 100);

    ////BOMB DROP
    setInterval(() => {
      if(timeLimitElement.innerText !=0)
      {
        presentBomb = spawnBomb();
        document.body.append(presentBomb);
      }
    }, 15000);
  };
};


//function to move birds to the left
function moveBirds() {
  birdsPresent.forEach((birdDiv) => {
    let { left } = getComputedStyle(birdDiv); //finding out the current "left" of the bird
    birdDiv.style.left = `${parseInt(left) + 20}px`;
    // console.log(`${birdsPresent.length} is the size of the array and ${birdContainer.children.length} is the number of birds on screen`)
    if (parseInt(birdDiv.style.left) > window.innerWidth) {
      birdsPresent.remove(birdsPresent.indexOf(birdDiv));
      birdDiv.remove();
    }
  });
}

//Function To Move Bomb
function moveBomb(bomb) {
  let { top } = getComputedStyle(bomb); //finding out the current "top" of the bomb
  bomb.style.top = `${parseInt(top) + 15}px`;
  if( parseInt(bomb.style.top) > window.innerHeight) {
    bomb.remove();
    presentBomb=undefined;
  }
}

//Function To Make  A Bomb
function spawnBomb() {
  let bombImg = document.createElement("img");
  bombImg.src = "./assets/bomb.png";
  let bomb = document.createElement("div");
  bomb.append(bombImg);
  bomb.classList.add("bomb");
  let randomLocation = `${specialRandom(100, window.innerWidth)}px`;
  bomb.style.left = randomLocation
  bomb.onclick=function()
  {
    bomb.remove();
    birdsPresent.forEach(function(birdDiv) {
      birdDiv.click();

    })
  }
  return bomb;

}

//Function For Creating Birds
function BirdFactory(birdType) {
  let bird = document.createElement("div");
  let img = document.createElement("img");
  bird.append(img);

  birdsPresent.push(bird);
  img.classList.add("bird");
  bird.classList.add("birdContainer");
  bird.style.top = `${specialRandom(150, window.innerWidth)}px`;
  bird.id = `${birdsPresent.length}`;

  switch (birdType) {
    case BirdType.black:
      img.src = "./assets/blackBird.gif";
      bird.onclick = () => {
        score += 10;
        birdsKilled += 1;
        bird.remove();
      };
      break;

    case BirdType.blue:
      img.src = "./assets/blueBird.gif";
      bird.onclick = () => {
        score -= 10;
        birdsKilled += 1;
        bird.remove();
      };
      break;

    case BirdType.white:
      img.src = "./assets/whiteBird.gif";
      bird.onclick = () => {
        score += 5;
        birdsKilled += 1;
        bird.remove();
      };
      break;

    default:
      break;
  }

  return bird;
}

const BirdType = {
  black: "Black",
  blue: "Blue",
  white: "White",
};

//Code snippet to add remove function to arrays
Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//Create a random number divisible by a number
const specialRandom = (num = 1, limit = 1000000) => {
  let res;
  do {
    // getting a random number
    const random = Math.random() * limit;
    // rounding it off to be divisible by num
    res = Math.round(random / num) * num;
  } while (res < 150 || res > 600);

  return res;
};
