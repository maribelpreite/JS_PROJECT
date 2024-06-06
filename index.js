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

const feelingsPairs = Object.keys(feelingsImgLink).flatMap((feeling) => [feeling, feeling]); //implemented .map(), .filter() .forEach() and arrow function after js2 week 2 class

//elements shuffling
feelingsPairs.sort(() => Math.random() - 0.5); 

// create a grid based on the order of shuffled feelings & store the references to the dom elements in an array to create event listeners for each tile ------> (this was actually very difficult to understand especially bc as the array is created, it also executes the function and actually appends the cards to tilesContainer. I thought I needed make the function run first with feelingPairs.forEach((feeling) => buildTile(feeling)) and create an array afterwards to store the elements for each feeling, but if I do both, the website goes awkward)
const tileElements = feelingsPairs.map(feeling => buildTile(feeling));

//create each tile
function buildTile (feeling) {
    const cardContainer = document.createElement("div");
    cardContainer.setAttribute("data-feeling", feeling) // this is to know which feeling is asigned to the card, whether it is revealed or not -> MY PROBLEM IS THAT I CAN'T SEE THE ELEMENTS IN THE INSPECT SECTION :(
    tilesContainer.appendChild(cardContainer);

    const cardBackside = document.createElement("img");
    cardBackside.src = "images/square_backside_pattern.png";
    cardBackside.classList.add("card-image");
    cardContainer.appendChild(cardBackside);

    const cardFront = document.createElement("img")
    cardFront.src = feelingsImgLink[feeling];
    cardFront.classList.add("card-image");

    return {
        cardContainer,
        cardBackside,
        cardFront,
    }
}

//game status
let activeTile = null;
let awaitingMove = false;

//create event listeners for each tile
tileElements.forEach(({cardContainer, cardBackside, cardFront}) => {

    cardContainer.addEventListener("click", () => {
        if (awaitingMove) { //the little time window that checks similarities between 2 cards where tiles can't be nastily clicked
            return;
        }

        if (!cardContainer.classList.contains("animation")) {
            cardContainer.classList.remove("animation"); //remove the animation if it's running to start it all over again in case of double-clicks
        } 

        cardContainer.removeChild(cardBackside);
        cardContainer.appendChild(cardFront);

        //add animation class to start animation
        cardContainer.classList.add("animation"); //i got this animation from a css animation builder

        //remove it so the class is added and the animation triggered every time there's a click. the delay time matches the duration of the animation (0.75s)
        setTimeout(() => {
            cardContainer.classList.remove("animation")
        }, 750);

        if (!activeTile) { //this is to compare the second tile selected and find the match
            activeTile = cardContainer;
            return;
        }

        awaitingMove = true; //block the possibility of any movement when there's an active tile

        //we'll reach this point only if there's an active tile
        setTimeout(() => {
            //create variables to compare them and behave differently depending on the match
            const activeFeeling = activeTile.getAttribute("data-feeling");
            const currentFeeling = cardContainer.getAttribute("data-feeling");

            //if there isn't a match, flip both cards back
            if (activeFeeling !== currentFeeling) {
                activeTile.removeChild(activeTile.querySelector(".card-image"));
                activeTile.appendChild(cardBackside);

                cardContainer.removeChild(cardFront);
                cardContainer.appendChild(cardBackside);
            }

            //restate the game status
            activeTile = null;
            awaitingMove = false;
        }, 1000);
    })
})