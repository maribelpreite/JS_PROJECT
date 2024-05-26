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

const feelingsPairs = []; //this is to shuffle the cards internally

for (const feeling in feelingsImgLink) {
feelingsPairs.push(feeling, feeling); //this is to have each feeling twice in an array that will be shuffled later
}

//create each tile
function buildTile (feeling) {
    const card = document.createElement("img");
    card.src = "images/square_backside_pattern.png"

    card.classList.add("card");
    card.setAttribute("data-feeling", feeling) // this is to know which feeling is asigned to the card, whether it is revealed or not
    tilesContainer.appendChild(card); //maybe we need to get this out of the function & put it in the for loop

    let unrevealedCard = true; //toggle between states
    card.addEventListener("click", () => {
        if (unrevealedCard) {
            card.src = feelingsImgLink[feeling];
            unrevealedCard = false;
            
        } else {
            card.src = "images/square_backside_pattern.png";
            unrevealedCard = true;
            
        }

        //add animation no matter the click
        card.classList.add("animation"); //i got this animation from a css animation builder 

        //remove it so the class is added and the animation triggered every time there's a click. the delay time matches the duration of the animation (0.75s)
        setTimeout(() => {
            card.classList.remove("animation")
        }, 750);
    })
}

//tiles shuffling & access to images
const tilesCount = feelingsPairs.length;

for (let i=0; i<tilesCount; i++) { //tilesCount has to be here before the feelingsPairs.length changes
    const randomIndex = Math.floor(Math.random() * feelingsPairs.length); //this number has to depend directly on the length
    const feeling = feelingsPairs[randomIndex];

    feelingsPairs.splice(randomIndex, 1);

    buildTile(feeling);
}