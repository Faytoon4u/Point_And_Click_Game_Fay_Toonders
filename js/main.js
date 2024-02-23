document.getElementById("mainTitle").innerText =
  "Point and Click adventure game";


//Game window reference
const gameWindow = document.getElementById("gameWindow");

//Game State
gameState = {
  inventory: [],
  coinPickedUp: false,
};

//Inventory
let inventory = [];
console.log(inventory);
const inventoryList = document.getElementById("inventoryList");
//Main Character
const mainCharacter = document.getElementById("hero");
const offsetCharacter = 16;
const tree1 = document.getElementById("squareTree");

gameWindow.onclick = function (e) {
  var rect = gameWindow.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;

  if (e.target.id !== "heroImage") {
    mainCharacter.style.left = x - offsetCharacter + "px";
    mainCharacter.style.top = y - offsetCharacter + "px";
  }

  switch (e.target.id) {
    case "squareTree":
      tree1.style.opacity = 0.5;
    case "key":
      console.log("pick up key");
      changeInventory("key", "add");
      document.getElementById("key").remove();
      break;
    case "well":
      if (gameState.coinPickedUp == false) {
        changeInventory("coin", "add");
        gameState.coinPickedUp = true;
      } else {
        console.log("There are no more coins in this well!!");
      }
      break;
    case "doorWizardHut":
      if (checkItem("key")) {
        console.log("I opend the door. Yeah!");
      } else if (checkItem("coin")) {
        changeInventory("coin", "remove");
        console.log(
          "Oh no i lost het coin and I didn't open the door... I feel kinda stupid!"
        );
      } else {
        console.log("Fuck the door is locked. I don't have the key!");
      }
      break;
    case "statue":
      {
        console.log(
          "heey you.... wanna know where the key is?? It is by the graves. Good luck looking."
        );
      }
      break;
    default:
      break;
  }
  /**
   * Add or remove item from inventory.
   * @param {string} itemName
   * @param {string} action
   */
  function changeInventory(itemName, action) {
    if (itemName == null || action == null) {
      console.error("wrong parameters given to changeInventory()");
      return;
    }

    switch (action) {
      case "add":
        gameState.inventory.push(itemName);
        break;
      case "remove":
        gameState.inventory = gameState.inventory.filter(function (newInventory) {
          return newInventory !== itemName;
        });
        document.getElementById("inv-" + itemName).remove();
        break;
    }
    updateInventory(gameState.inventory, inventoryList);
  }

  /**
   * checks if the value exists within the array
   * if not then it adds value to the array and use showItem function
   * @param {string} itemName
   * @param {string} itemId
   */

  function getItem(itemName, itemId) {
    if (!checkItem(itemName)) {
      inventory.push(itemName);
      showItem(itemName, itemId);
    }
    console.log(inventory);
  }

  /**
   * removes item from array and the inventory
   * @param {string} itemName
   * @returns
   */
  function checkItem(itemName) {
    return gameState.inventory.includes(itemName);
  }

  function updateInventory(inventory, inventoryList) {
    inventoryList.innerHTML = "";
    inventory.forEach(function (item) {
      const inventoryItem = document.createElement("li");
      inventoryItem.id = "inv-" + item;
      inventoryItem.innerText = item;
      inventoryList.appendChild(inventoryItem);
    });
  }
};