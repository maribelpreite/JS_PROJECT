const tilesContainer = document.querySelector(".tiles");

//memotest images

const feelingsImgLink = {
    happy: "images/feelings/happy.png",
    sad: "images/feelings/sad.png", 
    angry: "images/feelings/angry.png",
    hungry: "images/feelings/hungry.png",
    thirsty: "images/feelings/thirsty.png",
    scared: "images/feelings/scared.png",
}

const feelingsPairs = Object.keys(feelingsImgLink).flatMap((feeling) => [feeling, feeling]); 

//elements shuffling
feelingsPairs.sort(() => Math.random() - 0.5); 

// create a grid based on the order of shuffled feelings & store the references to the dom elements in an array to create event listeners for each tile
const tileElements = feelingsPairs.map(feeling => buildTile(feeling));

//create each tile
function buildTile (feeling) {
    const cardContainer = document.createElement("div");
    cardContainer.setAttribute("data-feeling", feeling) // this is to know which feeling is asigned to the card
    tilesContainer.appendChild(cardContainer);

    const cardBackside = document.createElement("img");
    cardBackside.src = "images/square_backside_pattern.png";
    cardBackside.classList.add("card-image", "backside");
    cardContainer.appendChild(cardBackside);

    const cardFront = document.createElement("img")
    cardFront.src = feelingsImgLink[feeling];
    cardFront.classList.add("card-image", "frontside");
    cardContainer.appendChild(cardFront);

    return {cardContainer};
}

//game status
let activeTile = null;
let awaitingMove = false;

//create event listeners for each tile
tileElements.forEach(({cardContainer}) => {

    cardContainer.addEventListener("click", () => {
        if (awaitingMove || cardContainer.classList.contains("flipped")) { 
            return;
        }

        cardContainer.classList.add("flipped"); 

        if (!activeTile) { //this is to compare the second tile selected and find the match
            activeTile = cardContainer;
            return;
        }

        //we'll reach this point only if there's an active tile and we clicked the second
        awaitingMove = true; //block the possibility of any movement when we're comparing 2 tiles
        
        setTimeout(() => {
            //create variables to compare them and behave differently depending on the match
            const activeFeeling = activeTile.getAttribute("data-feeling");
            const currentFeeling = cardContainer.getAttribute("data-feeling");

            //if there isn't a match, flip both cards back
            if (activeFeeling !== currentFeeling) {
                activeTile.classList.remove("flipped");
                cardContainer.classList.remove("flipped");
            }

            //restate the game status
            activeTile = null;
            awaitingMove = false;
        }, 1000);
    })
})