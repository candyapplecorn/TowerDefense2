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

function step(){
    ELAPSED = Date.now() - LAST;
    LAST += ELAPSED;
    if (ELAPSED > 1000) // Prevent tabbing out from destroying game
        ELAPSED = 1000 / 30,
        LAST = Date.now();
    // Update all time-dependant entities
    game.step(ELAPSED);

    // Draw everything
    scene.animate(game); // PLACEHOLDER
    stats.update();

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
});
