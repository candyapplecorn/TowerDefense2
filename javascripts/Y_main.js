// list of bullets
// dimensions of window
var winDim = { width: 500, height: 500 };
var DEBUG = true;
// timestamp of last step
var LAST = Date.now();
var ELAPSED = 0;
//var game = new Game(10, 10, winDim.height, winDim.width);
// Canvas setup
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var context = canvas.getContext('2d');
canvas.width = winDim.width;
canvas.height = winDim.height;
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
var scene, game;
$(function(){
game = new Game(10, 10, winDim.height, winDim.width);
scene = new Animator(game, canvas);

console.log("Pathing was successful? ", game._map.calculatePathing());
for (var c = 0; c < game._map._cols - 2; c++) 
    game._map.insertTower(1, c,  new TinyTower(
        game._map._tiles[1][c].position.x,
        game._map._tiles[1][c].position.y
    ));
for (var c = game._map._cols - 1; c > 1; c--) 
    game._map.insertTower(3, c,  new TinyTower(
        game._map._tiles[3][c].position.x,
        game._map._tiles[3][c].position.y));
for (var c = 0; c < game._map._cols - 2; c++) 
    game._map.insertTower(5, c,  new TinyTower(
        game._map._tiles[5][c].position.x,
        game._map._tiles[5][c].position.y));
game._map.insertTower(7, 9,  new TinyTower(
    game._map._tiles[7][9].position.x,
    game._map._tiles[7][9].position.y));
// Normally this would be called on init, and then whenever a tower is added/removed
console.log("Pathing was successful? ", game._map.calculatePathing());

function step(){
    ELAPSED = Date.now() - LAST;
    LAST += ELAPSED;
    // Update all time-dependant entities
    game.step(ELAPSED);

    // Draw everything
    //graphPaper.graphPaper();
    scene.animate(game); // PLACEHOLDER

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
});
