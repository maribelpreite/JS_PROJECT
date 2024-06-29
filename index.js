document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    game.addBtnListeners();
});

class Game {
    constructor() {
        this.maxMoves = 20; //default value
        this.maxTime = 60000; //default value
        this.movesCount = null;
        this.timer = null;
        this.activeTile = null;
        this.awaitingMove = false;
        this.revealedCount = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.feelingsPairs = null;
        this.feelingsImgLink = null;
    }

    async startGame() {
        try {
            const response = await fetch("https://raw.githubusercontent.com/maribelpreite/maribelpreite.github.io/main/data/feelings.json")
            if (!response.ok) throw new Error (`HTTP error! Status: ${response.status}`);
            
            this.feelingsImgLink = await response.json();
            this.feelingsPairs = Object.keys(this.feelingsImgLink).flatMap(feeling => [feeling, feeling]);

            this.createInteractiveShuffledGrid(this.feelingsPairs, this.feelingsImgLink);
        } catch (error) {
            console.error(`Error fetching data:`, error);
        }
    }

    createInteractiveShuffledGrid(array, object) {
        array.sort(() => Math.random() - 0.5);
        array.forEach(arrayItem => {
            const tile = new Tile(arrayItem, object[arrayItem], this);
            tile.addToDOM();
        });
    }

    addBtnListeners() {
        const startBtn = document.getElementById("start-game");
        startBtn.addEventListener("click", () => this.prepareGame());

        const resetBtns = document.querySelectorAll(".reset-button");
        resetBtns.forEach(button => {
            button.addEventListener("click", () => this.resetGame());
        });
    }

    prepareGame() {
        const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
        this.timer = document.getElementById("time-counter");

        if (selectedDifficulty === "easy") {
            this.maxMoves = 32;
            this.maxTime = 180000;
            this.timer.innerText = "3:00";
        } else if (selectedDifficulty === "medium") {
            this.maxMoves = 26;
            this.maxTime = 120000;
            this.timer.innerText = "2:00";
        } else if (selectedDifficulty === "hard") {
            this.maxMoves = 18;
            this.maxTime = 60000;
            this.timer.innerText = "1:00";
        }

        this.movesCount = document.getElementById("moves-counter");
        this.movesCount.innerText = this.maxMoves;

        this.transition(document.getElementById("difficulty-container"), document.getElementById("active-game-container"));
        this.startGame();
    }

    updateMovesCounter() {
        this.maxMoves--;
        this.movesCount.innerText = this.maxMoves;

        const numberOfTiles = this.feelingsPairs.length;
        if (this.maxMoves === 0 || this.maxMoves < (numberOfTiles - this.revealedCount)) {
            this.transition(document.getElementById("active-game-container"), document.getElementById("you-lost-msg"));
        }
    }

    updateRevealedCount() {
        this.revealedCount += 2;

        const numberOfTiles = this.feelingsPairs.length;
        if (this.revealedCount === numberOfTiles) {
            this.transition(document.getElementById("active-game-container"), document.getElementById("you-won-msg"));
        }
    }

    transition(toHide, toShow) {
        clearInterval(this.timerInterval);
        setTimeout(() => {
            toHide.classList.remove("show-container");
            toHide.classList.add("hide-container");
            toShow.classList.remove("hide-container");
            toShow.classList.add("show-container");
        }, 500);
    }

    startTimer() {
        this.startTime = new Date().getTime();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - this.startTime;
        const timeLeft = this.maxTime - elapsedTime;

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);

        if (timeLeft >= 0) {
            this.timer.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            this.transition(document.getElementById("active-game-container"), document.getElementById("you-lost-msg"));
        }
    }

    resetGame() {
        this.activeTile = null;
        this.awaitingMove = false;
        this.revealedCount = 0;
        clearInterval(this.timerInterval);
        this.startTime = null;

        const difficultyContainer = document.getElementById("difficulty-container");
        const gameContainer = document.getElementById("active-game-container");
        const youLostMsg = document.getElementById("you-lost-msg");
        const youWonMsg = document.getElementById("you-won-msg");

        difficultyContainer.classList.remove("hide-container");
        difficultyContainer.classList.add("show-container");

        gameContainer.classList.remove("show-container");
        gameContainer.classList.add("hide-container");

        youLostMsg.classList.remove("show-container");
        youLostMsg.classList.add("hide-container");

        youWonMsg.classList.remove("show-container");
        youWonMsg.classList.add("hide-container");

        const tilesContainer = document.querySelector(".tiles");
        tilesContainer.innerHTML = ``;
    }
}

class Tile {
    constructor(feeling, imgSrc, gameInstance) {
        this.feeling = feeling;
        this.imgSrc = imgSrc;
        this.game = gameInstance;
        this.cardContainer = this.createTile();
    }

    createTile() {
        const cardContainer = document.createElement("div");
        cardContainer.setAttribute("data-feeling", this.feeling);
        cardContainer.classList.add("card-container");

        const cardBackside = document.createElement("img");
        cardBackside.src = "images/square_backside_pattern.png";
        cardBackside.classList.add("card-image", "backside");

        const cardFront = document.createElement("img");
        cardFront.src = this.imgSrc;
        cardFront.classList.add("card-image", "frontside");

        cardContainer.append(cardBackside, cardFront);
        this.addEventListeners(cardContainer);
        return cardContainer;
    }

    addEventListeners(cardContainer) {
        cardContainer.addEventListener("click", () => {
            if (this.game.awaitingMove || cardContainer.classList.contains("flipped")) {
                return;
            }

            cardContainer.classList.add("flipped");

            if (!this.game.activeTile) {
                this.game.activeTile = cardContainer;
                this.game.updateMovesCounter();

                if (!this.game.startTime) {
                    this.game.startTimer();
                }
                return;
            }

            this.game.awaitingMove = true;
            this.game.updateMovesCounter();

            setTimeout(() => {
                const activeFeeling = this.game.activeTile.getAttribute("data-feeling");
                const currentFeeling = cardContainer.getAttribute("data-feeling");

                if (activeFeeling === currentFeeling) {
                    this.game.activeTile.classList.add("hidden");
                    cardContainer.classList.add("hidden");
                    this.game.updateRevealedCount();
                } else {
                    this.game.activeTile.classList.remove("flipped");
                    cardContainer.classList.remove("flipped");
                }

                this.game.activeTile = null;
                this.game.awaitingMove = false;
            }, 1000);
        });
    }

    addToDOM() {
        const tilesContainer = document.querySelector(".tiles");
        tilesContainer.appendChild(this.cardContainer);
    }
}
