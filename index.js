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

//create event listeners for each tile
tileElements.forEach(({cardContainer, cardBackside, cardFront}) => {
    let unrevealedCard = true; //toggle between states

    cardContainer.addEventListener("click", () => {
        if (!cardContainer.classList.contains("animation")) {
            cardContainer.classList.remove("animation"); //remove the animation if it's running to start it all over again in case of double-clicks
        } 

        if (unrevealedCard) {
            cardContainer.removeChild(cardBackside);
            cardContainer.appendChild(cardFront);
        } else {
            cardContainer.removeChild(cardFront);
            cardContainer.appendChild(cardBackside);
        }

        unrevealedCard = !unrevealedCard //this will make sure that if it's true, it'll change to false and viceversa

        //add animation class to start animation
        cardContainer.classList.add("animation"); //i got this animation from a css animation builder

        //remove it so the class is added and the animation triggered every time there's a click. the delay time matches the duration of the animation (0.75s)
        setTimeout(() => {
            cardContainer.classList.remove("animation")
        }, 750);
    })
})