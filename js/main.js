document.getElementById("mainTitle").innerText = "Point and Click adventure game";
// Game State
let gameState = {
    "inventory": [],
    "coinPickedUp": false,
    "keyPickedUp": false
}

// reset savegame. comment this out to use savegame:
localStorage.removeItem("gameState");

// does browser understand localSorage?
if (Storage) {
    // anything already saved?
    if (localStorage.gameState) {
        // load savegame
        // uses localStorage gamestate string and convert it into an object. then store it into gameState.
        gameState =  JSON.parse(localStorage.gameState); 

    } else {
        //create savegame
        // convert local object variable to a string. then store it into localstorage
        localStorage.setItem("gameState", JSON.stringify(gameState))
    }

   
}
//Game window reference
const gameWindow = document.getElementById("gameWindow");
const inventoryList = document.getElementById("inventoryList");
const sec = 1000;

//Main Character
const mainCharacter = document.getElementById("hero");
const offsetCharacter = 16;
const dog = document.getElementById("dog");

//speech bubbles
const heroSpeech = document.getElementById("heroSpeech");
const counsterSpeech = document.getElementById("counterSpeech");
const dogSpeech = document.getElementById("dogSpeech");
//audio for dialog
const heroAudio = document.getElementById("heroAudio");
const counterAudio = document.getElementById("counterAudio");
const dogAudio = document.getElementById("dogAudio");

//avatar
const counterAvatar = document.getElementById("counterAvatar");

//Objects
const tree1 = document.getElementById("squareTree");

// change stuff according to gamestate
if(gameState.keyPickedUp) {
    document.getElementById("key").remove();
}


updateInventory(gameState.inventory, inventoryList);
gameWindow.onclick = function (e) {
    var rect = gameWindow.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    //TODO: calc offset based on character size
    //TODO: making dialog functionality

    if (
        counsterSpeech.style.opacity == 0 &&
       // dogSpeech.style.opacity == 0 &&
        heroSpeech.style.opacity == 0
      ) {
        if (e.target.id !== "heroImage") {
            mainCharacter.style.left = x - offsetCharacter + "px";
            mainCharacter.style.top = y - offsetCharacter + "px";
        }
        switch (e.target.id) {
            case "key":
                console.log("pick up key")

                document.getElementById("key").remove();

                changeInventory('key', "add",'chest');

                gameState.keyPickedUp = true

                saveGameState(gameState);

                break;



         
           
            break;
            case "well":
                if (gameState.coinPickedUp == false) {
                    changeInventory("coin", "add",'chest');
                    gameState.coinPickedUp = true;
                } else {
                    console.log("There are no more coins in this well!");
                }
                break;
            case "doorWizardHut":
                if (checkItem("key")) {
                    showMessage(heroSpeech, "I opened the door. Yeah!", heroAudio);
                    //console.log("I opened the door. Yeah!");
                } else if (checkItem("coin")) {
                    changeInventory("coin", "remove");
                    showMessage(heroSpeech, "Oh no I lost the coin and it didn't open the door.. Feel kinda stupid..", heroAudio);
                    //console.log("Oh no I lost the coin and it didn't open the door.. Feel kinda stupid..");
                } else {
                    showMessage(heroSpeech, "Fuck this door is locked and I don't have a key. boohoo :(", heroAudio);
                    //console.log("Fuck this door is locked and I don't have a key. boohoo :(");
                }
                break;
            case "statue":
                showMessage(heroSpeech, "Hey a snowman.. Looks okay.", heroAudio);
                setTimeout(function () { counterAvatar.style.opacity = 1; }, 4 * sec);
                setTimeout(showMessage, 4.1 * sec, counsterSpeech, "I can talk you know..", counterAudio);
                setTimeout(showMessage, 8.1 * sec, heroSpeech, "Wait what? That's not normal", heroAudio);
                setTimeout(showMessage, 12.1 * sec, counsterSpeech, "Just shut up.. You want a key.. Check the forest.", counterAudio);
                setTimeout(function () { counterAvatar.style.opacity = 0; }, 16 * sec);
                //console.log("hey you.. wanna know where the key is? It's by the graves.");
                break;
            case "dog":
                showMessage(heroSpeech, "Hey a cute little doggie.", heroAudio);
                setTimeout(function () {dogAvatar.style.opacity = 1; }, 4 * sec);
                setTimeout(showMessage,0.1 * sec, dogSpeech,"woef woef woef ",
                  dogAudio
                );
                setTimeout(
                  showMessage,
                  0.1 * sec,
                  heroSpeech,
                  "oh i think i scared him..",
                  heroAudio
                );
                setTimeout(
                showMessage,2 * sec,dogSpeech,"woef woef",dogAudio);
                setTimeout(showMessage,3 * sec,heroSpeech,"now he is running away.",heroAudio);
                setTimeout(function () {
                  dogAvatar.style.opacity = 0;
                  dog.style.opacity = 0;
                }, 2 * sec);

               
            default:
                break;
        }
    }
}



/**
 * Add or remove item in inventory
 * @param {string} itemName 
 * @param {string} action 
 */
// function changeInventory(itemName, action) {
//     if (itemName == null || action == null) {
//         console.error("Wrong parameters given to changeInventory()");
//         return;
//     }
function changeInventory(itemName, action, imageId) {
    if (itemName == null || action == null || imageId == null) {
        console.error("Wrong parameters given to changeInventory()");
        return;
    }

    switch (action) {
        case 'add':
            gameState.inventory.push(itemName);
            break;
        case 'remove':
            gameState.inventory = gameState.inventory.filter(function (newInventory) {
                return newInventory !== itemName;
            });
            document.getElementById("inv-" + itemName).remove();
            break;

    }
    updateInventory(gameState.inventory, inventoryList);

    if (imageId) {
        document.getElementById(imageId).style.opacity = '0';
    }


    switch (action) {
        case 'add':
            gameState.inventory.push(itemName);
            break;
        case 'remove':
            gameState.inventory = gameState.inventory.filter(function (newInventory) {
                return newInventory !== itemName;
            });
            document.getElementById("inv-" + itemName).remove();
            break;

    }
    updateInventory(gameState.inventory, inventoryList);
}

/**
 * This returns string value if it exist within the array
 * @param {string} itemName 
 * @returns 
 */
function checkItem(itemName) {
    return gameState.inventory.includes(itemName);
}

function updateInventory(inventory, inventoryList) {
    inventoryList.innerHTML = '';
    inventory.forEach(function (item) {
        const inventoryItem = document.createElement("li");
        inventoryItem.id = 'inv-' + item;
        inventoryItem.innerText = item;
        inventoryList.appendChild(inventoryItem);
    })
}

/**
 * It will show dialog and trigger sound.
 * @param {getElementById} targetBubble 
 * @param {string} message
 * @param {getElementById} targetSound 
 */
function showMessage(targetBubble, message, targetSound) {
    targetSound.currentTime = 0;
    targetSound.play();
    targetBubble.innerText = message;
    targetBubble.style.opacity = 1;
    setTimeout(hideMessage, 4 * sec, targetBubble, targetSound);
}

/**
 * Hides message and pauze the audio
 * @param {getElementById} targetBubble 
 * @param {getElementById} targetSound 
 */
function hideMessage(targetBubble, targetSound) {
    targetSound.pause();
    targetBubble.innerText = "...";
    targetBubble.style.opacity = 0;

}

function saveGameState(gameState){
    localStorage.gameState = JSON.stringify(gameState);
}

