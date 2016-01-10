
class Animator {
    constructor(game, canvas) { 
        this._game = game; 
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
    };
    update(game) {
        var tilew = this._canvas.width / this._game._map._cols,
            tileh = this._canvas.height / this._game._map._rows,
            mrows = this._game._map._rows, mcols = this._game._map._cols;
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        for (var rows = 0; rows < mrows; rows++)
            for (var cols = 0; cols < mcols; cols++) {
                this._context.fillStyle = this._game._map._tiles[rows][cols].tower != null ? "lightgray" : "white";
                this._context.fillRect(cols * tilew, rows * tileh,
                             tilew, tileh);
            }  
        // Mark the beginning and end tiles.
        this._context.beginPath();
        this._context.strokeStyle = "lime";
        this._context.rect(this._game._map.begin.col * tilew, this._game._map.begin.row * tileh,
                     tilew, tileh);
        this._context.stroke();
        this._context.beginPath();
        this._context.strokeStyle = "red";
        this._context.rect(this._game._map.end.col * tilew, this._game._map.end.row * tileh,
                     tilew, tileh);
        this._context.stroke();
        for (var enemy of this._game.enemies) {
            var x = enemy.position.x, y = enemy.position.y;
            this._context.fillStyle = "green";
            this._context.fillRect(x - 5, y - 5, 10, 10);
            this._context.fillStyle = "black";
            this._context.fillRect(x - 6, y - 9, 12, 3);
            this._context.fillStyle = "red";
            this._context.fillRect(x - 6, y - 8, Math.floor(enemy.health.howdead * 12), 2);
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
