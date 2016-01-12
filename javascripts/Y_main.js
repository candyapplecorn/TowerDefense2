// dimensions of window
var DEBUG = true;
// timestamp of last step
var LAST = Date.now();
var ELAPSED = 0;

var scene, game, clickhandler, player, state, cc, canvas, stats;

$(function(){
state = new State();
cc = new CanvasContainer(state, "canvasContainer");
canvas = cc.canvas;
player = new Player();
game = new Game(15, 15, canvas.height, canvas.width, player, state);
clickhandler = new MouseHandler(canvas, game);
scene = new Animator(canvas, game);
stats = new StatWatcher(game);

//var driver = new Driver(game).drive();

function step(){
    ELAPSED = Date.now() - LAST;
    LAST += ELAPSED;
    if (ELAPSED > 1000) // Prevent tabbing out from destroying game
        ELAPSED = Date.now() - 1000;
    // Update all time-dependant entities
    game.step(ELAPSED);

    // Draw everything
    scene.animate(game); // PLACEHOLDER
    stats.update();

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
});
