class State {
    constructor(){
        this._states = ["place", "sell", "info"];
        this._state = 0; };
    addState(string) {
        if (this._states.indexOf(string) == -1)
            this._states.push(string); };
    set state(string) {
        var index = this._states.indexOf(string);
        if (index >= 0) this._state = index; };
    get state() { return this._states[this._state]; };
}
// Collider detects collisions between:
//  - Enemies and Towers
//  - Projectiles and Enemies
// Collider takes care of creating projectiles,
// making towers fire, and updating/removing projectiles, 
// towers and enemies.
class Collider {
    constructor(){};
    update(elapsed, projectiles, enemies, towers, player) {
        // Make all projectiles move
        projectiles = projectiles.filter(function(x){
            if (!x.AI.target) return false;    // Perhaps have a separate state for paused, unpaused, menu, etc
            x.move(elapsed); // Always setting done to true
            if (x.done) {
                if (x.target)
                    x.target.health.takeDamage(x.damage.damage);
                return false;
            }
            else return true;
        });
        // Make all towers fire at available enemies if possible
        for (var tow of towers) {
            tow.update(elapsed);
            if (!tow.ready) continue;
            var closestRange = 9999, closestTarget = null, distance = 9999;
            for (var enem of enemies) {
                distance = Math.sqrt(Math.pow(Math.floor(tow.position.x - enem.position.x), 2) + Math.pow((tow.position.y - enem.position.y), 2));
                if (distance < closestRange)
                    closestRange = distance, closestTarget = enem;
                // This is where a data structure for collisions would help
            } 
            if (closestRange <= tow.range)
                projectiles.push(tow.fire(closestTarget));
        }
        // Make all enemies move -- Identical code to projectiles!
        enemies = enemies.filter(function(x){
            if (!x.AI.target || !x.health.alive()) { 
                player.money.deposit(x.money.money);
                player.kills++;
                return false;   
            }
            x.move(elapsed);
            if (!x.done) return true;
            if (x.AI.target.pathValue != 0) { // has a target, is alive and moving, not @ end
                x.AI.target = x.AI.target._prev, x._done = false;
                return true;
            } // has a target, is alive and moving, and has reached the end
            if (x.target)
                player.health.takeDamage(x.damage.damage); // MAKE PLAYER TAKE DAMAGE
            return false;
        });
        return [ projectiles, enemies];
    };
}
// Game will be passed elapsed time
// and update things accordingly
class Game {
    constructor(mrows = 10, mcols = 10, mh = 400, mw = 400, player = new Player(), state = new State()) {
        this._projectiles = []; 
        this._enemies = [];
        this._collider = new Collider(); 
        this._map = new Map(mrows, mcols, mh, mw); 
        this._player = player;
        this._state = state; // Perhaps have a separate state for paused, unpaused, menu, etc
        this._opponent = new opponentNPCAI(this);
    }
    get state() { return this._state; };
    set state(state = "sell") { this._state = state; };
    get player() { return this._player; };
    set player(player = []) { this._player = player; };
    get projectiles() { return this._projectiles; };
    set projectiles(projectiles = []) { this._projectiles = projectiles; };
    get towers() { return this._map.towers; };
    get enemies() { return this._enemies; };
    set enemies(enemies = []) { this._enemies = enemies; };
    /*
     *  elapsed: milliseconds
     */
    update (elapsed) {
        [ this._projectiles, this._enemies ] =
        this._collider.update(elapsed, this._projectiles, this._enemies, this.towers, this._player);
        this._opponent.update(elapsed);
    };
    // step is alias for update
    step (elapsed) { this.update(elapsed); };

    onclick (click) {
        if(click.state) {
            if (this._state.state == "place") {
                var row = Math.floor(this._map.rows * click.y), 
                    col = Math.floor(this._map.cols * click.x);

                var tower = new TinyTower(
                    this._map._tiles[row][col].position.x,
                    this._map._tiles[row][col].position.y );

                if (tower.cost.money <= this._player.money.money)
                    this._player.money.withdraw(
                    this._map.insertTower(click.y, click.x, 
                    tower));
            }
            if (this._state.state == "sell")
                this._player.money.deposit(
                this._map.removeTower(click.y, click.x));
        }
    };
}
