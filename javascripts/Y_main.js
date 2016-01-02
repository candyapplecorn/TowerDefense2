// list of bullets
// dimensions of window
var winDim = { width: 500, height: 500 };
// timestamp of last step
var LAST = Date.now();
var ELAPSED = 0;
var game = new Game();
// PLACEHOLDER for ANIMATE
function Animator() { this.animate = function(something){} }
var scene = new Animator();


function step(){
    ELAPSED = Date.now() - LAST;
    LAST += ELAPSED;
    // Update all time-dependant entities
    game.step(ELAPSED);
    // Draw everything
    scene.animate(game);
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
