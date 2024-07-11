const wrapper = document.getElementById("tiles");

let columns = 0,
    rows = 0,
    tileStates = [];

const toggle = () => {
  document.body.classList.toggle("toggled");
}

const handleOnClick = index => {
  toggle();
  tileStates[index] = !tileStates[index]; // Toggle state
  updateTileState(index);
}

const createTile = index => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => handleOnClick(index);
  return tile;
}

const createTiles = quantity => {
  wrapper.innerHTML = "";
  Array.from(Array(quantity)).map((tile, index) => {
    wrapper.appendChild(createTile(index));
  });
}

const createGrid = () => {
  const size = document.body.clientWidth > 800 ? 50 : 25;
  
  columns = Math.floor(document.body.clientWidth / size);
  rows = Math.floor(document.body.clientHeight / size);
  
  wrapper.style.setProperty("--columns", columns);
  wrapper.style.setProperty("--rows", rows);
  
  createTiles(columns * rows);
  tileStates = Array(columns * rows).fill(false); // Initialize the tile states
  tileStates[2]= true;
  tileStates[2 + columns]= true;
  tileStates[columns]= true;
  tileStates[2 + 2*columns]= true;
  tileStates[1+ 2*columns]= true;

  



  tileStates[30 +30*columns]= true;
  tileStates[30 +29*columns]= true;
  tileStates[30 +28*columns]= true;
  tileStates[30 +27*columns]= true;
  tileStates[30 +26*columns]= true;
  tileStates[30 +25*columns]= true;
  tileStates[30 +24*columns]= true;



  tileStates[4 +35*columns]= true;
  tileStates[4 +36*columns]= true;
  tileStates[4 +37*columns]= true;
  tileStates[3 +36*columns]= true;
  tileStates[5 +35*columns]= true;

  tileStates[27 +5*columns]= true;
  tileStates[27 +6*columns]= true;
  tileStates[27 +7*columns]= true;
  tileStates[26 +6*columns]= true;
  tileStates[28 +5*columns]= true;



 


  updateTiles(tileStates);
 



  // Initialize tile click events
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile, index) => {
    tile.onclick = () => handleOnClick(index);
  });
}

const getNeighborIndices = index => {
  const neighbors = [];
  const row = Math.floor(index / columns);
  const col = index % columns;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue; // Skip the current tile
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
        neighbors.push(newRow * columns + newCol);
      }
    }
  }
  return neighbors;
}

const getNextState = currentStates => {
  return currentStates.map((state, index) => {
    const neighbors = getNeighborIndices(index);
    const liveNeighbors = neighbors.filter(i => currentStates[i]).length;

    if (state && (liveNeighbors < 2 || liveNeighbors > 3)) {
      return false; // Cell dies
    }
    if (!state && liveNeighbors === 3) {
      return true; // Cell becomes alive
    }
    return state; // Remains the same
  });
}

const updateTiles = states => {
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile, index) => {
    if (states[index]) {
      tile.classList.add('clicked');
    } else {
      tile.classList.remove('clicked');
    }
  });
}

const updateTileState = index => {
  const tile = document.querySelectorAll('.tile')[index];
  if (tileStates[index]) {
    tile.classList.add('clicked');
  } else {
    tile.classList.remove('clicked');
  }
}

const gameLoop = () => {
  tileStates = getNextState(tileStates);
  updateTiles(tileStates);
}

document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  setInterval(gameLoop, 1000); // Update every 1 second
});

window.onresize = () => createGrid();
