/*This is the background game animation*/

const backgroundGrid = document.getElementById("tiles");

let columns = 0,
    rows = 0,
    tileStates = [];


// Updates the Boolean array tileStates if a tile is clicked
const handleOnClick = index => {
  tileStates[index] = !tileStates[index]; // Toggle state
  updateTileState(index);
}

//Creates a single tile, adds it to the div, and sets its click event to
// toggle the boolean state at the tile index of the array tileStates.
const createTile = index => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => handleOnClick(index);
  return tile;
}

/* Creates and append *quantity* amount of tiles to the div element tiles*/
const createTiles = quantity => {
  backgroundGrid.innerHTML = "";
  for (let index = 0; index < quantity; index++) {
    backgroundGrid.appendChild(createTile(index));
  }
}

const createGrid = () => {

  //Size of the tiles 
  const size = document.body.clientWidth > 800 ? 50 : 25;
  
  // Size of the grid layout
  columns = Math.floor(document.body.clientWidth / size);
  rows = Math.floor(document.body.clientHeight / size);
  
  // Pass dimensions to style sheet to create grid layout
  backgroundGrid.style.setProperty("--columns", columns);
  backgroundGrid.style.setProperty("--rows", rows);
  
  // Populate the grid initialize each respective boolean in
  // tileStates to false. 
  createTiles(columns * rows);
  tileStates = Array(columns * rows).fill(false); 

  /* Hardcoded prepopulated shapes */

  // Glider 
  tileStates[2]= true;
  tileStates[2 + columns]= true;
  tileStates[columns]= true;
  tileStates[2 + 2*columns]= true;
  tileStates[1+ 2*columns]= true;

  // Line
  tileStates[30 +30*columns]= true;
  tileStates[30 +29*columns]= true;
  tileStates[30 +28*columns]= true;
  tileStates[30 +27*columns]= true;
  tileStates[30 +26*columns]= true;
  tileStates[30 +25*columns]= true;
  tileStates[30 +24*columns]= true;

  // R-pentomino - Bottom
  tileStates[4 +35*columns]= true;
  tileStates[4 +36*columns]= true;
  tileStates[4 +37*columns]= true;
  tileStates[3 +36*columns]= true;
  tileStates[5 +35*columns]= true;

  // R-pentomino - Top
  tileStates[27 +5*columns]= true;
  tileStates[27 +6*columns]= true;
  tileStates[27 +7*columns]= true;
  tileStates[26 +6*columns]= true;
  tileStates[28 +5*columns]= true;

   updateTiles();

}

// Counts the live neighbours of a single cell
function getNeighbors(index){
  
  let liveNeighbors = 0;
  const row = Math.floor(index / columns);
  const col = index % columns;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the cell itself

      const newRow = (row + i + rows) % rows;
      const newCol = (col + j + columns) % columns;
      const neighborIndex = newRow * columns + newCol;

      if (tileStates[neighborIndex]) {
        liveNeighbors++;
      }
    }
  }

  return liveNeighbors;
}

/* Returns a boolean array of the next iteration of the game by looping over every cell, counting the live neighbours,
   and applying the rules: 
      less than 2 live neighbours => dies. 
      2 live nighbours => state remains the same.
      3 live neighbours: if living => remain living; if not living => become alive.
      3 or more => cell dies;
*/
function getNextState(){  

  newStates = tileStates.slice();

  for(i=0; i<tileStates.length; i++){
  
    let state = tileStates[i];
    let liveNeighbors = getNeighbors(i);

    if (state && (liveNeighbors < 2 || liveNeighbors > 3)) {
      newStates[i] = false; // Cell dies
    }
    if (!state && liveNeighbors === 3) {
      newStates[i] =  true; // Cell becomes alive
    }
  }
  return newStates;
}


function updateTiles() {

  for(i=0; i<tileStates.length; i++){
    updateTileState(i);
  }
}

/* Updates the appearance of the cell by appending or removing clicked from the tile element */
function updateTileState(index) {
  const tile = document.querySelectorAll('.tile')[index];
  if (tileStates[index]) {
    tile.classList.add('clicked');
  } else {
    tile.classList.remove('clicked');
  }
}

// Main loop. Updates model then view.
function gameLoop () {
  tileStates = getNextState();
  updateTiles();
}

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  setInterval(gameLoop, 1000); // Update every 1 second
});

window.onresize = () => createGrid();
