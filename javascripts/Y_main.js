// list of bullets
// dimensions of window
var winDim = { width: 500, height: 500 };
var DEBUG = true;
// timestamp of last step
var LAST = Date.now();
var ELAPSED = 0;
var game = new Game();
// PLACEHOLDER for ANIMATE !!
class Animator {
    constructor(game, canvas) { 
        this._game = game; 
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
    };
    update(game) {
        for (var enemy of this._game.enemies) {
            var x = enemy.position.x, y = enemy.position.y;
            this._context.fillStyle = "green";
            this._context.fillRect(x - 5, y - 5, 10, 10);
        }
        for (var tower of this._game.towers) {
            var x = tower.position.x, y = tower.position.y;
            this._context.fillStyle = "black";
            this._context.fillRect(x - 10, y - 10, 20, 20);
        }
        for (var proj of this._game.projectiles) {
            var x = proj.position.x, y = proj.position.y;
            this._context.fillStyle = "red";
            this._context.fillRect(x - 2.5, y - 2.5, 5, 5);
        }
    };
    animate(game) { this.update(game); };
}
var scene = new Animator(game, graphPaper.canvas);

// testing 
var mytower = new TinyTower(0, 0);
var myenemy = new TinyEnemy(winDim.width, winDim.height);
var mybullet = mytower.fire(myenemy);
game.towers.push(mytower);


function step(){
    ELAPSED = Date.now() - LAST;
    LAST += ELAPSED;
    // Update all time-dependant entities
    game.step(ELAPSED);

    // Draw everything
    graphPaper.graphPaper();
    scene.animate(game); // PLACEHOLDER

    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
