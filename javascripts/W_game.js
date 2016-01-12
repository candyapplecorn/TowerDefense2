class State {
    constructor(){
        this._states = ["place", "sell", "info"];
        this._state = 0;
    };
    addState(string) {
        if (this._states.indexOf(string) == -1)
            this._states.push(string);
    };
    set state(string) {
        var index = this._states.indexOf(string);
        if (index >= 0) this._state = index;
    };
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
        //function pyp(x1, y1, x2, y2){ return Math.sqrt(Math.pow(Math.floor(x1 - x2), 2) + Math.pow(Math.floor(y1 - y2)), 2); }
        //function pyob(a, b){ return pyp(a.x, a.y, b.x, b.y); }
        for (var tow of towers) {
            tow.update(elapsed);
            /*if (tow.ready && tow.target && tow.target.health.alive() && Math.sqrt(Math.pow(Math.floor(tow.position.x - tow.target.position.x), 2) + Math.pow((tow.position.y - tow.target.position.y), 2))<= tow.range) {

                projectiles.push(tow.fire(tow.target));
                continue;
            }
            else*/ 
            if (tow.ready){
                var closestRange = 9999, closestTarget = null, distance = 9999;
                for (var enem of enemies) {
                    distance = Math.sqrt(Math.pow(Math.floor(tow.position.x - enem.position.x), 2) + Math.pow((tow.position.y - enem.position.y), 2));
                    if (distance < closestRange)
                        closestRange = distance, closestTarget = enem;
                    // This is where a data structure for collisions would help
                } // end for
                if (closestRange <= tow.range)
                    projectiles.push(tow.fire(closestTarget));
            }
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
            if (x.target){// && x.target.health) {
                //x.target.health.takeDamage(x.damage.damage);
                player.health.takeDamage(x.damage.damage); // MAKE PLAYER TAKE DAMAGE
                console.log("Player's health: ", player.health.health);
            }
            return false;
        });
        return [ projectiles, enemies];
    };
}
// Game will be passed elapsed time
// and update things accordingly
class Game {
    constructor(mrows = 10, mcols = 10, mh = 400, mw = 400, player = new Player(), state = new State()) {
        this._projectiles = []; // List to contain all projectiles
        this._enemies = [];
        //this._towers = []; // At the moment just a single tower.
        this._collider = new Collider(); 
        //this._elapsed = -2500;
        this._map = new Map(mrows, mcols, mh, mw); // map.tiles.filter(x => x.tower != null).map(x => x.tower)
        this._player = player;
        this._state = state; // Perhaps have a separate state for paused, unpaused, menu, etc
        this._opponent = new opponentNPCAI(this);
        //this._spawnEnemyRate = 7500;  
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
        //this._map.calculatePathing(); // If returns false, error!
        [ this._projectiles, this._enemies ] =
        this._collider.update(elapsed, this._projectiles, this._enemies, this.towers, this._player);
        //this.spawnEnemy(elapsed);
        this._opponent.update(elapsed);
    }
    // step is alias for update
    step (elapsed) { this.update(elapsed); }

    /*spawnEnemy (elapsed) {
        this._elapsed += elapsed;
        if (this._elapsed < this._spawnEnemyRate) return;
        this._enemies.push(new TinyEnemy(
            0,0,this._map._begin
        ));
        this._elapsed -= this._spawnEnemyRate;
    };*/
    onclick (click) {
        // based on state, process the click
        // state ideas:
        /* purchase/place ( WHAT? ) , sell/refund/destroy */
        // WHAT -> itemSelector?
        if(click.state) {
            console.log(this._state.state);
            if (this._state.state == "place") {
                var row = Math.floor(this._map.rows * click.y);
                var col = Math.floor(this._map.cols * click.x);

                var tower = new TinyTower(
                    this._map._tiles[row][col].position.x,
                    this._map._tiles[row][col].position.y );

                if (tower.cost.money <= this._player.money.money)
                    this._player.money.withdraw(
                    this._map.insertTower(click.y, click.x, 
                    tower));
            }
            if (this._state.state == "sell") {
                this._player.money.deposit(
                this._map.removeTower(click.y, click.x));
            }
        }
    };
}
