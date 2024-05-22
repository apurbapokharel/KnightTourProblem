let animate = true;
let deltaW;
let deltaH;
let validMoves = {};
let row = 5;
let col = 5;
let currentPos = [0,0];
let visited = [[0,0]];

function setup() {
  createCanvas(400, 400);
  drawChessGrid();
}

function drawChessGrid(){
  background(220);
  rect(0, 0, width, height);
  deltaW = width/row;
  deltaH = height/col;
  x = 0;
  y = deltaW;

  for(i = 0 ; i < row ; i++){
    line(x, y, x+width, y)
    y += deltaW;
  }
  
  x = deltaH;
  y = 0;
  for(i = 0 ; i < col ; i++){
    line(x, y, x, y+height)
    x += deltaH;
  }
  
  // calculate neighbours
  for(i = 0; i< row; i++){
    for(j = 0; j < col; j++){
      coordinate = [i,j];
      calculateNextCoordinate(coordinate);
    }
  }
  
}

function calculateNextCoordinate(coordinate){
  // eight moves are possible
  let moves = [];
  x = coordinate[0];
  y = coordinate[1];
  //m1
  moves.push([x-2,y+1]);
  moves.push([x-2,y-1]);
  moves.push([x+2,y+1]);
  moves.push([x+2,y-1]);
  
  moves.push([x-1,y-2]);
  moves.push([x-1,y+2]);
  moves.push([x+1,y-2]);
  moves.push([x+1,y+2]);
 
  inRange = [];
  for (var i = 0; i < 8; i++) {
    move = moves[i];
    if(move[0] >= 0 && move[0] < row && move[1] >= 0 && move[1] < col){
      inRange.push(move);
    }
  }
  validMoves[JSON.stringify(coordinate)] = inRange;
}

function moveRook(position){
  xPos = (position[0] * deltaW + deltaW/2);
  yPos = (position[1] * deltaH + deltaH/2);
  visited.push(position);
  currentPos = position;
}

function numberVisitedPosition(){
  for (var i = 0; i < visited.length; i++) {
    x = visited[i][0];
    y = visited[i][1];
    erase();
    circle(x * deltaW + deltaW/2, y * deltaH + deltaH/2, 10);
    noErase();
    text(i , x * deltaW + deltaW/2, y * deltaH + deltaH/2);
  }
 
}

function getNextMove(){
  // console.log("cp", currentPos)
  moveDict = {};
  //get all possible move for the coordinate
  allPossibleMove = validMoves[JSON.stringify(currentPos)];
  //from the move list select the move that has lowest possible move 
  for (var i = 0; i < allPossibleMove.length; i++) {
    count = getCount(allPossibleMove[i]);
    moveDict[JSON.stringify(allPossibleMove[i])] = count;
  }
  //return the move with the lowest 
  console.log(moveDict)
  return findArrayWithLowestValue(moveDict)
}

function getCount(nextCoordinate){
  pm = validMoves[JSON.stringify(nextCoordinate)];
  count = 0;
  if(isInVisited(nextCoordinate)){
    return Infinity;
  }
  for (var i = 0; i < pm.length; i++) {
    nextMove = pm[i];
    // console.log(nextMove, " asd ", currentPos)
    if(!isInVisited(nextMove) && JSON.stringify(nextMove) !== JSON.stringify(currentPos)){
      // console.log("in")
      count++;
    }
  }
  // console.log(nextCoordinate, " = ", count )
  return count;
}

function findArrayWithLowestValue(dict) {
    let lowestValue = Infinity;
    let arrayWithLowestValue;

    // Iterate over the entries of the dictionary
    for (let [key, value] of Object.entries(dict)) {
        // Check if the value associated with the key is lower than the current lowestValue
        if (value < lowestValue) {
            lowestValue = value;
            arrayWithLowestValue = key;
        }
    }

    return arrayWithLowestValue;
}

function isInVisited(coordinate) {
    for (let i = 0; i < visited.length; i++) {
        if (visited[i][0] === coordinate[0] && visited[i][1] === coordinate[1]) {
            return true; // Coordinate found in the array
        }
    }
    return false; // Coordinate not found in the array
}

function draw() {
  if(animate){
    // background(220);
    // drawChessGrid(); 
    if(visited.length != row*col){
      nextMove = getNextMove();
      console.log('moved from ', currentPos, " to ", nextMove);  
      moveRook(JSON.parse(nextMove)); 
      numberVisitedPosition();
    }
    else{
      animate = false;
    }
  }
  else{
      numberVisitedPosition();
  }
}